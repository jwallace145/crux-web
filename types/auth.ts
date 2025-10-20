/**
 * Authentication related types
 */

export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

// Login and registration responses when using HTTPOnly cookies
// Tokens are set via Set-Cookie headers, not in response body
export interface AuthResponse {
  user: User;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}
