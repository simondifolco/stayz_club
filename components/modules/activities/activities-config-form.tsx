"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ModuleConfig } from "@/lib/modules/types";

const activitiesConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  enabled: z.boolean(),
  activities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      duration: z.number(),
      maxParticipants: z.number(),
      price: z.number(),
      currency: z.string(),
      images: z.array(z.string()),
      location: z.object({
        name: z.string(),
        address: z.string(),
        coordinates: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      }),
      included: z.array(z.string()),
      requirements: z.array(z.string()),
      cancellationPolicy: z.string(),
    })
  ),
  availability: z.object({
    daysInAdvance: z.number(),
    timeSlots: z.array(
      z.object({
        start: z.string(),
        end: z.string(),
        daysOfWeek: z.array(z.number()),
      })
    ),
    seasonalClosures: z.array(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
        reason: z.string(),
      })
    ),
  }),
  guides: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      languages: z.array(z.string()),
      specialties: z.array(z.string()),
      bio: z.string(),
      image: z.string(),
    })
  ),
  settings: z.object({
    requiresGuide: z.boolean(),
    minBookingNotice: z.number(),
    allowGroupBookings: z.boolean(),
    weatherDependent: z.boolean(),
    difficulty: z.enum(["easy", "moderate", "challenging"]),
    ageRestrictions: z.object({
      minimum: z.number(),
      maximum: z.number().optional(),
    }),
  }),
});

type ActivitiesConfig = z.infer<typeof activitiesConfigSchema>;

interface ActivitiesConfigFormProps {
  initialConfig: Partial<ActivitiesConfig>;
  onSave: (config: ActivitiesConfig) => Promise<void>;
}

export function ActivitiesConfigForm({
  initialConfig,
  onSave,
}: ActivitiesConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ActivitiesConfig>({
    resolver: zodResolver(activitiesConfigSchema),
    defaultValues: {
      id: "activities",
      name: "Activities",
      enabled: true,
      activities: [],
      availability: {
        daysInAdvance: 30,
        timeSlots: [],
        seasonalClosures: [],
      },
      guides: [],
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
      ...initialConfig,
    },
  });

  async function onSubmit(data: ActivitiesConfig) {
    try {
      setIsLoading(true);
      await onSave(data);
      toast.success("Activities configuration saved successfully");
    } catch (error) {
      toast.error("Failed to save activities configuration");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Activities</FormLabel>
                    <FormDescription>
                      Make activities available for bookings
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settings.requiresGuide"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Guide</FormLabel>
                    <FormDescription>
                      All activities must be accompanied by a guide
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settings.allowGroupBookings"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Group Bookings</FormLabel>
                    <FormDescription>
                      Enable multiple participants in a single booking
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="settings.difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settings.minBookingNotice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Booking Notice (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum time required before activity start time
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settings.ageRestrictions.minimum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Age Requirement</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </Form>
  );
} 