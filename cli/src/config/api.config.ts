// cli/services/api.service.js
const axios = require('axios');
const storage = require('./storage.service');

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: storage.getApiUrl(),
      timeout: 10000
    });

    // Интерцептор для добавления токена
    this.client.interceptors.request.use(async (config) => {
      const token = storage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Интерцептор для обработки ошибок и обновления токена
    this.client.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;

        // Если токен истек (401) и это не повторный запрос
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Пробуем обновить токен
            const refreshToken = storage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await this.client.post('/auth/refresh', {
              refreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            // Сохраняем новые токены
            storage.setTokens(accessToken, newRefreshToken, 30 * 60);

            // Повторяем исходный запрос
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);

          } catch (refreshError) {
            // Не удалось обновить токен - просим войти заново
            storage.clearTokens();
            console.log('❌ Сессия истекла. Пожалуйста, войдите заново.');
            process.exit(1);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Методы API
  async login(email, password) {
    const response = await this.client.post('/auth/login', { email, password });
    
    // Сохраняем токены
    storage.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
      30 * 60 // 30 минут
    );
    
    // Сохраняем информацию о пользователе
    storage.config.set('userId', response.data.user.id);
    storage.config.set('userEmail', response.data.user.email);
    
    return response.data;
  }

  async logout() {
    const refreshToken = storage.getRefreshToken();
    if (refreshToken) {
      await this.client.post('/auth/logout', { refreshToken });
    }
    storage.clearTokens();
    storage.clearCache();
  }

  // Кэшированные запросы
  async getCategories(force = false) {
    if (!force) {
      const cached = storage.getCache('categories');
      if (cached) return cached;
    }

    const response = await this.client.get('/categories');
    storage.setCache('categories', response.data);
    return response.data;
  }
}

module.exports = new ApiService();