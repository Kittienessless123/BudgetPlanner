// src/modules/auth/controller/__tests__/auth.controller.test.ts
import { AuthController } from '../auth.controller';
import { AuthService } from '../../service/auth.service';
import type { Request, Response, NextFunction } from 'express';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { AuthError } from '@modules/auth/types/auth.error';

// Мокируем Request и Response
const mockRequest = (body = {}, cookies = {}) => ({
  body,
  cookies
}) as Request;

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext: NextFunction = jest.fn();

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    // Создаем мок сервиса
    mockAuthService = {
      registration: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      refresh: jest.fn(),
      resetPassword: jest.fn(),
    } as any;

    // Создаем контроллер с моком
    authController = new AuthController(mockAuthService);
    
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
  });

  describe('registration', () => {
    it('должен успешно регистрировать и устанавливать куку', async () => {
      const req = mockRequest({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
        default_currency: 'RUB'
      });
      const res = mockResponse();
      
      // Создаем полный объект пользователя, который соответствует Omit<User, "password_hash">
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        default_currency: 'RUB',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      };
      
      const mockResult = {
        message: 'Success',
        user: mockUser,
        refreshToken: 'refresh-token',
        accessToken: 'access-token'
      };
      
      mockAuthService.registration.mockResolvedValue(mockResult);

      await authController.registration(req, res, mockNext);

      expect(mockAuthService.registration).toHaveBeenCalledWith(
        expect.any(RegisterDto)
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'refresh-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax'
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('login', () => {
    it('должен успешно логинить и устанавливать куку', async () => {
      const req = mockRequest({
        email: 'test@test.com',
        password: 'password123'
      });
      const res = mockResponse();
      
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        default_currency: 'RUB',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      };
      
      const mockResult = {
        message: 'Successfully logged in',
        user: mockUser,
        refreshToken: 'refresh-token',
        accessToken: 'access-token'
      };
      
      mockAuthService.login.mockResolvedValue(mockResult);

      await authController.login(req, res, mockNext);

      expect(mockAuthService.login).toHaveBeenCalledWith(expect.any(LoginDto));
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'refresh-token',
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('logout', () => {
    it('должен успешно разлогинивать и очищать куку', async () => {
      const req = mockRequest({}, { token: 'refresh-token' });
      const res = mockResponse();
      
      const mockResult = { message: 'Successfully logged out' };
      mockAuthService.logout.mockResolvedValue(mockResult);

      await authController.logout(req, res, mockNext);

      expect(mockAuthService.logout).toHaveBeenCalledWith('refresh-token');
      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('должен передавать ошибку в next при отсутствии токена', async () => {
      const req = mockRequest({}, {}); // нет токена
      const res = mockResponse();
      const error = new Error('No token');
      
      mockAuthService.logout.mockRejectedValue(error);

      await authController.logout(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('refresh', () => {
    it('должен успешно обновлять токены', async () => {
      const req = mockRequest({}, { token: 'old-refresh-token' });
      const res = mockResponse();
      
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        default_currency: 'RUB',
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      };
      
      const mockResult = {
        message: 'Token refreshed successfully',
        user: mockUser,
        refreshToken: 'new-refresh-token',
        accessToken: 'new-access-token'
      };
      
      mockAuthService.refresh.mockResolvedValue(mockResult);

      await authController.refresh(req, res, mockNext);

      expect(mockAuthService.refresh).toHaveBeenCalledWith('old-refresh-token');
      expect(res.cookie).toHaveBeenCalledWith('token', 'new-refresh-token', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('resetPassword', () => {
    it('должен успешно сбрасывать пароль', async () => {
      const req = mockRequest({
        oldPassword: 'old-pass',
        newPassword: 'new-pass'
      });
      // Добавляем пользователя в req (как это делает authMiddleware)
      (req as any).user = { id: 1 };
      
      const res = mockResponse();
      
      const mockResult = { message: 'Password changed successfully' };
      mockAuthService.resetPassword.mockResolvedValue(mockResult);

      await authController.resetPassword(req, res, mockNext);

      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          oldPassword: 'old-pass',
          newPassword: 'new-pass'
        })
      );
      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('должен передавать ошибку в next при неудаче', async () => {
      const req = mockRequest({});
      (req as any).user = { id: 1 };
      const res = mockResponse();
      const error = new AuthError('OLD_PASSWORD_MISMATCH', 400);
      
      mockAuthService.resetPassword.mockRejectedValue(error);

      await authController.resetPassword(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});