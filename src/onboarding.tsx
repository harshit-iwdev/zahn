import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import { ClinicOnboarding } from "./components/ClinicOnboarding";
import { BankAccountOnboarding } from "./components/BankAccountOnboarding";
import { AvailabilitySetup } from "./components/AvailabilitySetup";
import { SubscriptionPlanSelection } from "./components/SubscriptionPlanSelection";
import { TermsAndConditions } from "./components/TermsAndConditions";
import { ProfileFinalization } from "./components/ProfileFinalization";
import { ProfileSubmissionConfirmation } from "./components/ProfileSubmissionConfirmation";
import { AuthenticatedLayout } from "./components/AuthenticatedLayout";
import { setAgreementData, setAvailabilityData, setBankData, setClinicData, setSubscriptionData } from "./reduxSlice/dashboardSlice";
import { useAppDispatch } from "./redux/hooks";
import { ROUTES } from "./routes";


export default function OnboardingPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showClinicOnboarding, setShowClinicOnboarding] = useState(false);
    const [showBankAccountOnboarding, setShowBankAccountOnboarding] = useState(false);
    const [showAvailabilitySetup, setShowAvailabilitySetup] = useState(false);
    const [showSubscriptionPlanSelection, setShowSubscriptionPlanSelection] = useState(false);
    const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
    const [showProfileFinalization, setShowProfileFinalization] = useState(false);
    const [showProfileConfirmation, setShowProfileConfirmation] = useState(false);
    const [showPlanUpgrade, setShowPlanUpgrade] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Store user profile data during onboarding
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        clinicName: '',
        clinicAddress: '',
        specialties: [] as string[],
        bankAccount: {
            accountHolderName: '',
            routingNumber: '',
            accountNumber: '',
            accountType: '',
            bankName: ''
        },
        availability: {
            timezone: '',
            schedule: {},
            totalHours: 0
        },
        subscription: {
            plan_id: '',
            plan_name: '',
            plan_price: 0,
            plan_duration: 0,
            plan_duration_type: '',
            plan_features: [],
        },
        agreements: {
            agreedToAllTerms: false,
            agreedAt: '',
            ipAddress: '',
            userAgent: ''
        }
    });

    const handleLogin = () => {
        setIsAuthenticated(true);
        setShowRegistration(false);
        setShowClinicOnboarding(false);
        setShowBankAccountOnboarding(false);
        setShowAvailabilitySetup(false);
        setShowSubscriptionPlanSelection(false);
        setShowTermsAndConditions(false);
        setShowProfileFinalization(false);
        setShowProfileConfirmation(false);
        setShowPlanUpgrade(false);
        // navigate('/dashboard');
    };

    const handleShowPlanUpgrade = () => {
        setShowPlanUpgrade(true);
    };

    const handlePlanUpgradeComplete = () => {
        // Update user's subscription to Tier 2
        setProfileData(prev => ({
            ...prev,
            subscription: {
                tier: 'tier2',
                planName: 'Tier 2',
                monthlyPrice: 599,
                features: [
                    'Unlimited new-patient bookings',
                    'Priority search ranking',
                    'Enhanced profile with photos & videos',
                    'Direct patient messaging',
                    'Advanced analytics & insights',
                    'Premium customer support'
                ]
            }
        }));
        setShowPlanUpgrade(false);
    };

    const handlePlanUpgradeBack = () => {
        setShowPlanUpgrade(false);
    };

    const handleRegister = (userData?: any) => {
        console.log('userData', userData);
        if (userData) {
            setProfileData(prev => ({ ...prev, ...userData }));
        }
        setShowRegistration(false);
        setShowClinicOnboarding(true);
        navigate('/clinic-onboarding');
    };

    const handleClinicOnboardingComplete = (clinicData?: any) => {
        if (clinicData) {
            setProfileData(prev => ({ ...prev, ...clinicData }));
            dispatch(setClinicData(clinicData));  // Dispatch the clinic data to the Redux store
            // API call to save dentist clinic details
        }
        setShowClinicOnboarding(false);
        setShowBankAccountOnboarding(true);
        navigate('/bank-account-onboarding');
    };

    const handleBankAccountOnboardingComplete = (bankData?: any) => {
        if (bankData) {
            setProfileData(prev => ({
                ...prev,
                bankAccount: { ...prev.bankAccount, ...bankData }
            }));
            dispatch(setBankData(bankData));  // Dispatch the bank data to the Redux store
            // API call to save dentist bank account details
        }
        setShowBankAccountOnboarding(false);
        setShowAvailabilitySetup(true);
        navigate('/availability-setup');
    };

    const handleAvailabilitySetupComplete = (availabilityData?: any) => {
        if (availabilityData) {
            setProfileData(prev => ({
                ...prev,
                availability: { ...prev.availability, ...availabilityData }
            }));
            dispatch(setAvailabilityData(availabilityData));  // Dispatch the availability data to the Redux store
            // API call to save dentist availability details
        }
        setShowAvailabilitySetup(false);
        setShowSubscriptionPlanSelection(true);
        navigate('/subscription-plan-selection');
    };

    const handleSubscriptionPlanSelectionComplete = (subscriptionData?: any) => {
        if (subscriptionData) {
            setProfileData(prev => ({
                ...prev,
                subscription: { ...prev.subscription, ...subscriptionData }
            }));
            dispatch(setSubscriptionData(subscriptionData));  // Dispatch the subscription data to the Redux store
            // API call to save dentist subscription details
        }
        setShowSubscriptionPlanSelection(false);
        setShowTermsAndConditions(true);
        navigate('/terms-and-conditions');
    };

    const handleTermsAndConditionsComplete = (agreementData?: any) => {
        if (agreementData) {
            setProfileData(prev => ({
                ...prev,
                agreements: { ...prev.agreements, ...agreementData }
            }));
            dispatch(setAgreementData(agreementData));  // Dispatch the agreement data to the Redux store
            // API call to save terms and conditions agreement
        }
        setShowTermsAndConditions(false);
        setShowProfileFinalization(true);
    };

    const handleProfileFinalizationComplete = (profileData?: any) => {
        if (profileData) {
            setProfileData(prev => ({ ...prev, ...profileData }));
        }
        setShowProfileFinalization(false);
        setShowProfileConfirmation(true);
        // API call to save profile finalization
        navigate(ROUTES.ONBOARDING.CONFIRMATION)
    };

    const handleProfileConfirmationBackToHome = () => {
        setShowProfileConfirmation(false);
        setIsAuthenticated(true);
        // API call to save profile submission confirmation
        // navigate('/dashboard');
    };

    const handleProfileConfirmationLogOut = () => {
        setShowProfileConfirmation(false);
        setIsAuthenticated(false);

        // Clear all data from the Redux store
        dispatch(setClinicData({}));
        dispatch(setBankData({}));
        dispatch(setAvailabilityData({}));
        dispatch(setSubscriptionData({}));
        dispatch(setAgreementData({}));

        // API call to logout user
        navigate('/login');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setShowRegistration(false);
        setShowClinicOnboarding(false);
        setShowBankAccountOnboarding(false);
        setShowAvailabilitySetup(false);
        setShowSubscriptionPlanSelection(false);
        setShowTermsAndConditions(false);
        setShowProfileFinalization(false);
        setShowProfileConfirmation(false);
        setShowPlanUpgrade(false);
        // API call to logout user
        navigate('/login');
    };

    const handleShowRegistration = () => {
        setShowRegistration(true);
        navigate('/register');
    };

    const handleShowLogin = () => {
        setShowRegistration(false);
        navigate('/login');
    };

    // Show profile submission confirmation
    if (!isAuthenticated && showProfileConfirmation) {
        return (
            <ProfileSubmissionConfirmation
                onBackToHome={handleProfileConfirmationBackToHome}
                onLogOut={handleProfileConfirmationLogOut}
                userEmail={profileData.email}
            />
        );
    }

    // Show profile finalization after terms and conditions
    if (!isAuthenticated && showProfileFinalization) {
        return (
            <ProfileFinalization
                onComplete={handleProfileFinalizationComplete}
                profileData={profileData}
            />
        );
    }

    // Show terms and conditions after subscription plan selection
    if (!isAuthenticated && showTermsAndConditions) {
        return (
            <TermsAndConditions
                onComplete={handleTermsAndConditionsComplete}
                profileData={profileData}
            />
        );
    }

    // Show subscription plan selection after availability setup
    if (!isAuthenticated && showSubscriptionPlanSelection) {
        return (
            <SubscriptionPlanSelection
                onComplete={handleSubscriptionPlanSelectionComplete}
            />
        );
    }

    // Show availability setup after bank account onboarding
    if (!isAuthenticated && showAvailabilitySetup) {
        return (
            <AvailabilitySetup
                onComplete={handleAvailabilitySetupComplete}
            />
        );
    }

    // Show bank account onboarding after clinic onboarding
    if (!isAuthenticated && showBankAccountOnboarding) {
        return (
            <BankAccountOnboarding
                onComplete={handleBankAccountOnboardingComplete}
            />
        );
    }

    // Show clinic onboarding after registration
    if (!isAuthenticated && showClinicOnboarding) {
        return (
            <ClinicOnboarding
                onComplete={handleClinicOnboardingComplete}
            />
        );
    }

    // Show registration screen (sign up)
    if (!isAuthenticated && showRegistration) {
        return (
            <Registration
                onRegister={(data: any) => handleRegister(data)}
                onShowLogin={handleShowLogin}
            />
        );
    }

    // Show login screen if not authenticated
    if (!isAuthenticated) {
        return (
            <Login
                onLogin={handleLogin}
                onShowRegistration={handleShowRegistration}
            />
        );
    }

    // Show authenticated layout with routing
    return (
        <AuthenticatedLayout
            onLogout={handleLogout}
            onShowPlanUpgrade={handleShowPlanUpgrade}
            currentSubscription={profileData.subscription}
            showPlanUpgrade={showPlanUpgrade}
            onPlanUpgradeComplete={handlePlanUpgradeComplete}
            onPlanUpgradeBack={handlePlanUpgradeBack}
        />
    );
}
