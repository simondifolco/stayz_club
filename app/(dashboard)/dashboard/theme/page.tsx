"use client";

import { useState, useEffect } from "react";
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
import { useHotel } from "@/contexts/hotel-context";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { MobilePreview } from "@/components/dashboard/links/mobile-preview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileDialogs } from "@/components/dashboard/profile/profile-dialogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useHotelItems } from "@/hooks/use-hotel-items";

const BUTTON_STYLES = {
  minimal: "Minimal",
  outline: "Outline",
  solid: "Solid",
  soft: "Soft",
} as const;

const FONTS = {
  geist: "Geist",
  inter: "Inter",
  manrope: "Manrope",
  montserrat: "Montserrat",
} as const;

const themeFormSchema = z.object({
  // Theme Settings
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  showLogo: z.boolean(),
  buttonStyle: z.enum(["minimal", "outline", "solid", "soft"]),
  font: z.enum(["geist", "inter", "manrope", "montserrat"]),
});

type ThemeFormValues = z.infer<typeof themeFormSchema>;

const defaultTheme: ThemeFormValues = {
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  backgroundColor: "#ffffff",
  showLogo: true,
  buttonStyle: "minimal",
  font: "geist",
};

export default function ThemeSettings() {
  const { selectedHotel, setSelectedHotel } = useHotel();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { blocks } = useHotelItems();

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      ...defaultTheme,
      ...selectedHotel?.theme,
    },
  });

  // Update form when selected hotel changes
  useEffect(() => {
    if (selectedHotel) {
      form.reset({
        ...defaultTheme,
        ...selectedHotel.theme,
      });
    }
  }, [selectedHotel, form]);

  async function onSubmit(data: ThemeFormValues) {
    if (!selectedHotel) {
      toast.error("No hotel selected");
      return;
    }

    setIsLoading(true);
    try {
      const validatedData = themeFormSchema.parse(data);

      const { data: updatedHotel, error: updateError } = await supabase
        .from("hotels")
        .update({
          theme: {
            ...selectedHotel.theme,
            ...validatedData,
          },
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedHotel.id)
        .select("*")
        .single();

      if (updateError) throw updateError;
      if (!updatedHotel) throw new Error("Failed to update settings - no data returned");

      setSelectedHotel(updatedHotel);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-6">
      {/* Settings Form */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Theme Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Customize your hotel's profile appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileDialogs />
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Customize your profile's appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="colors" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="colors">Colors</TabsTrigger>
                      <TabsTrigger value="buttons">Buttons</TabsTrigger>
                      <TabsTrigger value="typography">Typography</TabsTrigger>
                    </TabsList>
                    <TabsContent value="colors" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="backgroundColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2 items-center">
                                <Input type="color" {...field} className="w-24 h-10 p-1" />
                                <Input 
                                  type="text" 
                                  {...field} 
                                  className="font-mono"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              The background color of your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2 items-center">
                                <Input type="color" {...field} className="w-24 h-10 p-1" />
                                <Input 
                                  type="text" 
                                  {...field} 
                                  className="font-mono"
                                  placeholder="#000000"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              The main color used throughout your profile.
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
                              <div className="flex gap-2 items-center">
                                <Input type="color" {...field} className="w-24 h-10 p-1" />
                                <Input 
                                  type="text" 
                                  {...field} 
                                  className="font-mono"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              The accent color used for highlights and secondary elements.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="buttons" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="buttonStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Style</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                {/* Minimal Style */}
                                <div
                                  className={`relative flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    field.value === "minimal"
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Minimal</span>
                                    <RadioGroupItem value="minimal" />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button variant="ghost" className="w-full">
                                      Example Button
                                    </Button>
                                    <p className="text-sm text-muted-foreground">
                                      Clean and subtle style with ghost effect on hover
                                    </p>
                                  </div>
                                </div>

                                {/* Outline Style */}
                                <div
                                  className={`relative flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    field.value === "outline"
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Outline</span>
                                    <RadioGroupItem value="outline" />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button variant="outline" className="w-full">
                                      Example Button
                                    </Button>
                                    <p className="text-sm text-muted-foreground">
                                      Classic bordered style with transparent background
                                    </p>
                                  </div>
                                </div>

                                {/* Solid Style */}
                                <div
                                  className={`relative flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    field.value === "solid"
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Solid</span>
                                    <RadioGroupItem value="solid" />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button variant="default" className="w-full">
                                      Example Button
                                    </Button>
                                    <p className="text-sm text-muted-foreground">
                                      Bold and prominent with solid background color
                                    </p>
                                  </div>
                                </div>

                                {/* Soft Style */}
                                <div
                                  className={`relative flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    field.value === "soft"
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Soft</span>
                                    <RadioGroupItem value="soft" />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button variant="secondary" className="w-full">
                                      Example Button
                                      </Button>
                                    <p className="text-sm text-muted-foreground">
                                      Gentle and subtle with a soft background tint
                                    </p>
                                  </div>
                                    </div>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              Choose how your link buttons will look across your profile
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="typography" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="font"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Font Family</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a font" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(FONTS).map(([value, label]) => (
                                  <SelectItem
                                    key={value}
                                    value={value}
                                    className={value}
                                  >
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the font for your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Preview */}
      <div className="hidden lg:block">
        <MobilePreview blocks={blocks} />
      </div>
    </div>
  );
} 