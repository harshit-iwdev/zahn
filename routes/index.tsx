import React from 'react';
import { RouteObject } from 'react-router-dom';

// Route configuration types
export interface RouteConfig {
    path: string;
    protected?: boolean;
    public?: boolean;
}

// Route constants for easy reference
export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ONBOARDING: {
        CLINIC: '/onboarding/clinic',
        BANK: '/onboarding/bank',
        AVAILABILITY: '/onboarding/availability',
        SUBSCRIPTION: '/onboarding/subscription',
        TERMS: '/onboarding/terms',
        PROFILE: '/onboarding/profile',
        CONFIRMATION: '/onboarding/confirmation',
    },

    // Protected routes
    DASHBOARD: '/dashboard',
    CALENDAR: '/calendar',
    BOOKINGS: '/bookings',
    NOTIFICATIONS: '/notifications',
    EARNINGS: '/earnings',
    PROFILE: '/profile',
    PLAN_UPGRADE: '/plan-upgrade',
} as const;

// Public routes (accessible without authentication)
export const publicRoutes: RouteConfig[] = [
    {
        path: ROUTES.HOME,
        public: true,
    },
    {
        path: ROUTES.LOGIN,
        public: true,
    },
    {
        path: ROUTES.REGISTER,
        public: true,
    },
    {
        path: ROUTES.ONBOARDING.CLINIC,
        public: true,
    },
    {
        path: ROUTES.ONBOARDING.BANK,
        public: true,
    },
    {
        path: ROUTES.ONBOARDING.AVAILABILITY,
        public: true,
    },
    {
        path: ROUTES.ONBOARDING.SUBSCRIPTION,
        public: true,
    },
    {
        path: ROUTES.ONBOARDING.TERMS,
        public: true,
    },
    {
        path: ROUTES.ONBOARDING.PROFILE,
        public: true,
    },
    {
        path: ROUTES.ONBOARDING.CONFIRMATION,
        public: true,
    },
];

// Protected routes (require authentication)
export const protectedRoutes: RouteConfig[] = [
    {
        path: ROUTES.DASHBOARD,
        protected: true,
    },
    {
        path: ROUTES.CALENDAR,
        protected: true,
    },
    {
        path: ROUTES.BOOKINGS,
        protected: true,
    },
    {
        path: ROUTES.NOTIFICATIONS,
        protected: true,
    },
    {
        path: ROUTES.EARNINGS,
        protected: true,
    },
    {
        path: ROUTES.PROFILE,
        protected: true,
    },
    {
        path: ROUTES.PLAN_UPGRADE,
        protected: true,
    },
];

// All routes combined
export const allRoutes: RouteConfig[] = [
    ...publicRoutes,
    ...protectedRoutes,
];

// Helper function to check if a route is public
export const isPublicRoute = (path: string): boolean => {
    return publicRoutes.some(route => route.path === path);
};

// Helper function to check if a route is protected
export const isProtectedRoute = (path: string): boolean => {
    return protectedRoutes.some(route => route.path === path);
};

// Helper function to get route config by path
export const getRouteConfig = (path: string): RouteConfig | undefined => {
    return allRoutes.find(route => route.path === path);
}; 