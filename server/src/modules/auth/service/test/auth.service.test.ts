// src/modules/auth/service/__tests__/auth.service.test.ts
import { AuthService } from '../auth.service';
import { UserRepository } from '@repositories/users.repository';
import { TokenService } from '@modules/token/service/token.service';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { ResetPasswordDto } from '../../dto/login.dto';
import { AuthError } from '../../types/auth.error';
import bcrypt from 'bcrypt';

// Мокируем bcrypt
jest.mock('bcrypt');

// Создаем тип для мока пользователя (без password_hash)
type MockUser = {
  id: number;
  email: string;
  name: string;
  default_currency: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockTokenService: jest.Mocked<TokenService>;

  beforeEach(() => {
    // Создаем моки с правильными типами
    mockUserRepository = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      authenticate: jest.fn(),
      updateLastLogin: jest.fn(),
      findByIdWithPassword: jest.fn(),
      update: jest.fn(),
    } as any;

    mockTokenService = {
      generateTokens: jest.fn(),
      saveToken: jest.fn(),
      removeToken: jest.fn(),
      removeAllUserTokens: jest.fn(),
      refreshTokens: jest.fn(),
    } as any;

    authService = new AuthService(mockUserRepository, mockTokenService);
  });

  describe('registration', () => {
    it('должен успешно регистрировать нового пользователя', async () => {
      // Подготовка данных
      const registerDto = new RegisterDto(
        'test@test.com',
        'password123',
        'Test User',
        'RUB'
      );

      // Создаем мок пользователя, который соответствует реальному возвращаемому типу
      const mockUser: MockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        default_currency: 'RUB',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };

      // Настройка моков
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.createUser.mockResolvedValue(mockUser as any);
      mockTokenService.generateTokens.mockReturnValue(mockTokens);
      mockTokenService.saveToken.mockResolvedValue({} as any);

      // Выполнение
      const result = await authService.registration(registerDto);

      // Проверки
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(mockUserRepository.createUser).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
        default_currency: 'RUB'
      });
      expect(mockTokenService.generateTokens).toHaveBeenCalledWith({
        id: 1,
        email: 'test@test.com',
        name: 'Test User'
      });
      expect(mockTokenService.saveToken).toHaveBeenCalledWith(1, 'refresh-token');
      expect(result).toEqual({
        message: 'Account created successfully',
        user: mockUser,
        ...mockTokens
      });
    });
  });

  describe('login', () => {
    it('должен успешно логинить пользователя с правильными данными', async () => {
      const loginDto = new LoginDto('test@test.com', 'password123');
      
      // Используем тот же тип MockUser
      const mockUser: MockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        default_currency: 'RUB',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };

      mockUserRepository.authenticate.mockResolvedValue(mockUser as any);
      mockUserRepository.updateLastLogin.mockResolvedValue();
      mockTokenService.generateTokens.mockReturnValue(mockTokens);
      mockTokenService.saveToken.mockResolvedValue({} as any);

      const result = await authService.login(loginDto);

      expect(mockUserRepository.authenticate).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'Successfully logged in',
        user: mockUser,
        ...mockTokens
      });
    });
  });

  describe('resetPassword', () => {
    it('должен успешно сбрасывать пароль', async () => {
      const resetDto = new ResetPasswordDto(1, 'old-pass', 'new-pass');
      
      // Для этого теста нужен пользователь с паролем
      const mockUserWithPassword = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        password_hash: 'hashed-old-pass',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      };

      mockUserRepository.findByIdWithPassword.mockResolvedValue(mockUserWithPassword as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-pass');
      mockUserRepository.update.mockResolvedValue({} as any);
      mockTokenService.removeAllUserTokens.mockResolvedValue(1);

      const result = await authService.resetPassword(resetDto);

      expect(mockUserRepository.findByIdWithPassword).toHaveBeenCalledWith(1);
      expect(bcrypt.compare).toHaveBeenCalledWith('old-pass', 'hashed-old-pass');
      expect(bcrypt.hash).toHaveBeenCalledWith('new-pass', 10);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        password_hash: 'hashed-new-pass'
      });
      expect(mockTokenService.removeAllUserTokens).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Password changed successfully' });
    });
  });

  describe('logout', () => {
    it('должен успешно разлогинивать', async () => {
      mockTokenService.removeToken.mockResolvedValue(true);

      const result = await authService.logout('refresh-token');

      expect(mockTokenService.removeToken).toHaveBeenCalledWith('refresh-token');
      expect(result).toEqual({ message: 'Successfully logged out' });
    });

    it('должен выбрасывать ошибку при отсутствии токена', async () => {
      await expect(authService.logout(''))
        .rejects
        .toMatchObject({ code: 'TOKEN_MISSING', statusCode: 401 });
    });
  });
});