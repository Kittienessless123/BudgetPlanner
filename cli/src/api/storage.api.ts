import { WithImplicitCoercion } from "node:buffer";

// cli/services/storage.service.js
const Configstore = require('configstore');
const os = require('os');
const path = require('path');

export class StorageApi {

  config: any;
  tokens: any;
  cache: any;
  accessToken: any;
  accessTokenExpiry: number | undefined;
  
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

 
  // Простое шифрование (в реальном проекте использовать bcrypt)




  // Работа с конфигурацией
  setApiUrl(url: any) {
    this.config.set('apiUrl', url);
  }

  getApiUrl() {
    return this.config.get('apiUrl');
  }

  setDefaultWallet(walletId: any) {
    this.config.set('defaultWallet', walletId);
  }

  // Работа с кэшем
  setCache(key: any, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key: any, maxAge = 5 * 60 * 1000) { // 5 минут по умолчанию
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

