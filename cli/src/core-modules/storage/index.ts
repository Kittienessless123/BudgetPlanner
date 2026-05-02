// services/storage.service.ts
import * as path from "node:path";
import * as fs from "fs";
import { homedir } from "node:os";
import { UserEntity } from "../../types/entities";
import { AuthResponseDto } from "../../dto";

export class StorageService {
  private appDataPath: string;
  private storageFilePath: string;
  private user: UserEntity | null = null;
  private authToken: string | null = null;

  constructor() {
    // Определяем путь для хранения в зависимости от ОС
    const appName = "budget-planner";
    const homeDir = homedir();
    
    switch (process.platform) {
      case "win32":
        this.appDataPath = path.join(process.env.APPDATA || path.join(homeDir, "AppData", "Roaming"), appName);
        break;
      case "darwin":
        this.appDataPath = path.join(homeDir, "Library", "Application Support", appName);
        break;
      default:
        this.appDataPath = path.join(homeDir, ".config", appName);
    }
    
    this.storageFilePath = path.join(this.appDataPath, "auth.json");
    this.init();
    this.loadFromDisk();
  }

  /**
   * Инициализация директории
   */
  private init(): void {
    if (!fs.existsSync(this.appDataPath)) {
      fs.mkdirSync(this.appDataPath, { recursive: true });
    }
  }

  /**
   * Загрузка данных с диска при старте
   */
  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const data = fs.readFileSync(this.storageFilePath, "utf-8");
        const parsed = JSON.parse(data);
        this.user = parsed.user || null;
        this.authToken = parsed.token || null;
      }
    } catch (error) {
      console.error("Failed to load storage:", error);
    }
  }

  /**
   * Сохранение данных на диск
   */
  private saveToDisk(): boolean {
    try {
      const data = {
        user: this.user,
        token: this.authToken,
        savedAt: new Date().toISOString()
      };
      fs.writeFileSync(this.storageFilePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error("Failed to save storage:", error);
      return false;
    }
  }

  /**
   * Установка пользователя
   */
  setUser(user: UserEntity): boolean {
    if (!user) return false;
    this.user = user;
    this.saveToDisk();
    return true;
  }

  /**
   * Получение пользователя
   */
  getUser(): UserEntity | null {
    return this.user;
  }

  /**
   * Установка токена
   */
  setToken(token: string): boolean {
    if (!token) return false;
    this.authToken = token;
    this.saveToDisk();
    return true;
  }

  /**
   * Получение токена
   */
  getToken(): string | null {
    return this.authToken;
  }

  /**
   * Установка полных данных авторизации
   */
  setAuth(auth: AuthResponseDto): boolean {
    if (!auth) return false;
    this.user = auth.user as UserEntity;
    this.authToken = auth.token;
    this.saveToDisk();
    return true;
  }

  /**
   * Получение полных данных авторизации
   */
  getAuth(): { user: UserEntity | null; token: string | null } {
    return {
      user: this.user,
      token: this.authToken
    };
  }

  /**
   * Проверка авторизации
   */
  isAuthenticated(): boolean {
    return this.user !== null && this.authToken !== null;
  }

  /**
   * Удаление всех данных (logout)
   */
  clear(): boolean {
    try {
      this.user = null;
      this.authToken = null;
      if (fs.existsSync(this.storageFilePath)) {
        fs.unlinkSync(this.storageFilePath);
      }
      return true;
    } catch (error) {
      console.error("Failed to clear storage:", error);
      return false;
    }
  }

  /**
   * Получение пути к файлу хранилища
   */
  getStoragePath(): string {
    return this.storageFilePath;
  }
}

// Экспорт синглтона
export const storageService = new StorageService();