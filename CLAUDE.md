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

**Available endpoints:**
- `POST /login` - User authentication (returns access_token and refresh_token cookies)
- `POST /logout` - User logout
- `POST /refresh` - Token refresh
- `POST /users` - User registration

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
