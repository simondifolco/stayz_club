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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useHotel } from "@/contexts/hotel-context";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Palette } from "lucide-react";

const themeFormSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  darkMode: z.boolean().optional(),
  showLogo: z.boolean().optional(),
});

type ThemeFormValues = z.infer<typeof themeFormSchema>;

export function ThemeSettingsDialog() {
  const { selectedHotel, setSelectedHotel } = useHotel();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      primaryColor: selectedHotel?.theme?.primaryColor || "#000000",
      secondaryColor: selectedHotel?.theme?.secondaryColor || "#ffffff",
      darkMode: selectedHotel?.theme?.darkMode || false,
      showLogo: selectedHotel?.theme?.showLogo || true,
    },
  });

  async function onSubmit(data: ThemeFormValues) {
    if (!selectedHotel) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("hotels")
        .update({
          theme: data,
        })
        .eq("id", selectedHotel.id);

      if (error) throw error;

      setSelectedHotel({
        ...selectedHotel,
        theme: data,
      });

      toast.success("Theme settings updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error updating theme settings:", error);
      toast.error("Failed to update theme settings");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Palette className="mr-2 h-4 w-4" />
          Theme Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of your hotel's link page.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormDescription>
                    The main color used throughout your link page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormDescription>
                    The accent color used for highlights and secondary elements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Dark Mode</FormLabel>
                    <FormDescription>
                      Enable dark mode for your link page.
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
              name="showLogo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Logo</FormLabel>
                    <FormDescription>
                      Display your hotel logo at the top of the page.
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Theme Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 