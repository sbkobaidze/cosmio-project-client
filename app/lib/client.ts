import type { Response } from "types";

export const isErrorResponse = (
  response: Response
): response is Response & { success: false } => {
  return !response.success;
};

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3434") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    return data;
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  async register(email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getProtected() {
    return this.request<{ logged_in_as: string }>("/auth/protected", {
      method: "GET",
    });
  }

  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    });
  }
}

// Create and export a singleton instance
export const api = new ApiClient();
