/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { API_CONFIG } from "@/config/api";
import { apiClient } from "@/lib/api-client";
import type { BackendResponse } from "@/types/api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/auth";

export const authService = {
  /**
   * Verify current user authentication via HTTPOnly cookies
   */
  async verifyUser(): Promise<User> {
    const response = await apiClient.get<BackendResponse<User>>(
      API_CONFIG.endpoints.users,
    );

    // Handle wrapped response from backend
    // Backend may return: { user: {...} } or { data: {...} }
    const user = response.user || response.data;
    if (!user) {
      throw new Error("Invalid response format: missing user data");
    }
    return user;
  },

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<BackendResponse<User>>(
      API_CONFIG.endpoints.login,
      credentials,
    );

    // Handle wrapped response from backend
    // Backend may return: { user: {...} } or { data: {...} }
    const user = response.user || response.data;
    if (!user) {
      throw new Error("Invalid response format: missing user data");
    }

    // Cookies are set automatically by the backend
    return { user };
  },

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<BackendResponse<User>>(
      API_CONFIG.endpoints.users,
      credentials,
    );

    // Handle wrapped response from backend
    // Backend may return: { user: {...} } or { data: {...} }
    const user = response.user || response.data;
    if (!user) {
      throw new Error("Invalid response format: missing user data");
    }

    // Cookies are set automatically by the backend
    return { user };
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.endpoints.logout);
    } finally {
      apiClient.clearAuth();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<void> {
    await apiClient.post(API_CONFIG.endpoints.refresh);
    // Cookies are updated automatically by the backend
  },
};
