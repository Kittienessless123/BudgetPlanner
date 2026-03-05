// services/token.service.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  TokenRepository,
  type CreateTokenDTO,
} from "../../../../database/repositories/token.repository.ts";
import { Token } from "../../../../database/models/token.model.ts";
import { RepositoryError } from "../../../../database/repositories/repository.types.ts";

dotenv.config();

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

  /**
   * Генерация пары токенов
   */
  generateTokens(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "30d",
    });

    console.log("Generated tokens:", { accessToken, refreshToken });

    return { accessToken, refreshToken };
  }

  /**
   * Сохранение refresh токена
   */
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
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
        ip_address: metadata?.ip_address || null,
        user_agent: metadata?.user_agent || null,
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

  /**
   * Удаление токена
   */
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

  /**
   * Удаление всех токенов пользователя
   */
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

  /**
   * Валидация access токена
   */
  validateAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!,
      ) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error("Access token validation failed:", error);
      return null;
    }
  }

  /**
   * Валидация refresh токена
   */
  validateRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!,
      ) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error("Refresh token validation failed:", error);
      return null;
    }
  }

  /**
   * Поиск токена в БД
   */
  async findToken(refreshToken: string): Promise<Token | null> {
    try {
      return await this.tokenRepository.findByToken(refreshToken);
    } catch (error) {
      console.error("Error finding token:", error);
      return null;
    }
  }

  /**
   * Поиск токена с пользователем
   */
  async findTokenWithUser(refreshToken: string): Promise<Token | null> {
    try {
      return await this.tokenRepository.findByTokenWithUser(refreshToken);
    } catch (error) {
      console.error("Error finding token with user:", error);
      return null;
    }
  }

  /**
   * Проверка существования токена
   */
  async tokenExists(refreshToken: string): Promise<boolean> {
    try {
      return await this.tokenRepository.tokenExists(refreshToken);
    } catch (error) {
      console.error("Error checking token existence:", error);
      return false;
    }
  }

  /**
   * Обновление пары токенов
   */
  async refreshTokens(
    oldRefreshToken: string,
    metadata?: {
      ip_address?: string;
      user_agent?: string;
    },
  ): Promise<{ tokenPair: TokenPair; user: TokenPayload } | null> {
    try {
      // Валидируем старый refresh токен
      const payload = this.validateRefreshToken(oldRefreshToken);
      if (!payload) {
        console.log("Invalid refresh token payload");
        return null;
      }

      // Проверяем, что токен есть в БД
      const tokenExists = await this.tokenExists(oldRefreshToken);
      if (!tokenExists) {
        console.log("Token not found in database");
        return null;
      }

      // Удаляем старый токен
      await this.removeToken(oldRefreshToken);

      // Генерируем новую пару
      const tokenPair = this.generateTokens(payload);

      // Сохраняем новый refresh токен
      await this.saveToken(payload.id, tokenPair.refreshToken, metadata);

      return { tokenPair, user: payload };
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      return null;
    }
  }

  /**
   * Получение всех токенов пользователя
   */
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

  /**
   * Получение активных сессий пользователя
   */
  async getUserSessions(userId: number): Promise<
    Array<{
      id: number;
      createdAt: Date;
      expiresAt: Date;
      isActive: boolean;
    }>
  > {
    try {
      const tokens = await this.tokenRepository.findByUserId(userId);

      return tokens.map((token) => ({
        id: token.id,
        createdAt: token.createdAt,
        expiresAt: token.expires_at,
        isActive: token.expires_at > new Date(),
      }));
    } catch (error) {
      throw new RepositoryError(
        "Failed to get user sessions",
        error,
        "getUserSessions",
        "Token",
        { userId },
      );
    }
  }

  /**
   * Очистка просроченных токенов
   */
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

  /**
   * Выход из всех устройств
   */
  async logoutAll(userId: number): Promise<number> {
    return this.removeAllUserTokens(userId);
  }
}

// Экспортируем функцию для создания сервиса (будет использоваться с DI)
export const createTokenService = (tokenRepository: TokenRepository) => {
  return new TokenService(tokenRepository);
};

// Для обратной совместимости или простого использования
let tokenServiceInstance: TokenService | null = null;

export const initTokenService = (tokenRepository: TokenRepository) => {
  tokenServiceInstance = new TokenService(tokenRepository);
  return tokenServiceInstance;
};

export const getTokenService = () => {
  if (!tokenServiceInstance) {
    throw new Error(
      "TokenService not initialized. Call initTokenService first.",
    );
  }
  return tokenServiceInstance;
};

export default tokenServiceInstance;
