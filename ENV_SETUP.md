# Environment Variables Setup

This project uses environment variables for configuration. Follow these steps to set up your environment:

## 1. Create Environment Files

Create the following files in your project root:

### `.env` (for local development)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_SECRET=your-jwt-secret-here
VITE_AUTH_TOKEN_KEY=clinic_auth_token

# Database (if needed)
VITE_DATABASE_URL=your-database-url-here

# External Services
VITE_S3_BUCKET_NAME=your-s3-bucket-name
VITE_S3_REGION=us-east-1
VITE_S3_ACCESS_KEY_ID=your-s3-access-key
VITE_S3_SECRET_ACCESS_KEY=your-s3-secret-key

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### `.env.production` (for production)
```bash
# API Configuration
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_SECRET=your-production-jwt-secret
VITE_AUTH_TOKEN_KEY=clinic_auth_token

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true

# Development
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

## 2. Using Environment Variables in Code

### Import the environment configuration:
```typescript
import { env } from '@/config/env';

// Use environment variables
const apiUrl = env.API_BASE_URL;
const isDebug = env.DEBUG_MODE;
```

### Direct access (not recommended):
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 3. Environment Variable Rules

- **Prefix**: All environment variables must be prefixed with `VITE_` to be accessible in the client-side code
- **Naming**: Use UPPER_SNAKE_CASE for environment variable names
- **Types**: All environment variables are strings by default
- **Validation**: Use the `validateEnv()` function to check for required variables

## 4. Available Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Base URL for API calls | `http://localhost:3000/api` | Yes |
| `VITE_API_TIMEOUT` | API request timeout in ms | `10000` | No |
| `VITE_JWT_SECRET` | JWT secret for authentication | - | Yes |
| `VITE_AUTH_TOKEN_KEY` | Key for storing auth token | `clinic_auth_token` | No |
| `VITE_DATABASE_URL` | Database connection URL | - | No |
| `VITE_S3_BUCKET_NAME` | S3 bucket name | - | No |
| `VITE_S3_REGION` | AWS S3 region | `us-east-1` | No |
| `VITE_S3_ACCESS_KEY_ID` | AWS S3 access key | - | No |
| `VITE_S3_SECRET_ACCESS_KEY` | AWS S3 secret key | - | No |
| `VITE_ENABLE_NOTIFICATIONS` | Enable notifications | `true` | No |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `false` | No |
| `VITE_DEBUG_MODE` | Enable debug mode | `true` | No |
| `VITE_LOG_LEVEL` | Logging level | `info` | No |

## 5. Security Notes

- **Never commit `.env` files** to version control
- **Use `.env.example`** for documentation
- **Validate environment variables** in production
- **Use strong secrets** for JWT and API keys
- **Rotate secrets** regularly

## 6. Development vs Production

- Use `.env` for local development
- Use `.env.production` for production builds
- Use `.env.local` for local overrides (gitignored)
- Use `.env.staging` for staging environment

## 7. Validation

The project includes environment validation. You can validate your environment setup:

```typescript
import { validateEnv } from '@/config/env';

// This will warn about missing required variables
validateEnv();
```

## 8. Troubleshooting

### Environment variables not loading?
1. Make sure the variable name starts with `VITE_`
2. Restart your development server
3. Check the variable name spelling
4. Verify the `.env` file is in the project root

### TypeScript errors?
1. Make sure `@types/node` is installed
2. Check that `vite-env.d.ts` is properly configured
3. Restart your TypeScript server

### Build errors?
1. Ensure all required environment variables are set
2. Check that production variables are configured
3. Validate environment setup with `validateEnv()` 