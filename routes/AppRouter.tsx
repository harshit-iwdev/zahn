import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ROUTES, isPublicRoute, isProtectedRoute } from './index';
import {
    RouteComponentProps,
    createLoginRoute,
    createRegistrationRoute,
    createClinicOnboardingRoute,
    createBankAccountOnboardingRoute,
    createAvailabilitySetupRoute,
    createSubscriptionPlanSelectionRoute,
    createTermsAndConditionsRoute,
    createProfileFinalizationRoute,
    createProfileSubmissionConfirmationRoute,
    createAuthenticatedLayoutRoute,
    createDashboardRoute,
    createCalendarRoute,
    createBookingsRoute,
    createNotificationsRoute,
    createEarningsRoute,
    createProfileSettingsRoute,
    createPlanUpgradeRoute
} from './RouteComponents';

interface AppRouterProps {
    isAuthenticated: boolean;
    routeProps: RouteComponentProps;
}

export function AppRouter({ isAuthenticated, routeProps }: AppRouterProps) {
    const location = useLocation();

    // If user is not authenticated and trying to access a protected route, redirect to login
    if (!isAuthenticated && isProtectedRoute(location.pathname)) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // If user is authenticated and trying to access a public route, redirect to dashboard
    if (isAuthenticated && isPublicRoute(location.pathname)) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path={ROUTES.HOME}
                element={createLoginRoute(routeProps)}
            />
            <Route
                path={ROUTES.LOGIN}
                element={createLoginRoute(routeProps)}
            />
            <Route
                path={ROUTES.REGISTER}
                element={createRegistrationRoute(routeProps)}
            />
            <Route
                path={ROUTES.ONBOARDING.CLINIC}
                element={createClinicOnboardingRoute(routeProps)}
            />
            <Route
                path={ROUTES.ONBOARDING.BANK}
                element={createBankAccountOnboardingRoute(routeProps)}
            />
            <Route
                path={ROUTES.ONBOARDING.AVAILABILITY}
                element={createAvailabilitySetupRoute(routeProps)}
            />
            <Route
                path={ROUTES.ONBOARDING.SUBSCRIPTION}
                element={createSubscriptionPlanSelectionRoute(routeProps)}
            />
            <Route
                path={ROUTES.ONBOARDING.TERMS}
                element={createTermsAndConditionsRoute(routeProps)}
            />
            <Route
                path={ROUTES.ONBOARDING.PROFILE}
                element={createProfileFinalizationRoute(routeProps)}
            />
            <Route
                path={ROUTES.ONBOARDING.CONFIRMATION}
                element={createProfileSubmissionConfirmationRoute(routeProps)}
            />

            {/* Protected Routes - Nested under AuthenticatedLayout */}
            <Route
                path="/"
                element={createAuthenticatedLayoutRoute(routeProps)}
            >
                <Route
                    path={ROUTES.DASHBOARD}
                    element={createDashboardRoute(routeProps)}
                />
                <Route
                    path={ROUTES.CALENDAR}
                    element={createCalendarRoute()}
                />
                <Route
                    path={ROUTES.BOOKINGS}
                    element={createBookingsRoute()}
                />
                <Route
                    path={ROUTES.NOTIFICATIONS}
                    element={createNotificationsRoute()}
                />
                <Route
                    path={ROUTES.EARNINGS}
                    element={createEarningsRoute()}
                />
                <Route
                    path={ROUTES.PROFILE}
                    element={createProfileSettingsRoute(routeProps)}
                />
                <Route
                    path={ROUTES.PLAN_UPGRADE}
                    element={createPlanUpgradeRoute(routeProps)}
                />
                <Route
                    path=""
                    element={<Navigate to={ROUTES.DASHBOARD} replace />}
                />
            </Route>

            {/* Catch all route */}
            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />}
            />
        </Routes>
    );
} 