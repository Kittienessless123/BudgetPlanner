require("dotenv").config();
import { AuthValidator } from "../validators/auth.validator.ts";
const bcrypt = require("bcrypt");
import { UserRepository } from "../../../../database/repositories/users.repository.ts";
import { RegisterRequestDto } from "../dto/register.dto.ts";
import { TokenService } from "../../Token/service/token.service.ts";
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
    const tokens = tokenService.generateTokens({ ...registrationResult });
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
    const tokens = tokenService.generateTokens({ ...loginResult });
    await tokenService.saveToken(loginResult.id, tokens.refreshToken);

    return {
      ...tokens,
      user: loginResult,
    };
  }

  async logout(id: number) {
    const tokenRepo = new TokenRepository();
    const refreshToken = await tokenRepo.getTokenById(id);
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }


  async refresh(refreshToken) {
    if (!refreshToken) throw new Error("login failed");
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDto = await tokenService.findToken(refreshToken);

    

    const user = await getDb().models.User.findOne({
      where: {
        user_id: userData.user_id,
      },
    });

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.user_id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
}
