import { ApiResponse, BankDto, UserBankDto } from "../dto";

export class SettingsApi {
  commanderSettings = async () => {};
  languageSettings = async () => {};
  themeSettings = async () => {};
  addCategory = async () => {};
  putCategory = async () => {};
  deleteCategory = async () => {};
  getAllCategories = async () => {};
  getAllUserCategories = async () => {};
  getCategory = async () => {};

  // api/bank.api.ts

  private baseUrl: string = "/api/banks";

  /**
   * Добавление банка
   */
  addBank = async <T>(
    token: string,
    data: Partial<BankDto>,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  /**
   * Обновление банка
   */
  putBank = async <T>(
    token: string,
    id: string,
    data: Partial<BankDto>,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  /**
   * Получение банка по ID
   */
  getBank = async <T>(token: string, id: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

  /**
   * Удаление банка
   */
  deleteBank = async <T>(
    token: string,
    id: string,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

  /**
   * Получение всех банков
   */
  getAllBanks = async <T>(token: string): Promise<ApiResponse<T>> => {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

  /**
   * Получение всех пользовательских банков
   */
  getAllUserBanks = async <T>(token: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${this.baseUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

  /**
   * Добавление пользовательского банка
   */
  addUserBank = async <T>(
    token: string,
    data: Partial<UserBankDto>,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${this.baseUrl}/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };
}
