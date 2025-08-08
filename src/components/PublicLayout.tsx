import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Registration } from "./Registration";
import { ClinicOnboarding } from "./ClinicOnboarding";
import { BankAccountOnboarding } from "./BankAccountOnboarding";
import { AvailabilitySetup } from "./AvailabilitySetup";
import { SubscriptionPlanSelection } from "./SubscriptionPlanSelection";
import { TermsAndConditions } from "./TermsAndConditions";
import { useAppDispatch } from "../redux/hooks";
import { setAgreementData, setAvailabilityData, setBankData, setClinicData, setSubscriptionData, setUserData } from "../reduxSlice/dashboardSlice";

interface PublicLayoutProps { }

export function PublicLayout({ }: PublicLayoutProps) {
    const [activeItem, setActiveItem] = useState('dashboard');

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
            tier: 'tier1', // Default to tier1 for existing users
            planName: 'Tier 1',
            monthlyPrice: 199,
            features: [
                'Basic platform access',
                'Listed in patient-facing search',
                'Up to 5 new-patient bookings/month',
                'Standard search ranking'
            ] as string[]
        },
        agreements: {
            agreedToAllTerms: false,
            agreedAt: '',
            ipAddress: '',
            userAgent: ''
        }
    });

    const handleNavigateToCalendar = () => {
        setActiveItem('calendar');
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
            dispatch(setUserData(userData));  // Dispatch the user data to the Redux store
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

    const handleProfileFinalizationComplete = () => {
        setShowProfileFinalization(false);
        setShowProfileConfirmation(true);
        // API call to save profile finalization
        navigate('/profile-submission-confirmation');
    };

    const handleProfileConfirmationBackToHome = () => {
        setShowProfileConfirmation(false);
        setIsAuthenticated(true);
        // API call to save profile submission confirmation
        navigate('/dashboard');
    };

    const handleProfileConfirmationLogOut = () => {
        setShowProfileConfirmation(false);
        setIsAuthenticated(false);

        // Clear all data from the Redux store
        dispatch(setUserData({}));
        dispatch(setClinicData({}));
        dispatch(setBankData({}));
        dispatch(setAvailabilityData({}));
        dispatch(setSubscriptionData({}));
        dispatch(setAgreementData({}));

        // API call to logout user
        navigate('/login');
    };

    const handleClinicOnboardingBack = () => {
        setShowClinicOnboarding(false);
        setShowRegistration(true);
        navigate('/register');
    };

    const handleBankAccountOnboardingBack = () => {
        setShowBankAccountOnboarding(false);
        setShowClinicOnboarding(true);
        navigate('/clinic-onboarding');
    };

    const handleAvailabilitySetupBack = () => {
        setShowAvailabilitySetup(false);
        setShowBankAccountOnboarding(true);
        navigate('/bank-account-onboarding');
    };

    const handleSubscriptionPlanSelectionBack = () => {
        setShowSubscriptionPlanSelection(false);
        setShowAvailabilitySetup(true);
        navigate('/availability-setup');
    };

    const handleTermsAndConditionsBack = () => {
        setShowTermsAndConditions(false);
        setShowSubscriptionPlanSelection(true);
        navigate('/subscription-plan-selection');
    };

    const handleProfileFinalizationBack = () => {
        setShowProfileFinalization(false);
        setShowTermsAndConditions(true);
        navigate('/terms-and-conditions');
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

    return (
        <div className="h-screen flex bg-[#F9FAFB]">
            <Sidebar
                activeItem={activeItem}
                onItemSelect={setActiveItem}
            />
            <Routes>
                <Route
                    path="/onboarding/register"
                    element={
                        <Registration
                            onRegister={(data: any) => handleRegister(data)}
                            onShowLogin={handleShowLogin}
                        />
                    }
                />
                <Route
                    path="/onboarding/clinic"
                    element={
                        <ClinicOnboarding
                            onComplete={handleClinicOnboardingComplete}
                            onBack={handleClinicOnboardingBack}
                        />
                    }
                />
                <Route
                    path="/onboarding/bank-account"
                    element={
                        <BankAccountOnboarding
                            onComplete={handleBankAccountOnboardingComplete}
                            onBack={handleBankAccountOnboardingBack}
                        />
                    }
                />
                <Route
                    path="/onboarding/availability-setup"
                    element={
                        <AvailabilitySetup
                            onComplete={handleAvailabilitySetupComplete}
                            onBack={handleAvailabilitySetupBack}
                        />
                    }
                />
                <Route
                    path="/onboarding/subscription-plan"
                    element={
                        <SubscriptionPlanSelection
                            onComplete={handleSubscriptionPlanSelectionComplete}
                            onBack={handleSubscriptionPlanSelectionBack}
                        />
                    }
                />
                <Route
                    path="/onboarding/terms-and-conditions"
                    element={
                        <TermsAndConditions
                            onComplete={handleTermsAndConditionsComplete}
                            profileData={profileData}
                            onBack={handleTermsAndConditionsBack}
                        />
                    }
                />
            </Routes>
        </div>
    );
} 