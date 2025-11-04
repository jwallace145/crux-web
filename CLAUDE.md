# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CruxProject is a rock climbing application. This repository (crux-web) is the Next.js 15.5.6 web client that communicates with the backend API. The project uses React 19, TypeScript, and Tailwind CSS 4. Biome is used for linting and formatting instead of ESLint/Prettier.

### Backend API

The backend is a Go Fiber API that serves authentication and application endpoints.

**API URL Configuration:**
The API URL is determined by the following priority order:
1. **NEXT_PUBLIC_API_URL** environment variable (if set) - takes precedence
2. **Development mode** (NODE_ENV=development): Defaults to `http://localhost:3000`
3. **Production builds**: Uses `http://{environment}-api.cruxproject.io`

**API Documentation:**
The backend follows OpenAPI 3.0.3 specification. Full documentation below.

**Available Servers:**
- `http://localhost:3000` - Local development server
- `http://dev-api.cruxproject.io` - Development server

**API Endpoints:**

*Health Check:*
- `GET /health` - Returns service health status

*Authentication:*
- `POST /login` - User authentication (accepts username OR email + password, returns access_token and refresh_token cookies)
- `POST /logout` - User logout (requires authentication, clears cookies)
- `POST /refresh` - Refresh access token using refresh_token cookie

*Users:*
- `POST /users` - Create new user account (registration)
- `GET /users` - Get authenticated user profile (requires authentication)

*Climbs:*
- `POST /climbs` - Log a new climb (requires authentication)
- `GET /climbs?user_id={id}&start_date={date}&end_date={date}` - Get user's climbs with optional date filtering

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Full API URL override (e.g., `http://localhost:3000`)
- `NEXT_PUBLIC_API_ENVIRONMENT`: Environment name (dev, staging, prod) - defaults to "dev"

**Local Development Workflow:**
1. Start the Go Fiber backend on port 3000: `go run main.go` (from backend repo)
2. Start the Next.js frontend: `npm run dev` (from this repo)
3. The frontend will automatically point to `http://localhost:3000` for API requests
4. To test against a deployed API instead, set `NEXT_PUBLIC_API_URL` in `.env.local`

**Authentication:**
- Uses HTTP-only cookies (access_token, refresh_token) for secure authentication
- All API requests include `credentials: 'include'` to send/receive cookies
- Cookies are automatically managed by the browser

### API OpenAPI Specification

The complete OpenAPI 3.0.3 specification for the backend API:

**Response Format:**
All endpoints return a standardized response structure:
```json
{
  "service_name": "crux-backend",
  "version": "1.0.0",
  "environment": "development|staging|production",
  "api_name": "endpoint_name",
  "request_id": "uuid",
  "timestamp": "RFC3339 timestamp",
  "status": "success|error",
  "message": "human-readable message",
  "data": {},  // endpoint-specific data
  "error": {   // only present on errors
    "code": "ERROR_CODE",
    "message": "error message",
    "details": {}
  }
}
```

**Authentication Details:**
- Access tokens are short-lived (used for API requests)
- Refresh tokens are long-lived (used to obtain new access tokens)
- Tokens are stored in HTTP-only cookies named `access_token` and `refresh_token`

**Endpoint Details:**

**/health** (GET)
- No authentication required
- Returns service health status and uptime

**/login** (POST)
- Request body (choose one):
  - `{ "username": "string", "password": "string" }`
  - `{ "email": "string", "password": "string" }`
- Response: User object + session details
- Sets `access_token` and `refresh_token` cookies

**/logout** (POST)
- Requires authentication (access_token cookie)
- Clears authentication cookies
- Revokes session

**/refresh** (POST)
- Requires refresh_token cookie
- Returns new access_token cookie
- Response includes new token expiration time

**/users** (POST - Create User)
- Request body:
  ```json
  {
    "username": "string (3-50 chars, required)",
    "email": "string (email format, required)",
    "password": "string (8-72 chars, required)",
    "first_name": "string (optional, max 100 chars)",
    "last_name": "string (optional, max 100 chars)"
  }
  ```
- Response: Created user object
- Validates username and email uniqueness

**/users** (GET - Get User)
- Requires authentication (access_token cookie)
- Returns authenticated user's profile data
- Response includes: id, username, email, first_name, last_name, created_at, updated_at

**/climbs** (POST - Create Climb)
- Requires authentication
- Request body:
  ```json
  {
    "climb_type": "indoor|outdoor (required)",
    "climb_date": "RFC3339 timestamp (required, cannot be future)",
    "grade": "string (required, max 20 chars)",
    "route_id": "uint (optional, for outdoor climbs)",
    "gym_id": "uint (optional, for indoor climbs)",
    "style": "string (optional, max 50 chars)",
    "completed": "boolean (default: false)",
    "attempts": "int (min: 0, default: 1)",
    "falls": "int (min: 0, default: 0)",
    "rating": "int (0-5, optional)",
    "notes": "string (optional, max 1000 chars)"
  }
  ```
- Response: Created climb object with all fields

**/climbs** (GET - Get Climbs)
- Query parameters:
  - `user_id` (required): User ID to fetch climbs for
  - `start_date` (optional): RFC3339 timestamp for filtering
  - `end_date` (optional): RFC3339 timestamp for filtering
- Returns array of climbs sorted by climb_date descending (most recent first)
- Response includes climb count and filter parameters used

**Error Codes:**
- `INVALID_INPUT` - Invalid request data or validation failure
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required or invalid credentials
- `FORBIDDEN` - Insufficient permissions
- `INTERNAL_ERROR` - Server error
- `DATABASE_ERROR` - Database operation failed
- `VALIDATION_FAILED` - Request validation failed

**Response Status Codes:**
- `200` - Success (GET, POST /logout, POST /refresh)
- `201` - Created (POST /users, POST /climbs)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication errors)
- `500` - Internal Server Error

### Theme Configuration
The application uses a centralized theme configuration for colors (primary, secondary, accent) to allow easy customization of the color scheme.

## Development Commands

### Running the Application
- **Development server**: `npm run dev` (uses Turbopack)
- **Production build**: `npm run build` (uses Turbopack)
- **Start production server**: `npm start`

### Code Quality
- **Lint**: `npm run lint` (runs Biome check)
- **Format**: `npm run format` (runs Biome format with --write)

## Architecture

### Project Structure
- **app/**: Next.js App Router directory
  - `layout.tsx`: Root layout with Geist font configuration
  - `page.tsx`: Homepage component
  - `globals.css`: Global styles and Tailwind directives
- **public/**: Static assets
- **TypeScript configuration**: Uses `@/*` path alias pointing to project root

### Key Technologies
- **Next.js 15**: App Router architecture (not Pages Router)
- **React 19**: Latest React with concurrent features
- **Tailwind CSS 4**: Utility-first CSS framework
- **Biome**: Fast toolchain for linting and formatting (replaces ESLint + Prettier)
- **TypeScript**: Strict mode enabled with ES2017 target
- **Turbopack**: Next.js bundler for faster builds

### Biome Configuration
The project uses Biome with specific settings:
- 2-space indentation
- Git integration enabled with `.gitignore` respect
- Next.js and React recommended rules enabled
- Unknown CSS at-rules warnings disabled
- Auto-organize imports on save

### Font Configuration
The app uses Geist Sans and Geist Mono fonts loaded via `next/font/google` with CSS variables:
- `--font-geist-sans`
- `--font-geist-mono`

## Important Notes

- Always use Biome commands (`npm run lint`, `npm run format`) instead of ESLint/Prettier
- The project uses the App Router pattern, not the legacy Pages Router
- All builds use Turbopack for faster compilation
- TypeScript strict mode is enabled
