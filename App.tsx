import { useState } from "react";
import { Routes, Route, Navigate, Router, useNavigate } from "react-router-dom";
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

export default function App() {
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
    setShowRegistration(false);
    setShowClinicOnboarding(false);
    setShowBankAccountOnboarding(false);
    setShowAvailabilitySetup(false);
    setShowSubscriptionPlanSelection(false);
    setShowTermsAndConditions(false);
    setShowProfileFinalization(false);
    setShowProfileConfirmation(false);
    setShowPlanUpgrade(false);
    navigate('/dashboard');
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
    }
    setShowTermsAndConditions(false);
    setShowProfileFinalization(true);
  };

  const handleProfileFinalizationComplete = () => {
    setShowProfileFinalization(false);
    setShowProfileConfirmation(true);
    navigate('/profile-submission-confirmation');
  };

  const handleProfileConfirmationBackToHome = () => {
    setShowProfileConfirmation(false);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleProfileConfirmationLogOut = () => {
    setShowProfileConfirmation(false);
    setIsAuthenticated(false);
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
        onBack={handleProfileFinalizationBack}
        profileData={profileData}
      />
    );
  }

  // Show terms and conditions after subscription plan selection
  if (!isAuthenticated && showTermsAndConditions) {
    return (
      <TermsAndConditions 
        onComplete={handleTermsAndConditionsComplete}
        onBack={handleTermsAndConditionsBack}
        profileData={profileData}
      />
    );
  }

  // Show subscription plan selection after availability setup
  if (!isAuthenticated && showSubscriptionPlanSelection) {
    return (
      <SubscriptionPlanSelection 
        onComplete={handleSubscriptionPlanSelectionComplete}
        onBack={handleSubscriptionPlanSelectionBack}
      />
    );
  }

  // Show availability setup after bank account onboarding
  if (!isAuthenticated && showAvailabilitySetup) {
    return (
      <AvailabilitySetup 
        onComplete={handleAvailabilitySetupComplete}
        onBack={handleAvailabilitySetupBack}
      />
    );
  }

  // Show bank account onboarding after clinic onboarding
  if (!isAuthenticated && showBankAccountOnboarding) {
    return (
      <BankAccountOnboarding 
        onComplete={handleBankAccountOnboardingComplete}
        onBack={handleBankAccountOnboardingBack}
      />
    );
  }

  // Show clinic onboarding after registration
  if (!isAuthenticated && showClinicOnboarding) {
    return (
      <ClinicOnboarding 
        onComplete={handleClinicOnboardingComplete}
        onBack={handleClinicOnboardingBack}
      />
    );
  }

  // Show registration screen (sign up)
  if (!isAuthenticated && showRegistration) {
    return (
      <Registration 
        onRegister={handleRegister} 
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