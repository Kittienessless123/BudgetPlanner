import bcrypt from "bcrypt";
import { UserRepository } from "@repositories/users.repository.ts";
import {
  TokenService,
  type TokenPayload,
} from "../../token/service/token.service.ts";
import { RegisterDto } from "../dto/register.dto.ts";
import { LoginDto, UpdateNameDto, ResetPasswordDto } from "../dto/login.dto.ts";
import { AuthError } from "../types/auth.error.ts";
import { AUTH_SUCCESS } from "../constances/auth.constances.ts";

export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
  ) {}

  async registration(dto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AuthError("USER_ALREADY_EXISTS", 409);
    }
    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);
    const newUser = await this.userRepository.createUser({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      default_currency: dto.default_currency,
    });

    const payload: TokenPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
    const tokens = this.tokenService.generateTokens(payload);

    await this.tokenService.saveToken(newUser.id, tokens.refreshToken);

    return {
      message: AUTH_SUCCESS.REGISTER_SUCCESS,
      user: newUser,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.authenticate(
      dto.email,
      dto.password,
    );
    if (!user) {
      throw new AuthError("INVALID_CREDENTIALS", 401);
    }

    await this.userRepository.updateLastLogin(user.id);

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const tokens = this.tokenService.generateTokens(payload);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      message: AUTH_SUCCESS.LOGIN_SUCCESS,
      user,
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new AuthError("TOKEN_MISSING", 401);
    }
    const removed = await this.tokenService.removeToken(refreshToken);
    if (!removed) {
     
    }
    return { message: AUTH_SUCCESS.LOGOUT_SUCCESS };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new AuthError("TOKEN_MISSING", 401);
    }

    const result = await this.tokenService.refreshTokens(refreshToken);
    if (!result) {
      throw new AuthError("REFRESH_TOKEN_INVALID", 401);
    }

    return {
      message: AUTH_SUCCESS.TOKEN_REFRESHED,
      user: result.user,
      ...result.tokenPair,
    };
  }


  async resetPassword(dto: ResetPasswordDto) {
    const userWithPassword = await this.userRepository.findByIdWithPassword(
      dto.userId,
    );
    if (!userWithPassword) {
      throw new AuthError("USER_NOT_FOUND", 404);
    }

    const isValid = await bcrypt.compare(
      dto.oldPassword,
      userWithPassword.password_hash,
    );
    if (!isValid) {
      throw new AuthError("OLD_PASSWORD_MISMATCH", 400);
    }

    const newHashed = await bcrypt.hash(dto.newPassword, this.saltRounds);
    await this.userRepository.update(dto.userId, {
      password_hash: newHashed,
    });

    await this.tokenService.removeAllUserTokens(dto.userId);

    return { message: AUTH_SUCCESS.PASSWORD_CHANGED };
  }
}
