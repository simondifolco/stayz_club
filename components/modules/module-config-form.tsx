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
import { ModuleConfig, BookingField } from "@/lib/modules/types";
import { toast } from "sonner";

const pricingSchema = z.object({
  type: z.enum(["fixed", "per_person", "per_hour"]),
  basePrice: z.number().min(0),
  currency: z.string(),
});

const availabilitySchema = z.object({
  daysInAdvance: z.number().min(0),
  timeSlots: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    )
    .optional(),
});

const moduleConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  enabled: z.boolean(),
  bookingFields: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum([
        "text",
        "number",
        "date",
        "time",
        "datetime",
        "select",
        "textarea",
        "checkbox",
      ]),
      required: z.boolean(),
      placeholder: z.string().optional(),
      options: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .optional(),
      validation: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
          pattern: z.string().optional(),
          message: z.string().optional(),
        })
        .optional(),
    })
  ),
  pricing: pricingSchema.optional(),
  availability: availabilitySchema.optional(),
});

interface ModuleConfigFormProps {
  initialConfig: ModuleConfig;
  onSave: (config: ModuleConfig) => Promise<void>;
  moduleType: string;
}

export function ModuleConfigForm({
  initialConfig,
  onSave,
  moduleType,
}: ModuleConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ModuleConfig>({
    resolver: zodResolver(moduleConfigSchema),
    defaultValues: initialConfig,
  });

  async function onSubmit(data: ModuleConfig) {
    try {
      setIsLoading(true);
      await onSave(data);
      toast.success("Module configuration saved successfully");
    } catch (error) {
      toast.error("Failed to save module configuration");
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
                    <FormLabel className="text-base">Enable Module</FormLabel>
                    <FormDescription>
                      Make this module available for bookings
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
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="pricing.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="per_person">Per Person</SelectItem>
                      <SelectItem value="per_hour">Per Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricing.basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricing.currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="availability.daysInAdvance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days in Advance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    How many days in advance can customers book?
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