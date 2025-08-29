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
import { setAgreementData, setAvailabilityData, setBankData, setClinicData, setSubscriptionData } from "../reduxSlice/dashboardSlice";
import { ROUTES } from "@/routes";

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
        }
        setShowRegistration(false);
        setShowClinicOnboarding(true);
        navigate('/clinic-onboarding');
    };

    const handleClinicOnboardingComplete = (clinicData?: any) => {
        console.log('clinicData---114', clinicData);
        if (clinicData) {
            setProfileData(prev => ({ ...prev, ...clinicData }));
            dispatch(setClinicData(clinicData));  // Dispatch the clinic data to the Redux store
            // API call to save dentist clinic details
        }
        setShowClinicOnboarding(false);
        setShowBankAccountOnboarding(true);
        navigate(ROUTES.ONBOARDING.BANK);
    };

    const handleBankAccountOnboardingComplete = (bankData?: any) => {
        console.log('bankData---126', bankData);
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
        navigate(ROUTES.ONBOARDING.AVAILABILITY);
    };

    const handleAvailabilitySetupComplete = (availabilityData?: any) => {
        console.log('availabilityData---141', availabilityData);
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
        navigate(ROUTES.ONBOARDING.SUBSCRIPTION);
    };

    const handleSubscriptionPlanSelectionComplete = (subscriptionData?: any) => {
        console.log('subscriptionData---156', subscriptionData);
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
        navigate(ROUTES.ONBOARDING.TERMS);
    };

    const handleTermsAndConditionsComplete = (agreementData?: any) => {
        console.log('agreementData---171', agreementData);
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
        navigate(ROUTES.ONBOARDING.PROFILE);
    };

    const handleProfileFinalizationComplete = () => {
        setShowProfileFinalization(false);
        setShowProfileConfirmation(true);
        // API call to save profile finalization
        navigate(ROUTES.DASHBOARD);
    };

    const handleProfileConfirmationBackToHome = () => {
        setShowProfileConfirmation(false);
        setIsAuthenticated(true);
        // API call to save profile submission confirmation
        navigate(ROUTES.DASHBOARD);
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
        navigate(ROUTES.LOGIN);
    };

    const handleClinicOnboardingBack = () => {
        console.log("handleClinicOnboardingBack");
        setShowClinicOnboarding(false);
        setShowRegistration(true);
        navigate(ROUTES.REGISTER);
    };

    const handleBankAccountOnboardingBack = () => {
        setShowBankAccountOnboarding(false);
        setShowClinicOnboarding(true);
        navigate(ROUTES.ONBOARDING.CLINIC);
    };

    const handleAvailabilitySetupBack = () => {
        setShowAvailabilitySetup(false);
        setShowBankAccountOnboarding(true);
        navigate(ROUTES.ONBOARDING.BANK);
    };

    const handleSubscriptionPlanSelectionBack = () => {
        setShowSubscriptionPlanSelection(false);
        setShowAvailabilitySetup(true);
        navigate(ROUTES.ONBOARDING.AVAILABILITY);
    };

    const handleTermsAndConditionsBack = () => {
        setShowTermsAndConditions(false);
        setShowSubscriptionPlanSelection(true);
        navigate(ROUTES.ONBOARDING.SUBSCRIPTION);
    };

    const handleProfileFinalizationBack = () => {
        setShowProfileFinalization(false);
        setShowTermsAndConditions(true);
        navigate(ROUTES.ONBOARDING.TERMS);
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
        navigate(ROUTES.LOGIN);
    };

    const handleShowRegistration = () => {
        setShowRegistration(true);
        navigate(ROUTES.REGISTER);
    };

    const handleShowLogin = () => {
        setShowRegistration(false);
        navigate(ROUTES.LOGIN);
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
                        />
                    }
                />
                <Route
                    path="/onboarding/bank-account"
                    element={
                        <BankAccountOnboarding
                            onComplete={handleBankAccountOnboardingComplete}
                        />
                    }
                />
                <Route
                    path="/onboarding/availability-setup"
                    element={
                        <AvailabilitySetup
                            onComplete={handleAvailabilitySetupComplete}
                        />
                    }
                />
                <Route
                    path="/onboarding/subscription-plan"
                    element={
                        <SubscriptionPlanSelection
                            onComplete={handleSubscriptionPlanSelectionComplete}
                        />
                    }
                />
                <Route
                    path="/onboarding/terms-and-conditions"
                    element={
                        <TermsAndConditions
                            onComplete={handleTermsAndConditionsComplete}
                            profileData={profileData}
                        />
                    }
                />
            </Routes>
        </div>
    );
} 