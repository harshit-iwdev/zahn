import { useState } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'booking' as const,
      message: 'New booking received for August 7 at 3:00 PM with Sarah Johnson',
      timestamp: '2 hours ago',
      isRead: false
    },
    {
      id: '2',
      type: 'cancellation' as const,
      message: 'Patient cancelled appointment #P0081 for Michael Chen',
      timestamp: '4 hours ago',
      isRead: false
    },
    {
      id: '3',
      type: 'admin' as const,
      message: 'Your license was approved by Admin',
      timestamp: '1 day ago',
      isRead: false
    },
    {
      id: '4',
      type: 'booking' as const,
      message: 'New booking received for August 8 at 10:00 AM with Emily Davis',
      timestamp: '2 days ago',
      isRead: true
    },
    {
      id: '5',
      type: 'cancellation' as const,
      message: 'Patient cancelled appointment #P0079 for Robert Wilson',
      timestamp: '3 days ago',
      isRead: true
    },
    {
      id: '6',
      type: 'admin' as const,
      message: 'Monthly report is ready for download',
      timestamp: '1 week ago',
      isRead: true
    },
    {
      id: '7',
      type: 'booking' as const,
      message: 'New booking received for August 9 at 2:30 PM with David Thompson',
      timestamp: '1 week ago',
      isRead: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleMarkRead = (id: string, isRead: boolean) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead }
          : notification
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#1E1E1E] mb-2 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-[#433CE7]" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-3 bg-[#433CE7] text-white hover:bg-[#433CE7] font-medium">
                    {unreadCount} new
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 text-lg">Stay updated with your latest alerts</p>
            </div>
            
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllRead}
                variant="outline"
                className="border-[#433CE7] text-[#433CE7] hover:bg-[#433CE7] hover:text-white font-medium px-6 py-2"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full max-w-sm grid-cols-2 h-12">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-[#433CE7] data-[state=active]:text-white font-medium text-base"
              >
                All ({allNotifications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="unread"
                className="data-[state=active]:bg-[#433CE7] data-[state=active]:text-white font-medium text-base"
              >
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allNotifications.length > 0 ? (
                allNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                  />
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2 text-lg">No notifications</h3>
                  <p className="text-gray-600 text-base">You're all caught up!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                  />
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2 text-lg">No unread notifications</h3>
                  <p className="text-gray-600 text-base">You're all caught up!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}