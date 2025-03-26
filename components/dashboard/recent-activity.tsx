"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/avatars/01.png",
      fallback: "JD",
    },
    action: "viewed",
    target: "Luxury Suite Booking",
    time: "2 minutes ago",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/avatars/02.png",
      fallback: "JS",
    },
    action: "clicked",
    target: "Room Service Menu",
    time: "5 minutes ago",
  },
  {
    id: 3,
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/avatars/03.png",
      fallback: "MJ",
    },
    action: "booked",
    target: "Spa Treatment",
    time: "1 hour ago",
  },
  {
    id: 4,
    user: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/avatars/04.png",
      fallback: "SW",
    },
    action: "viewed",
    target: "Hotel Amenities",
    time: "2 hours ago",
  },
  {
    id: 5,
    user: {
      name: "David Brown",
      email: "david@example.com",
      avatar: "/avatars/05.png",
      fallback: "DB",
    },
    action: "clicked",
    target: "Restaurant Menu",
    time: "3 hours ago",
  },
];

export function RecentActivity() {
  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-8">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>{activity.user.fallback}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.user.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.action} {activity.target}
              </p>
            </div>
            <div className="ml-auto font-medium text-sm text-muted-foreground">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 