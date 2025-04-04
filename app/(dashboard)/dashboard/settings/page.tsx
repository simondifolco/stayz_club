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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHotel } from "@/contexts/hotel-context";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const userFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;

export default function UserSettings() {
  const { selectedHotel, setSelectedHotel } = useHotel();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const supabase = createClient();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      description: "",
      logo_url: "",
    },
  });

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      full_name: "",
      phone: "",
    },
  });

  useEffect(() => {
    async function fetchHotelProfile() {
      if (!selectedHotel?.id) return;

      try {
        const { data, error } = await supabase
          .from("hotels")
          .select("*")
          .eq("id", selectedHotel.id)
          .single();

        if (error) throw error;

        if (data) {
          profileForm.reset({
            name: data.name || "",
            description: data.description || "",
            logo_url: data.logo_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetching hotel profile:", error);
        toast.error("Failed to load hotel profile");
      } finally {
        setIsFetching(false);
      }
    }

    async function fetchUserProfile() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          userForm.reset({
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            phone: user.user_metadata?.phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      }
    }

    fetchHotelProfile();
    fetchUserProfile();
  }, [selectedHotel?.id, profileForm, userForm, supabase]);

  async function onSubmitProfile(data: ProfileFormValues) {
    if (!selectedHotel?.id) {
      toast.error("No hotel selected");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        name: data.name,
        description: data.description || null,
        logo_url: data.logo_url || null,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedHotel, error } = await supabase
        .from("hotels")
        .update(updateData)
        .eq("id", selectedHotel.id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      if (!updatedHotel) {
        throw new Error("Failed to update hotel profile");
      }

      setSelectedHotel({
        ...selectedHotel,
        ...updatedHotel,
      });

      toast.success("Hotel profile updated successfully");
    } catch (error) {
      console.error("Error updating hotel profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update hotel profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmitUser(data: UserFormValues) {
    setIsUserLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          full_name: data.full_name,
          phone: data.phone,
        },
      });

      if (error) throw error;

      toast.success("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Failed to update user profile");
    } finally {
      setIsUserLoading(false);
    }
  }

  if (isFetching) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading profiles...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col gap-6 px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your hotel profile and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Hotel Profile</TabsTrigger>
          <TabsTrigger value="user">User Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Profile</CardTitle>
              <CardDescription>
                Update your hotel information and branding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter hotel name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your hotel's public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter hotel description"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of your hotel.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Logo</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            onUploading={(isUploading) => {
                              setIsLoading(isUploading);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload your hotel's logo image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Update your personal information and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-6">
                  <FormField
                    control={userForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your primary email address for authentication.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your full name as it will appear in the system.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your contact phone number (optional).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isUserLoading}>
                    {isUserLoading ? "Saving..." : "Save User Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}