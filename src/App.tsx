import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAgreementData, setAvailabilityData, setBankData, setClinicData, setSubscriptionData, setUserData } from "./reduxSlice/dashboardSlice";
import { useAppDispatch } from "./redux/hooks";
import { AppRouter } from "./routes/AppRouter";
import { RouteComponentProps } from "./routes/RouteComponents";
import { ROUTES } from "./routes/index";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowPlanUpgrade(false);
    navigate(ROUTES.DASHBOARD);
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
          'Priority customer support',
          'Featured placement in search results'
        ]
      }
    }));
    setShowPlanUpgrade(false);
    navigate(ROUTES.DASHBOARD);
  };

  const handlePlanUpgradeBack = () => {
    setShowPlanUpgrade(false);
  };

  const handleRegister = (userData?: any) => {
    if (userData) {
      setProfileData(prev => ({ ...prev, ...userData }));
      dispatch(setUserData(userData));
    }
    navigate(ROUTES.ONBOARDING.CLINIC);
  };

  const handleClinicOnboardingComplete = (clinicData?: any) => {
    if (clinicData) {
      setProfileData(prev => ({ ...prev, ...clinicData }));
      dispatch(setClinicData(clinicData));
    }
    navigate(ROUTES.ONBOARDING.BANK);
  };

  const handleBankAccountOnboardingComplete = (bankData?: any) => {
    if (bankData) {
      setProfileData(prev => ({
        ...prev,
        bankAccount: { ...prev.bankAccount, ...bankData }
      }));
      dispatch(setBankData(bankData));
    }
    navigate(ROUTES.ONBOARDING.AVAILABILITY);
  };

  const handleAvailabilitySetupComplete = (availabilityData?: any) => {
    if (availabilityData) {
      setProfileData(prev => ({
        ...prev,
        availability: { ...prev.availability, ...availabilityData }
      }));
      dispatch(setAvailabilityData(availabilityData));
    }
    navigate(ROUTES.ONBOARDING.SUBSCRIPTION);
  };

  const handleSubscriptionPlanSelectionComplete = (subscriptionData?: any) => {
    if (subscriptionData) {
      setProfileData(prev => ({
        ...prev,
        subscription: { ...prev.subscription, ...subscriptionData }
      }));
      dispatch(setSubscriptionData(subscriptionData));
    }
    navigate(ROUTES.ONBOARDING.TERMS);
  };

  const handleTermsAndConditionsComplete = (agreementData?: any) => {
    if (agreementData) {
      setProfileData(prev => ({
        ...prev,
        agreements: { ...prev.agreements, ...agreementData }
      }));
      dispatch(setAgreementData(agreementData));
    }
    navigate(ROUTES.ONBOARDING.PROFILE);
  };

  const handleProfileFinalizationComplete = () => {
    navigate(ROUTES.ONBOARDING.CONFIRMATION);
  };

  const handleProfileConfirmationBackToHome = () => {
    setIsAuthenticated(true);
    setShowPlanUpgrade(false);
    navigate(ROUTES.DASHBOARD);
  };

  const handleProfileConfirmationLogOut = () => {
    setIsAuthenticated(false);
    setShowPlanUpgrade(false);
    navigate(ROUTES.HOME);
  };

  const handleClinicOnboardingBack = () => {
    navigate(ROUTES.REGISTER);
  };

  const handleBankAccountOnboardingBack = () => {
    navigate(ROUTES.ONBOARDING.CLINIC);
  };

  const handleAvailabilitySetupBack = () => {
    navigate(ROUTES.ONBOARDING.BANK);
  };

  const handleSubscriptionPlanSelectionBack = () => {
    navigate(ROUTES.ONBOARDING.AVAILABILITY);
  };

  const handleTermsAndConditionsBack = () => {
    navigate(ROUTES.ONBOARDING.SUBSCRIPTION);
  };

  const handleProfileFinalizationBack = () => {
    navigate(ROUTES.ONBOARDING.TERMS);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowPlanUpgrade(false);
    navigate(ROUTES.HOME);
  };

  const handleShowRegistration = () => {
    navigate(ROUTES.REGISTER);
  };

  const handleShowLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleNavigateToCalendar = () => {
    navigate(ROUTES.CALENDAR);
  };

  // Create route props object
  const routeProps: RouteComponentProps = {
    onLogin: handleLogin,
    onShowRegistration: handleShowRegistration,
    onRegister: handleRegister,
    onShowLogin: handleShowLogin,
    onComplete: (data?: any) => {
      // This will be overridden by specific handlers
    },
    onBack: () => {
      // This will be overridden by specific handlers
    },
    onBackToHome: handleProfileConfirmationBackToHome,
    onLogout: handleLogout,
    onShowPlanUpgrade: handleShowPlanUpgrade,
    onPlanUpgradeComplete: handlePlanUpgradeComplete,
    onPlanUpgradeBack: handlePlanUpgradeBack,
    currentSubscription: profileData.subscription,
    showPlanUpgrade,
    profileData,
    userEmail: profileData.email,
    onNavigateToCalendar: handleNavigateToCalendar,
  };

  return (
    <AppRouter
      isAuthenticated={isAuthenticated}
      routeProps={routeProps}
    />
  );
}