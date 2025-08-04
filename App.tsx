import { useState } from "react";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import { ClinicOnboarding } from "./components/ClinicOnboarding";
import { BankAccountOnboarding } from "./components/BankAccountOnboarding";
import { AvailabilitySetup } from "./components/AvailabilitySetup";
import { SubscriptionPlanSelection } from "./components/SubscriptionPlanSelection";
import { TermsAndConditions } from "./components/TermsAndConditions";
import { ProfileFinalization } from "./components/ProfileFinalization";
import { ProfileSubmissionConfirmation } from "./components/ProfileSubmissionConfirmation";
import { PlanUpgrade } from "./components/PlanUpgrade";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { CalendarAvailability } from "./components/CalendarAvailability";
import { MyBookings } from "./components/MyBookings";
import { Notifications } from "./components/Notifications";
import { EarningsSummary } from "./components/EarningsSummary";
import { ProfileSettings } from "./components/ProfileSettings";

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
  const [activeItem, setActiveItem] = useState('dashboard');

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
  };

  const handleShowPlanUpgrade = () => {
    setShowPlanUpgrade(true);
  };

  const handleNavigateToCalendar = () => {
    setActiveItem('calendar');
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
          'Priority in search results',
          'Enhanced profile (photos, videos, reviews)',
          'Direct patient messaging',
          'Advanced analytics & marketing insights',
          'Recall & retention tools'
        ]
      }
    }));
    setShowPlanUpgrade(false);
  };

  const handlePlanUpgradeBack = () => {
    setShowPlanUpgrade(false);
  };

  const handleRegister = (userData?: any) => {
    // Store registration data and move to clinic onboarding
    if (userData) {
      setProfileData(prev => ({ ...prev, ...userData }));
    }
    setShowRegistration(false);
    setShowClinicOnboarding(true);
  };

  const handleClinicOnboardingComplete = (clinicData?: any) => {
    // Store clinic data and move to bank account onboarding
    if (clinicData) {
      setProfileData(prev => ({ ...prev, ...clinicData }));
    }
    setShowClinicOnboarding(false);
    setShowBankAccountOnboarding(true);
  };

  const handleBankAccountOnboardingComplete = (bankData?: any) => {
    // Store bank account data and move to availability setup
    if (bankData) {
      setProfileData(prev => ({ ...prev, bankAccount: bankData }));
    }
    setShowBankAccountOnboarding(false);
    setShowAvailabilitySetup(true);
  };

  const handleAvailabilitySetupComplete = (availabilityData?: any) => {
    // Store availability data and move to subscription plan selection
    if (availabilityData) {
      setProfileData(prev => ({ ...prev, availability: availabilityData }));
    }
    setShowAvailabilitySetup(false);
    setShowSubscriptionPlanSelection(true);
  };

  const handleSubscriptionPlanSelectionComplete = (subscriptionData?: any) => {
    // Store subscription data and move to terms and conditions
    if (subscriptionData) {
      setProfileData(prev => ({ ...prev, subscription: subscriptionData }));
    }
    setShowSubscriptionPlanSelection(false);
    setShowTermsAndConditions(true);
  };

  const handleTermsAndConditionsComplete = (agreementData?: any) => {
    // Store agreement data and move to profile finalization
    if (agreementData) {
      setProfileData(prev => ({ ...prev, agreements: agreementData }));
    }
    setShowTermsAndConditions(false);
    setShowProfileFinalization(true);
  };

  const handleProfileFinalizationComplete = () => {
    // After profile submission, show confirmation screen
    setShowProfileFinalization(false);
    setShowProfileConfirmation(true);
  };

  const handleProfileConfirmationBackToHome = () => {
    // Complete authentication and go to dashboard
    setIsAuthenticated(true);
    setShowProfileConfirmation(false);
  };

  const handleProfileConfirmationLogOut = () => {
    // Log out and return to login screen
    handleLogout();
  };

  const handleClinicOnboardingBack = () => {
    // Go back to registration from clinic onboarding
    setShowClinicOnboarding(false);
    setShowRegistration(true);
  };

  const handleBankAccountOnboardingBack = () => {
    // Go back to clinic onboarding from bank account onboarding
    setShowBankAccountOnboarding(false);
    setShowClinicOnboarding(true);
  };

  const handleAvailabilitySetupBack = () => {
    // Go back to bank account onboarding from availability setup
    setShowAvailabilitySetup(false);
    setShowBankAccountOnboarding(true);
  };

  const handleSubscriptionPlanSelectionBack = () => {
    // Go back to availability setup from subscription plan selection
    setShowSubscriptionPlanSelection(false);
    setShowAvailabilitySetup(true);
  };

  const handleTermsAndConditionsBack = () => {
    // Go back to subscription plan selection from terms and conditions
    setShowTermsAndConditions(false);
    setShowSubscriptionPlanSelection(true);
  };

  const handleProfileFinalizationBack = () => {
    // Go back to terms and conditions from profile finalization
    setShowProfileFinalization(false);
    setShowTermsAndConditions(true);
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
    setActiveItem('dashboard');
    setProfileData({
      fullName: '',
      email: '',
      clinicName: '',
      clinicAddress: '',
      specialties: [],
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
        tier: 'tier1',
        planName: 'Tier 1',
        monthlyPrice: 199,
        features: []
      },
      agreements: {
        agreedToAllTerms: false,
        agreedAt: '',
        ipAddress: '',
        userAgent: ''
      }
    });
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
  };

  const handleShowLogin = () => {
    setShowRegistration(false);
    setShowClinicOnboarding(false);
    setShowBankAccountOnboarding(false);
    setShowAvailabilitySetup(false);
    setShowSubscriptionPlanSelection(false);
    setShowTermsAndConditions(false);
    setShowProfileFinalization(false);
    setShowProfileConfirmation(false);
    setShowPlanUpgrade(false);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <Dashboard 
            onShowPlanUpgrade={handleShowPlanUpgrade} 
            onNavigateToCalendar={handleNavigateToCalendar}
            currentSubscription={profileData.subscription} 
          />
        );
      case 'calendar':
        return <CalendarAvailability />;
      case 'bookings':
        return <MyBookings />;
      case 'notifications':
        return <Notifications />;
      case 'earnings':
        return <EarningsSummary />;
      case 'profile':
        return (
          <ProfileSettings 
            onShowPlanUpgrade={handleShowPlanUpgrade}
            onLogout={handleLogout}
            currentSubscription={profileData.subscription}
          />
        );
      default:
        return (
          <Dashboard 
            onShowPlanUpgrade={handleShowPlanUpgrade} 
            onNavigateToCalendar={handleNavigateToCalendar}
            currentSubscription={profileData.subscription} 
          />
        );
    }
  };

  // Show plan upgrade screen
  if (isAuthenticated && showPlanUpgrade) {
    return (
      <div className="h-screen flex bg-[#F9FAFB]">
        <Sidebar 
          activeItem={activeItem} 
          onItemSelect={setActiveItem}
        />
        <PlanUpgrade 
          onUpgrade={handlePlanUpgradeComplete}
          onBack={handlePlanUpgradeBack}
          currentPlan={profileData.subscription}
        />
      </div>
    );
  }

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

  // Show dashboard if authenticated
  return (
    <div className="h-screen flex bg-[#F9FAFB]">
      <Sidebar 
        activeItem={activeItem} 
        onItemSelect={setActiveItem}
      />
      {renderContent()}
    </div>
  );
}