// cli/services/api.service.js
const axios = require('axios');
const storage = require('./storage.service');

class ApiService {
  client: any;
  
  constructor() {
    this.client = axios.create({
      baseURL: storage.getApiUrl(),
      timeout: 10000
    });

    // Интерцептор для добавления токена
    this.client.interceptors.request.use(async (config: { headers: { Authorization: string; }; }) => {
      const token = storage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Интерцептор для обработки ошибок и обновления токена
    this.client.interceptors.response.use(
      (      response: any) => response,
      async (error: { config: any; response: { status: number; }; }) => {
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


}

module.exports = new ApiService();