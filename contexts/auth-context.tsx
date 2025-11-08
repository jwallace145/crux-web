"use client";

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authService } from "@/lib/auth-service";
import type {
  AuthError,
  LoginCredentials,
  RegisterCredentials,
  UpdateUserRequest,
  User,
} from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserRequest) => Promise<User>;
  error: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      // Verify authentication with the backend via HTTPOnly cookies
      const userData = await authService.verifyUser();
      setUser(userData);
    } catch {
      // If verification fails, user is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is already logged in on mount
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsLoading(false);
      // Return success to allow caller to handle navigation
      return response.user;
    } catch (err) {
      setIsLoading(false);
      const authError: AuthError = {
        message:
          err && typeof err === "object" && "message" in err
            ? (err.message as string)
            : "Login failed",
        statusCode:
          err && typeof err === "object" && "statusCode" in err
            ? (err.statusCode as number)
            : undefined,
      };
      setError(authError);
      throw authError;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.register(credentials);
      setUser(response.user);
      setIsLoading(false);
      // Return success to allow caller to handle navigation
      return response.user;
    } catch (err) {
      setIsLoading(false);
      const authError: AuthError = {
        message:
          err && typeof err === "object" && "message" in err
            ? (err.message as string)
            : "Registration failed",
        statusCode:
          err && typeof err === "object" && "statusCode" in err
            ? (err.statusCode as number)
            : undefined,
      };
      setError(authError);
      throw authError;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: UpdateUserRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateUser(data);
      setUser(updatedUser);
      setIsLoading(false);
      return updatedUser;
    } catch (err) {
      setIsLoading(false);
      const authError: AuthError = {
        message:
          err && typeof err === "object" && "message" in err
            ? (err.message as string)
            : "Failed to update profile",
        statusCode:
          err && typeof err === "object" && "statusCode" in err
            ? (err.statusCode as number)
            : undefined,
      };
      setError(authError);
      throw authError;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
