require("dotenv").config();
import { AuthValidator } from "../validators/auth.validator.ts";
const bcrypt = require("bcrypt");
import { UserRepository } from "../../../../database/repositories/users.repository.ts";
import { RegisterRequestDto } from "../dto/register.dto.ts";
import { TokenService } from "../../token/service/token.service.ts";
import { LoginRequestDto } from "../dto/login.dto.ts";

export class AuthService {
  saltRounds = 5;
  async registration(email: string, password: string, name: string) {
    const authValidator = new AuthValidator();
    const emailValid = await authValidator.validateEmail(email);
    const hashPassword = await bcrypt.hash(password, this.saltRounds);
    const registerDto = new RegisterRequestDto(email, hashPassword, name);
    const userRepo = new UserRepository(registerDto);
    const registrationResult = await userRepo.create(registerDto);
    if (!registrationResult) throw new Error("register failed");
    const tokenService = new TokenService();
    const tokens = await tokenService.generateTokens({ ...registrationResult });
    await tokenService.saveToken(registrationResult.id, tokens.refreshToken);
    return {
      ...tokens,
      user: registrationResult,
    };
  }

  async login(email: string, password: string) {
    const authValidator = new AuthValidator();
    const emailValid = await authValidator.validateEmail(email);
    const loginDto = new LoginRequestDto(email, password);
    const userRepo = new UserRepository(loginDto);
    const loginResult = await userRepo.findByEmail(
      loginDto.email,
      loginDto.password,
    );
    if (!loginResult) throw new Error("login failed");
        const tokenService = new TokenService();

    const tokens = tokenService.generateTokens({ ...loginResult });
    await tokenService.saveToken(loginResult.id, tokens.refreshToken);

    return {
      ...tokens,
      user: loginResult,
    };
  }

  async logout(id: number) {
    const tokenService = new TokenService();
    const refreshToken = await tokenService.getTokenById(id);
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }


  async refresh(refreshToken) {
    if (!refreshToken) throw new Error("login failed");
        const tokenService = new TokenService();

    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDto = await tokenService.findToken(refreshToken);

   
  }
}
