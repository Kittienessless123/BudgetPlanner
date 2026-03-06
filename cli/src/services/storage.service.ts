// cli/services/storage.service.js
const Configstore = require('configstore');
const os = require('os');
const path = require('path');

class StorageService {
  constructor() {
    // Разные хранилища для разных типов данных
    this.config = new Configstore('budget-cli-config', {
      apiUrl: 'http://localhost:3000',
      defaultWallet: null,
      userId: null,
      userEmail: null
    });
    
    // Токены хранятся отдельно (более чувствительные данные)
    this.tokens = new Configstore('budget-cli-tokens', {
      refreshToken: null,
      expiresAt: null
    });
    
    // Кэш для быстрого доступа
    this.cache = new Configstore('budget-cli-cache', {
      categories: [],
      wallets: [],
      lastUpdate: null
    });
  }

  // Работа с токенами
  setTokens(accessToken, refreshToken, expiresIn) {
    // Access token храним только в памяти (безопаснее)
    this.accessToken = accessToken;
    this.accessTokenExpiry = Date.now() + expiresIn * 1000;
    
    // Refresh token храним в зашифрованном файле
    this.tokens.set('refreshToken', this.encrypt(refreshToken));
    this.tokens.set('expiresAt', Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  getAccessToken() {
    // Проверяем, не истек ли access token
    if (this.accessToken && this.accessTokenExpiry > Date.now()) {
      return this.accessToken;
    }
    return null;
  }

  getRefreshToken() {
    const encrypted = this.tokens.get('refreshToken');
    if (!encrypted) return null;
    
    // Проверяем, не истек ли refresh token
    if (this.tokens.get('expiresAt') < Date.now()) {
      this.clearTokens();
      return null;
    }
    
    return this.decrypt(encrypted);
  }

  // Простое шифрование (в реальном проекте использовать bcrypt)
  encrypt(text) {
    return Buffer.from(text).toString('base64');
  }

  decrypt(encrypted) {
    return Buffer.from(encrypted, 'base64').toString('utf8');
  }

  clearTokens() {
    this.accessToken = null;
    this.tokens.set('refreshToken', null);
    this.tokens.set('expiresAt', null);
  }

  // Работа с конфигурацией
  setApiUrl(url) {
    this.config.set('apiUrl', url);
  }

  getApiUrl() {
    return this.config.get('apiUrl');
  }

  setDefaultWallet(walletId) {
    this.config.set('defaultWallet', walletId);
  }

  // Работа с кэшем
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key, maxAge = 5 * 60 * 1000) { // 5 минут по умолчанию
    const cached = this.cache.get(key);
    if (cached && cached.timestamp > Date.now() - maxAge) {
      return cached.data;
    }
    return null;
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = new StorageService();