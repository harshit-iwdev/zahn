// Environment configuration
export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // Authentication
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'default-jwt-secret',
  AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || 'clinic_auth_token',
  
  // Database
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
  
  // External Services
  S3_BUCKET_NAME: import.meta.env.VITE_S3_BUCKET_NAME,
  S3_REGION: import.meta.env.VITE_S3_REGION || 'us-east-1',
  S3_ACCESS_KEY_ID: import.meta.env.VITE_S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
  
  // Feature Flags
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  
  // Development
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // App Info
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  NODE_ENV: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// Type for environment variables
export type EnvConfig = typeof env;

// Helper function to validate required environment variables
export function validateEnv() {
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_JWT_SECRET',
  ];
  
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars);
  }
  
  return missingVars.length === 0;
}

// Export default configuration
export default env; 