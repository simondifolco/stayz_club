"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Activity, ModuleSettings } from "@/lib/modules/types";
import { ActivityDialog } from "@/components/modules/activities/activity-dialog";

// Mock data - replace with actual data from your database
const mockActivities: Activity[] = [
  {
    id: "1",
    name: "City Walking Tour",
    description: "Explore the city's historic landmarks",
    duration: 180,
    maxParticipants: 15,
    price: 49.99,
    currency: "EUR",
    images: [],
    location: {
      name: "City Center",
      address: "Main Square",
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    included: ["Professional guide", "Map", "Bottled water"],
    requirements: ["Comfortable walking shoes", "Weather-appropriate clothing"],
    cancellationPolicy: "Free cancellation up to 24 hours before the activity",
  },
  {
    id: "2",
    name: "Wine Tasting Experience",
    description: "Taste local wines with expert sommelier",
    duration: 120,
    maxParticipants: 10,
    price: 79.99,
    currency: "EUR",
    images: [],
    location: {
      name: "Hotel Wine Cellar",
      address: "Hotel Basement Level",
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    included: ["Wine tasting", "Cheese platter", "Expert guidance"],
    requirements: ["Must be 18 or older"],
    cancellationPolicy: "48-hour cancellation policy",
  },
];

export default function ActivitiesModulePage() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings>({
    enabled: true,
    settings: {
      requiresGuide: false,
      minBookingNotice: 24,
      allowGroupBookings: true,
      weatherDependent: false,
      difficulty: "moderate",
      ageRestrictions: {
        minimum: 0,
      },
    },
    availability: {
      daysInAdvance: 30,
      timeSlots: [],
      seasonalClosures: [],
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(
    undefined
  );

  const handleAddActivity = () => {
    setSelectedActivity(undefined);
    setDialogOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter((a) => a.id !== activityId));
    toast.success("Activity deleted successfully");
  };

  const handleSubmitActivity = async (data: Omit<Activity, "id">) => {
    if (selectedActivity) {
      // Update existing activity
      setActivities(
        activities.map((a) =>
          a.id === selectedActivity.id ? { ...data, id: a.id } : a
        )
      );
    } else {
      // Create new activity
      setActivities([...activities, { ...data, id: crypto.randomUUID() }]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/modules">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Activities</h2>
          </div>
          <p className="text-muted-foreground">
            Manage your hotel's activities and experiences.
          </p>
        </div>
        <Button onClick={handleAddActivity}>
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardHeader>
              <CardTitle>{activity.name}</CardTitle>
              <CardDescription>{activity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Duration:</span>
                  <span className="text-sm font-medium">{activity.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Max Participants:</span>
                  <span className="text-sm font-medium">{activity.maxParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Price:</span>
                  <span className="text-sm font-medium">
                    {activity.price} {activity.currency}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground">{activity.location.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.location.address}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleEditActivity(activity)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteActivity(activity.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activity={selectedActivity}
        onSubmit={handleSubmitActivity}
      />
    </div>
  );
} 