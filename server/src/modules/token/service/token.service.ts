import jwt from "jsonwebtoken";
import {
  TokenRepository,
  type CreateTokenDTO,
} from "@repositories/token.repository.ts";
import { Token } from "@models/token.model.ts";
import { RepositoryError } from "@repositories/repository.types.ts";


export interface TokenPayload {
  id: number;
  email: string;
  name: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class TokenService {
  constructor(private tokenRepository: TokenRepository) {}

  generateTokens(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(
    userId: number,
    refreshToken: string,
    metadata?: {
      ip_address?: string;
      user_agent?: string;
    },
  ): Promise<Token> {
    try {
      const tokenData: CreateTokenDTO = {
        user_id: userId,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
        ip_address: metadata?.ip_address ?? null,
        user_agent: metadata?.user_agent ?? null,
      };

      return await this.tokenRepository.saveToken(tokenData);
    } catch (error) {
      throw new RepositoryError(
        "Failed to save token",
        error,
        "saveToken",
        "Token",
        { userId },
      );
    }
  }

  async removeToken(refreshToken: string): Promise<boolean> {
    try {
      return await this.tokenRepository.removeToken(refreshToken);
    } catch (error) {
      throw new RepositoryError(
        "Failed to remove token",
        error,
        "removeToken",
        "Token",
      );
    }
  }

  async removeAllUserTokens(userId: number): Promise<number> {
    try {
      return await this.tokenRepository.removeAllUserTokens(userId);
    } catch (error) {
      throw new RepositoryError(
        "Failed to remove all user tokens",
        error,
        "removeAllUserTokens",
        "Token",
        { userId },
      );
    }
  }

  validateAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!,
      ) as TokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!,
      ) as TokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  async findToken(refreshToken: string): Promise<Token | null> {
    try {
      return await this.tokenRepository.findByToken(refreshToken);
    } catch {
      return null;
    }
  }

  async findTokenWithUser(refreshToken: string): Promise<Token | null> {
    try {
      return await this.tokenRepository.findByTokenWithUser(refreshToken);
    } catch {
      return null;
    }
  }

  async tokenExists(refreshToken: string): Promise<boolean> {
    try {
      return await this.tokenRepository.tokenExists(refreshToken);
    } catch {
      return false;
    }
  }

  async getTokenByUserId(userId: number): Promise<Token | null> {
    try {
      const tokens = await this.tokenRepository.findByUserId(userId);
      const token = tokens[0];
      return token ?? null;
    } catch {
      return null;
    }
  }

  async refreshTokens(
    oldRefreshToken: string,
    metadata?: {
      ip_address?: string;
      user_agent?: string;
    },
  ): Promise<{ tokenPair: TokenPair; user: TokenPayload } | null> {
    try {
      const payload = this.validateRefreshToken(oldRefreshToken);
      if (!payload) return null;

      const tokenExists = await this.tokenExists(oldRefreshToken);
      if (!tokenExists) return null;

      await this.removeToken(oldRefreshToken);

      const tokenPair = this.generateTokens(payload);
      await this.saveToken(payload.id, tokenPair.refreshToken, metadata);

      return { tokenPair, user: payload };
    } catch {
      return null;
    }
  }

  async getUserTokens(userId: number): Promise<Token[]> {
    try {
      return await this.tokenRepository.findByUserId(userId);
    } catch (error) {
      throw new RepositoryError(
        "Failed to get user tokens",
        error,
        "getUserTokens",
        "Token",
        { userId },
      );
    }
  }

  async getUserSessions(userId: number): Promise<
    Array<{
      id: number;
      createdAt: Date;
      expiresAt: Date;
      isActive: boolean;
    }>
  > {
    const tokens = await this.getUserTokens(userId);
    return tokens.map((token) => ({
      id: token.id,
      createdAt: token.createdAt,
      expiresAt: token.expires_at,
      isActive: token.expires_at > new Date(),
    }));
  }

  async cleanupExpiredTokens(): Promise<number> {
    try {
      return await this.tokenRepository.removeExpiredTokens();
    } catch (error) {
      throw new RepositoryError(
        "Failed to cleanup expired tokens",
        error,
        "cleanupExpiredTokens",
        "Token",
      );
    }
  }

  async logoutAll(userId: number): Promise<number> {
    return this.removeAllUserTokens(userId);
  }
}
