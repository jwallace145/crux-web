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
  UpdateUserRequest,
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

  /**
   * Update user profile
   */
  async updateUser(data: UpdateUserRequest): Promise<User> {
    const formData = new FormData();

    // Add text fields to FormData
    if (data.email !== undefined) formData.append("email", data.email);
    if (data.username !== undefined) formData.append("username", data.username);
    if (data.first_name !== undefined)
      formData.append("first_name", data.first_name);
    if (data.last_name !== undefined)
      formData.append("last_name", data.last_name);

    // Add profile picture if provided
    if (data.profile_picture) {
      formData.append("profile_picture", data.profile_picture);
    }

    const response = await apiClient.put<BackendResponse<User>>(
      API_CONFIG.endpoints.users,
      formData,
    );

    // Handle wrapped response from backend
    const user = response.user || response.data;
    if (!user) {
      throw new Error("Invalid response format: missing user data");
    }

    return user;
  },
};
