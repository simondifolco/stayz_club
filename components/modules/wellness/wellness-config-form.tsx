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

const wellnessConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  enabled: z.boolean(),
  services: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.enum(["massage", "spa", "beauty", "fitness", "meditation"]),
      duration: z.number(),
      price: z.number(),
      currency: z.string(),
      images: z.array(z.string()),
      benefits: z.array(z.string()),
      contraindications: z.array(z.string()),
    })
  ),
  practitioners: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      specialties: z.array(z.string()),
      certifications: z.array(z.string()),
      bio: z.string(),
      image: z.string(),
      languages: z.array(z.string()),
      availability: z.array(
        z.object({
          dayOfWeek: z.number(),
          startTime: z.string(),
          endTime: z.string(),
        })
      ),
    })
  ),
  facilities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(["treatment_room", "sauna", "pool", "gym", "yoga_studio"]),
      capacity: z.number(),
      amenities: z.array(z.string()),
      images: z.array(z.string()),
    })
  ),
  settings: z.object({
    requiresMedicalForm: z.boolean(),
    allowsCancellation: z.boolean(),
    cancellationPolicy: z.object({
      deadline: z.number(), // hours before appointment
      refundPercentage: z.number(),
    }),
    minBookingNotice: z.number(),
    maxBookingsPerDay: z.number(),
    genderPreference: z.boolean(), // Allow gender preference for practitioners
  }),
  availability: z.object({
    daysInAdvance: z.number(),
    operatingHours: z.array(
      z.object({
        dayOfWeek: z.number(),
        start: z.string(),
        end: z.string(),
      })
    ),
    breakTimes: z.array(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    ),
    holidayClosures: z.array(
      z.object({
        date: z.string(),
        reason: z.string(),
      })
    ),
  }),
});

type WellnessConfig = z.infer<typeof wellnessConfigSchema>;

interface WellnessConfigFormProps {
  initialConfig: Partial<WellnessConfig>;
  onSave: (config: WellnessConfig) => Promise<void>;
}

export function WellnessConfigForm({
  initialConfig,
  onSave,
}: WellnessConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WellnessConfig>({
    resolver: zodResolver(wellnessConfigSchema),
    defaultValues: {
      id: "wellness",
      name: "Wellness",
      enabled: true,
      services: [],
      practitioners: [],
      facilities: [],
      settings: {
        requiresMedicalForm: true,
        allowsCancellation: true,
        cancellationPolicy: {
          deadline: 24,
          refundPercentage: 50,
        },
        minBookingNotice: 4,
        maxBookingsPerDay: 20,
        genderPreference: true,
      },
      availability: {
        daysInAdvance: 30,
        operatingHours: [],
        breakTimes: [],
        holidayClosures: [],
      },
      ...initialConfig,
    },
  });

  async function onSubmit(data: WellnessConfig) {
    try {
      setIsLoading(true);
      await onSave(data);
      toast.success("Wellness configuration saved successfully");
    } catch (error) {
      toast.error("Failed to save wellness configuration");
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
                    <FormLabel className="text-base">Enable Wellness Services</FormLabel>
                    <FormDescription>
                      Make wellness services available for bookings
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
              name="settings.requiresMedicalForm"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Medical Form</FormLabel>
                    <FormDescription>
                      Guests must complete a medical form before booking
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
              name="settings.genderPreference"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Gender Preference</FormLabel>
                    <FormDescription>
                      Enable guests to select practitioner gender preference
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
            <CardTitle>Booking Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    Minimum time required before appointment
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settings.maxBookingsPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Bookings per Day</FormLabel>
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

        <Card>
          <CardHeader>
            <CardTitle>Cancellation Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="settings.allowsCancellation"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Cancellations</FormLabel>
                    <FormDescription>
                      Enable guests to cancel their bookings
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
              name="settings.cancellationPolicy.deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Deadline (hours)</FormLabel>
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
            <FormField
              control={form.control}
              name="settings.cancellationPolicy.refundPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refund Percentage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of payment to refund if cancelled before deadline
                  </FormDescription>
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