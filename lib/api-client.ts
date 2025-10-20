/**
 * API Client
 * Handles all HTTP requests to the backend API
 */

import { API_CONFIG } from "@/config/api";
import type { ApiError, RequestConfig } from "@/types/api";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    try {
      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        credentials: "include", // Include HTTPOnly cookies in requests
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          message: "An unexpected error occurred",
          statusCode: response.status,
        }));
        throw error;
      }

      return response.json();
    } catch (error) {
      if (this.isApiError(error)) {
        throw error;
      }
      throw {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      } as ApiError;
    }
  }

  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      "statusCode" in error
    );
  }

  // Public API methods
  async post<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth = false,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body,
      requiresAuth,
    });
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      requiresAuth,
    });
  }

  // Auth methods (cookies are managed by the browser automatically)
  clearAuth(): void {
    // No client-side token management needed with HTTPOnly cookies
    // The logout endpoint will clear the cookies on the server
  }
}

export const apiClient = new ApiClient();
