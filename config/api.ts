/**
 * API Configuration
 * Centralizes API endpoint configuration based on environment
 *
 * Environment Variables:
 * - NEXT_PUBLIC_API_URL: Full API URL (takes precedence if set)
 * - NEXT_PUBLIC_API_ENVIRONMENT: Environment name (dev, staging, prod, etc.)
 * - NODE_ENV: Node environment (development, production)
 */

export const API_CONFIG = {
  environment: process.env.NEXT_PUBLIC_API_ENVIRONMENT || "dev",
  get baseUrl() {
    // If a full API URL is provided, use it directly
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }

    // In local development, default to localhost
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }

    // In production/deployment, use environment-based URL
    return `https://${this.environment}-api.cruxproject.io`;
  },
  endpoints: {
    login: "/login",
    logout: "/logout",
    refresh: "/refresh",
    users: "/users",
  },
} as const;
