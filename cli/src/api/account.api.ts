import { ApiResponse, UserDto } from "../dto";

export class AccountApi {
  put = async <T>(token: string, data: any): Promise<ApiResponse<T>> => {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  delete = async <T>(token: string): Promise<ApiResponse<T>> => {
    const response = await fetch("/api/users", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });

    return response.json();
  };

  get = async <T>(token: string): Promise<ApiResponse<T>> => {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });

    return response.json();
  };
  changePassword = async <T>(data: {
    token: string;
    password: string;
  }): Promise<ApiResponse<T>> => {
    const response = await fetch("/api/users/changePassword", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };
}
