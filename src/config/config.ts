import { env } from './env';

// API Configuration
export const apiUrl = env.API_BASE_URL;
export const apiTimeout = env.API_TIMEOUT;

// Authentication
export const jwtSecret = env.JWT_SECRET;
export const authTokenKey = env.AUTH_TOKEN_KEY;

// AWS/S3 Configuration
export const awsAccessKey = env.S3_ACCESS_KEY_ID;
export const awsSecretAccessKey = env.S3_SECRET_ACCESS_KEY;
export const bucketName = env.S3_BUCKET_NAME;
export const region = env.S3_REGION;

// Feature Flags
export const enableNotifications = env.ENABLE_NOTIFICATIONS;
export const enableAnalytics = env.ENABLE_ANALYTICS;

// Development
export const debugMode = env.DEBUG_MODE;
export const logLevel = env.LOG_LEVEL;

// App Info
export const appVersion = env.APP_VERSION;
export const isDevelopment = env.IS_DEVELOPMENT;
export const isProduction = env.IS_PRODUCTION;

// Legacy support (keeping for backward compatibility)
export const stripeKey = env.S3_ACCESS_KEY_ID; // Update this when you add Stripe support
