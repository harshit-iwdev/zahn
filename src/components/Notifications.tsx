import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { executor } from "@/http/executer";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";


export function Notifications() {
  const [status, setStatus] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [allNotificationCount, setAllNotificationCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications(status, pageNumber, pageSize);
  }, []);

  useEffect(() => {
    fetchNotifications(status, pageNumber, pageSize);
  }, [status, pageNumber]);

  const fetchNotifications = async (status: string, pageNumber: number, pageSize: number) => {
    try {
      // calling get notifications API
      const url = DENTIST_ENDPOINT.GET_NOTIFICATIONS + `/${status}/${pageNumber}/${pageSize}`;
      const exe = executor("get", url);
      const axiosResponse = await exe.execute();
      const apiBody = axiosResponse?.data;
      const notificationsResponse = apiBody?.data ?? apiBody;
      console.log(notificationsResponse, "---notificationsResponse---87");
      if (axiosResponse.status >= 200 && axiosResponse.status < 300 && notificationsResponse) {
        setAllNotifications(notificationsResponse.records);
        setAllNotificationCount(notificationsResponse.totalCount);
        setUnreadCount(notificationsResponse.unreadCount);
      } else {
        console.log('Failed to fetch notifications. Please try again.');
      }
    } catch (err) {
      console.log('Failed to fetch notifications. Please try again.');
    } finally {
      console.log('Notifications fetched successfully');
    }
    
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      // calling mark read notification API
      const url = DENTIST_ENDPOINT.MARK_READ_NOTIFICATION + id;
      const exe = executor("put", url);
      const body = {
        isRead: isRead
      };
      const axiosResponse = await exe.execute(body);
      const apiBody = axiosResponse?.data;
      const notificationResponse = apiBody?.data ?? apiBody;
      if (axiosResponse.status >= 200 && axiosResponse.status < 300 && notificationResponse.id === id) {
        setAllNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, isRead }
              : notification
          )
        );
        if (isRead) {
          setUnreadCount(prev => prev - 1);
        } else {
          setUnreadCount(prev => prev + 1);
        }
      } else {
        console.log('Failed to mark notification as read. Please try again.');
      }
    } catch (err) {
      console.log('Failed to mark notification as read. Please try again.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      // calling mark read notification API
      const url = DENTIST_ENDPOINT.MARK_ALL_READ_NOTIFICATION;
      const exe = executor("put", url);
      const axiosResponse = await exe.execute();
      const apiBody = axiosResponse?.data;
      const notificationResponse = apiBody?.data ?? apiBody;
      if (axiosResponse.status >= 200 && axiosResponse.status < 300 && notificationResponse) {
        setAllNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      } else {
        console.log('Failed to mark notification as read. Please try again.');
      }
    } catch (err) {
      console.log('Failed to mark notification as read. Please try again.');
    }
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
                    {unreadCount} unread
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
          <Tabs defaultValue="all" className="space-y-6" 
            onValueChange={(value) => {
              setStatus(value);
              setPageNumber(1);
            }}
          >
            <TabsList className="grid w-full max-w-sm grid-cols-2 h-12">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-[#433CE7] data-[state=active]:text-white font-medium text-base"
              >
                All ({allNotificationCount})
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