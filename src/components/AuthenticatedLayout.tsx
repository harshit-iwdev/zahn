import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { PlanUpgrade } from "./PlanUpgrade";

interface AuthenticatedLayoutProps {
  onLogout: () => void;
  onShowPlanUpgrade: () => void;
  currentSubscription?: any;
  showPlanUpgrade: boolean;
  onPlanUpgradeComplete?: () => void;
  onPlanUpgradeBack?: () => void;
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
  const location = useLocation();

  // Update active item based on current location
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveItem('dashboard');
    else if (path.includes('/calendar')) setActiveItem('calendar');
    else if (path.includes('/bookings')) setActiveItem('bookings');
    else if (path.includes('/notifications')) setActiveItem('notifications');
    else if (path.includes('/earnings')) setActiveItem('earnings');
    else if (path.includes('/profile')) setActiveItem('profile');
  }, [location.pathname]);

  // Show plan upgrade screen
  if (showPlanUpgrade) {
    return (
      <div className="h-screen flex bg-[#F9FAFB]">
        <Sidebar
          activeItem={activeItem}
          onItemSelect={setActiveItem}
        />
        {/* <PlanUpgrade
          onUpgrade={onPlanUpgradeComplete}
          onBack={onPlanUpgradeBack}
          currentPlan={currentSubscription}
        /> */}
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#F9FAFB]">
      <Sidebar
        activeItem={activeItem}
        onItemSelect={setActiveItem}
      />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
} 