import React from 'react';
import { Login } from '../components/Login';
import { Registration } from '../components/Registration';
import { ClinicOnboarding } from '../components/ClinicOnboarding';
import { BankAccountOnboarding } from '../components/BankAccountOnboarding';
import { AvailabilitySetup } from '../components/AvailabilitySetup';
import { SubscriptionPlanSelection } from '../components/SubscriptionPlanSelection';
import { TermsAndConditions } from '../components/TermsAndConditions';
import { ProfileFinalization } from '../components/ProfileFinalization';
import { ProfileSubmissionConfirmation } from '../components/ProfileSubmissionConfirmation';
import { AuthenticatedLayout } from '../components/AuthenticatedLayout';
import { Dashboard } from '../components/Dashboard';
import { CalendarAvailability } from '../components/CalendarAvailability';
import { MyBookings } from '../components/MyBookings';
import { Notifications } from '../components/Notifications';
import { EarningsSummary } from '../components/EarningsSummary';
import { ProfileSettings } from '../components/ProfileSettings';
import { PlanUpgrade } from '../components/PlanUpgrade';

// Props interfaces for route components
export interface RouteComponentProps {
    onLogin?: () => void;
    onShowRegistration?: () => void;
    onRegister?: (data: any) => void;
    onShowLogin?: () => void;
    onComplete?: (data?: any) => void;
    onBack?: () => void;
    onBackToHome?: () => void;
    onLogout?: () => void;
    onShowPlanUpgrade?: () => void;
    onPlanUpgradeComplete?: () => void;
    onPlanUpgradeBack?: () => void;
    currentSubscription?: any;
    showPlanUpgrade?: boolean;
    profileData?: any;
    userEmail?: string;
    onNavigateToCalendar?: () => void;
    // Added specific completion handlers for onboarding steps
    onClinicComplete?: (data?: any) => void;
    onBankComplete?: (data?: any) => void;
    onAvailabilityComplete?: (data?: any) => void;
    onSubscriptionComplete?: (data?: any) => void;
    onTermsComplete?: (data?: any) => void;
    onProfileFinalizeComplete?: () => void;
}

// Route component factory functions
export const createLoginRoute = (props: RouteComponentProps) => (
    <Login
        onLogin={props.onLogin!}
        onShowRegistration={props.onShowRegistration!}
    />
);

export const createRegistrationRoute = (props: RouteComponentProps) => (
    <Registration
        onRegister={props.onRegister!}
        onShowLogin={props.onShowLogin!}
    />
);

export const createClinicOnboardingRoute = (props: RouteComponentProps) => (
    <ClinicOnboarding
        onComplete={props.onClinicComplete!}
        onBack={props.onBack!}
    />
);

export const createBankAccountOnboardingRoute = (props: RouteComponentProps) => (
    <BankAccountOnboarding
        onComplete={props.onBankComplete!}
        onBack={props.onBack!}
    />
);

export const createAvailabilitySetupRoute = (props: RouteComponentProps) => (
    <AvailabilitySetup
        onComplete={props.onAvailabilityComplete!}
        onBack={props.onBack!}
    />
);

export const createSubscriptionPlanSelectionRoute = (props: RouteComponentProps) => (
    <SubscriptionPlanSelection
        onComplete={props.onSubscriptionComplete!}
        onBack={props.onBack!}
    />
);

export const createTermsAndConditionsRoute = (props: RouteComponentProps) => (
    <TermsAndConditions
        onComplete={(data: any) => props.onTermsComplete!(data)}
        onBack={props.onBack!}
        profileData={props.profileData!}
    />
);

export const createProfileFinalizationRoute = (props: RouteComponentProps) => (
    <ProfileFinalization
        onComplete={props.onProfileFinalizeComplete!}
        onBack={props.onBack!}
        profileData={props.profileData!}
    />
);

export const createProfileSubmissionConfirmationRoute = (props: RouteComponentProps) => (
    <ProfileSubmissionConfirmation
        onBackToHome={props.onBackToHome!}
        onLogOut={props.onLogout!}
        userEmail={props.userEmail!}
    />
);

export const createAuthenticatedLayoutRoute = (props: RouteComponentProps) => (
    <AuthenticatedLayout
        onLogout={props.onLogout!}
        onShowPlanUpgrade={props.onShowPlanUpgrade!}
        currentSubscription={props.currentSubscription!}
        showPlanUpgrade={props.showPlanUpgrade!}
        onPlanUpgradeComplete={props.onPlanUpgradeComplete!}
        onPlanUpgradeBack={props.onPlanUpgradeBack!}
    />
);

export const createDashboardRoute = (props: RouteComponentProps) => (
    <Dashboard
        onShowPlanUpgrade={props.onShowPlanUpgrade!}
        onNavigateToCalendar={props.onNavigateToCalendar!}
        currentSubscription={props.currentSubscription!}
    />
);

export const createCalendarRoute = () => <CalendarAvailability />;
export const createBookingsRoute = () => <MyBookings />;
export const createNotificationsRoute = () => <Notifications />;
export const createEarningsRoute = () => <EarningsSummary />;

export const createProfileSettingsRoute = (props: RouteComponentProps) => (
    <ProfileSettings
        onShowPlanUpgrade={props.onShowPlanUpgrade!}
        onLogout={props.onLogout!}
        currentSubscription={props.currentSubscription!}
    />
);

export const createPlanUpgradeRoute = (props: RouteComponentProps) => (
    <PlanUpgrade
        onUpgrade={props.onPlanUpgradeComplete!}
        onBack={props.onPlanUpgradeBack!}
        currentPlan={props.currentSubscription!}
    />
); 