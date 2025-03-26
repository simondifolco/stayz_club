import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    title: "New Booking",
    description: "Luxury Suite booked for next week",
    type: "success",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Service Update",
    description: "Room service menu has been updated",
    type: "info",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Low Inventory",
    description: "Spa treatments running low on availability",
    type: "warning",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 4,
    title: "New Review",
    description: "Guest left a 5-star review for your hotel",
    type: "success",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    title: "System Update",
    description: "Scheduled maintenance tonight at 2 AM",
    type: "info",
    time: "5 hours ago",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <Button variant="outline">Mark all as read</Button>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={notification.read ? "opacity-70" : ""}
          >
            <CardContent className="flex items-start space-x-4 p-6">
              <div className="mt-1">
                {notification.type === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {notification.type === "info" && (
                  <Info className="h-5 w-5 text-blue-500" />
                )}
                {notification.type === "warning" && (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <Badge variant="secondary">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.time}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 