import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { CalendarAvailability } from "./CalendarAvailability";
import { MyBookings } from "./MyBookings";
import { Notifications } from "./Notifications";
import { EarningsSummary } from "./EarningsSummary";
import { ProfileSettings } from "./ProfileSettings";
import { PlanUpgrade } from "./PlanUpgrade";

interface AuthenticatedLayoutProps {
  onLogout: () => void;
  onShowPlanUpgrade: () => void;
  currentSubscription: {
    tier: string;
    planName: string;
    monthlyPrice: number;
    features: string[];
  };
  showPlanUpgrade: boolean;
  onPlanUpgradeComplete: () => void;
  onPlanUpgradeBack: () => void;
}

export function AuthenticatedLayout({
  onLogout,
  onShowPlanUpgrade,
  currentSubscription,
  showPlanUpgrade,
  onPlanUpgradeComplete,
  onPlanUpgradeBack
}: AuthenticatedLayoutProps) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleNavigateToCalendar = () => {
    setActiveItem('calendar');
  };

  // Show plan upgrade screen
  if (showPlanUpgrade) {
    return (
      <div className="h-screen flex bg-[#F9FAFB]">
        <Sidebar 
          activeItem={activeItem} 
          onItemSelect={setActiveItem}
        />
        <PlanUpgrade 
          onUpgrade={onPlanUpgradeComplete}
          onBack={onPlanUpgradeBack}
          currentPlan={currentSubscription}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#F9FAFB]">
      <Sidebar 
        activeItem={activeItem} 
        onItemSelect={setActiveItem}
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard 
              onShowPlanUpgrade={onShowPlanUpgrade} 
              onNavigateToCalendar={handleNavigateToCalendar}
              currentSubscription={currentSubscription} 
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              onShowPlanUpgrade={onShowPlanUpgrade} 
              onNavigateToCalendar={handleNavigateToCalendar}
              currentSubscription={currentSubscription} 
            />
          } 
        />
        <Route path="/calendar" element={<CalendarAvailability />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/earnings" element={<EarningsSummary />} />
        <Route 
          path="/profile" 
          element={
            <ProfileSettings 
              onShowPlanUpgrade={onShowPlanUpgrade}
              onLogout={onLogout}
              currentSubscription={currentSubscription}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
} 