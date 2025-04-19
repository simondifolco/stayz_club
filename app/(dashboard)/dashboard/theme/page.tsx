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
import { useBlocks } from "@/hooks/use-blocks";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

const PREMADE_THEMES = {
  // Modern & Minimalist
  'modern-noir': {
    name: 'Modern Noir',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    buttonStyle: 'minimal' as const,
    category: 'Modern'
  },
  'modern-sage': {
    name: 'Modern Sage',
    primaryColor: '#4A5D5C',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F5F5F0',
    buttonStyle: 'soft' as const,
    category: 'Modern'
  },
  'modern-sand': {
    name: 'Modern Sand',
    primaryColor: '#A67F5D',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F7F3EE',
    buttonStyle: 'outline' as const,
    category: 'Modern'
  },

  // Luxury & Classic
  'classic-gold': {
    name: 'Classic Gold',
    primaryColor: '#927545',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F9F6F0',
    buttonStyle: 'outline' as const,
    category: 'Classic'
  },
  'classic-burgundy': {
    name: 'Classic Burgundy',
    primaryColor: '#742938',
    secondaryColor: '#F9E5D9',
    backgroundColor: '#FFFFFF',
    buttonStyle: 'solid' as const,
    category: 'Classic'
  },
  'classic-navy': {
    name: 'Classic Navy',
    primaryColor: '#1B365D',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F5F7FA',
    buttonStyle: 'outline' as const,
    category: 'Classic'
  },

  // Boutique & Trendy
  'trendy-coral': {
    name: 'Trendy Coral',
    primaryColor: '#FF6F61',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#FFF5F4',
    buttonStyle: 'soft' as const,
    category: 'Trendy'
  },
  'trendy-lilac': {
    name: 'Trendy Lilac',
    primaryColor: '#9F8AC3',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F7F5FB',
    buttonStyle: 'solid' as const,
    category: 'Trendy'
  },
  'trendy-mint': {
    name: 'Trendy Mint',
    primaryColor: '#7EBEA9',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F0F7F5',
    buttonStyle: 'soft' as const,
    category: 'Trendy'
  },

  // Beach & Resort
  'resort-azure': {
    name: 'Resort Azure',
    primaryColor: '#3FA7D6',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F5FBFF',
    buttonStyle: 'solid' as const,
    category: 'Resort'
  },
  'resort-palm': {
    name: 'Resort Palm',
    primaryColor: '#568C63',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F5F8F5',
    buttonStyle: 'soft' as const,
    category: 'Resort'
  },
  'resort-sunset': {
    name: 'Resort Sunset',
    primaryColor: '#E8846B',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#FFF6F4',
    buttonStyle: 'outline' as const,
    category: 'Resort'
  },

  // Vintage & Rustic
  'vintage-terracotta': {
    name: 'Vintage Terracotta',
    primaryColor: '#C67D5B',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F9F3EF',
    buttonStyle: 'outline' as const,
    category: 'Vintage'
  },
  'vintage-olive': {
    name: 'Vintage Olive',
    primaryColor: '#7B7F58',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F7F8F2',
    buttonStyle: 'soft' as const,
    category: 'Vintage'
  },
  'vintage-slate': {
    name: 'Vintage Slate',
    primaryColor: '#5B6E7B',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F5F7F9',
    buttonStyle: 'minimal' as const,
    category: 'Vintage'
  },
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
  const { blocks } = useBlocks();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

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

  // Function to apply premade theme
  const applyPremadeTheme = (themeKey: keyof typeof PREMADE_THEMES) => {
    const theme = PREMADE_THEMES[themeKey];
    form.setValue('primaryColor', theme.primaryColor);
    form.setValue('secondaryColor', theme.secondaryColor);
    form.setValue('backgroundColor', theme.backgroundColor);
    form.setValue('buttonStyle', theme.buttonStyle);
  };

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
                      {/* Premade Themes */}
                      <Collapsible>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium">Premade Themes</h3>
                            <p className="text-sm text-muted-foreground">
                              Choose from our collection of carefully crafted themes
                            </p>
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Toggle premade themes</span>
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="space-y-6">
                          {/* Theme Categories */}
                          {(['Modern', 'Classic', 'Trendy', 'Resort', 'Vintage'] as const).map((category) => (
                            <div key={category} className="space-y-3">
                              <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(PREMADE_THEMES)
                                  .filter(([_, theme]) => theme.category === category)
                                  .map(([key, theme]) => (
                                    <button
                                      key={key}
                                      onClick={() => applyPremadeTheme(key as keyof typeof PREMADE_THEMES)}
                                      className="group relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                      style={{ backgroundColor: theme.backgroundColor }}
                                    >
                                      {/* Theme Preview */}
                                      <div className="absolute inset-0 p-4 flex flex-col items-center gap-2">
                                        {/* Profile Circle */}
                                        <div 
                                          className="w-12 h-12 rounded-full border-2"
                                          style={{ 
                                            borderColor: theme.primaryColor,
                                            backgroundColor: theme.backgroundColor 
                                          }}
                                        />
                                        {/* Button Examples */}
                                        <div className="w-full space-y-2">
                                          {[1, 2, 3].map((i) => (
                                            <div
                                              key={i}
                                              className="w-full h-3 rounded-full"
                                              style={{ backgroundColor: theme.primaryColor }}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                      {/* Theme Name */}
                                      <div className="absolute bottom-0 inset-x-0 p-2 text-center text-sm font-medium bg-black/50 text-white">
                                        {theme.name}
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>

                      <Separator />

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