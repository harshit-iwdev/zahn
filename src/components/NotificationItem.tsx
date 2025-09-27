import { useState } from "react";
import { Calendar, AlertTriangle, CheckCircle, Circle, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface NotificationItemProps {
  notification: {
    id: string;
    type: 'booking' | 'cancellation' | 'admin' | 'confirmed' | 'rejected';
    message: string;
    timestamp: string;
    isRead: boolean;
  };
  onMarkRead: (id: string, isRead: boolean) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-[#433CE7]" />;
      case 'cancellation':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'admin':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBadgeText = () => {
    switch (notification.type) {
      case 'booking':
        return 'New Booking';
      case 'confirmed':
        return 'Confirmed';
      case 'rejected':
        return 'Rejected';
      case 'cancellation':
        return 'Cancellation';
      case 'admin':
        return 'Admin Approval';
      default:
        return 'Notification';
    }
  };

  const getBadgeColor = () => {
    switch (notification.type) {
      case 'booking':
        return 'bg-[#E5E3FB] text-[#433CE7] hover:bg-[#E5E3FB]';
      case 'cancellation':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'admin':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  return (
    <div
      className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${
        notification.isRead 
          ? 'bg-white border-gray-200' 
          : 'bg-[#E5E3FB] border-[#433CE7]/30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Badge className={`text-xs font-medium ${getBadgeColor()}`}>
                {getBadgeText()}
              </Badge>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-[#433CE7] rounded-full"></div>
              )}
            </div>
            <span className="text-sm text-gray-500 flex-shrink-0">
              {notification.timestamp}
            </span>
          </div>
          
          <p className={`text-base leading-relaxed ${
            notification.isRead ? 'text-gray-700' : 'text-[#1E1E1E] font-medium'
          }`}>
            {notification.message}
          </p>
        </div>

        {/* Read/Unread Toggle */}
        <div className="flex items-center flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onMarkRead(notification.id, !notification.isRead)}
            className={`h-10 w-10 p-0 transition-all duration-200 ${
              isHovered || !notification.isRead
                ? 'opacity-100' 
                : 'opacity-0'
            } hover:bg-gray-100`}
            title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
          >
            {notification.isRead ? (
              <Circle className="h-5 w-5 text-gray-600" />
            ) : (
              <Check className="h-5 w-5 text-[#433CE7]" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}