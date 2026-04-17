# Environment Setup Guide

This guide explains how to configure environment variables for local development.

## Quick Start

1. **Copy the example file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Get your Clerk test key:**
   - Go to https://dashboard.clerk.com
   - Select your application
   - Navigate to "API Keys"
   - Copy the **Publishable Key**

3. **Update `.env.local`:**

   ```
   CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   API_URL=https://localhost:44345/api
   ```

4. **Start development:**
   ```bash
   pnpm install
   pnpm start
   ```

## Environment Variables

### Required Variables

| Variable                | Description              | Example                       |
| ----------------------- | ------------------------ | ----------------------------- |
| `CLERK_PUBLISHABLE_KEY` | Clerk authentication key | `pk_test_abc123...`           |
| `API_URL`               | Backend API endpoint     | `https://localhost:44345/api` |

### Development Values

```
CLERK_PUBLISHABLE_KEY=pk_test_[get-from-clerk-dashboard]
API_URL=https://localhost:44345/api
```

### Production Values

Production values are configured in deployment platforms:

- **Render**: Environment Variables in dashboard
- **Vercel**: Settings → Environment Variables
- **Docker**: Use `--env-file` or orchestration secrets

## Important Security Notes

⚠️ **NEVER commit `.env.local` to git** - it's automatically ignored

⚠️ **NEVER hardcode secrets** - always use environment variables

⚠️ **Never share your test keys** - regenerate them if exposed

## File Locations

- `.env.local` - Your local environment (git-ignored)
- `.env.example` - Template for all environment variables
- `src/environments/environment.ts` - Development configuration
- `src/environments/environment.prod.ts` - Production configuration
- `src/types/environment.d.ts` - TypeScript types for `window.__ENV__`

## How It Works

1. **main.ts** loads environment variables into `window.__ENV__`
2. **environment files** read from `window.__ENV__` using `getEnvVariable()`
3. **Services** access values via `environment.clerkKey` and `environment.apiUrl`

## Troubleshooting

**"CLERK_PUBLISHABLE_KEY is empty"**

- Check that `.env.local` exists
- Verify the Clerk key is set correctly
- Restart the dev server: `pnpm start`

**"API calls failing"**

- Verify `API_URL` in `.env.local` is correct
- Check that the backend is running
- Check network tab in browser DevTools

**"Template errors in IDE"**

- Clear cache: `rm -rf .angular/cache`
- Restart TypeScript server
- Ensure `src/types/environment.d.ts` exists

## Environment Persistence

- **Development:** Values persist in `.env.local` (git-ignored)
- **Production:** Values injected by deployment platform
- **CI/CD:** Values passed as GitHub Actions secrets

## Questions?

See [SECURITY.md](SECURITY.md) for detailed security information.
