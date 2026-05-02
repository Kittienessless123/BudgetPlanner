import { ApiResponse, AuthResponseDto } from "../dto";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LogoutRequest {
  token: string;
}

export class AuthApi {
  /**
   * Login user
   */
  login = async <T>(data: LoginRequest): Promise<ApiResponse<T>> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  /**
   * Register user
   */
  register = async <T>(data: RegisterRequest): Promise<ApiResponse<T>> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  /**
   * Logout user
   */
  logout = async <T>(data: LogoutRequest): Promise<ApiResponse<T>> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  /**
   * Refresh token
   */
  refresh = async <T>(refreshToken: string): Promise<ApiResponse<T>> => {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    return response.json();
  };
}