import { useNavigate, useLocation } from "react-router-dom";
import { 
  Calendar, 
  BookOpen, 
  Bell, 
  DollarSign, 
  User, 
  LayoutDashboard
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemSelect: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
  { id: 'bookings', label: 'My Bookings', icon: BookOpen, path: '/bookings' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { id: 'earnings', label: 'Earnings Summary', icon: DollarSign, path: '/earnings' },
  { id: 'profile', label: 'Profile & Settings', icon: User, path: '/profile' },
];

export function Sidebar({ activeItem, onItemSelect }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item: typeof menuItems[0]) => {
    onItemSelect(item.id);
    navigate(item.path);
  };

  // Determine active item based on current location
  const currentActiveItem = menuItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-[#1E1E1E]">Zahn</h1>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentActiveItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#6246EA] text-white font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}