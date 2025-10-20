/**
 * API related types
 */

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Backend wraps responses with metadata
export interface BackendResponse<T = unknown> {
  service_name?: string;
  version?: string;
  environment?: string;
  api_name?: string;
  request_id?: string;
  data?: T;
  user?: T;
  [key: string]: unknown;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  requiresAuth?: boolean;
}
