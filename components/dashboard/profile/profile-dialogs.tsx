"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHotel } from "@/contexts/hotel-context";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Image, User, Link2, MessageSquare } from "lucide-react";

export function ProfileDialogs() {
  const { selectedHotel, setSelectedHotel } = useHotel();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Update handlers
  const handleLogoUpdate = async (logoUrl: string) => {
    if (!selectedHotel) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("hotels")
        .update({ logo_url: logoUrl })
        .eq("id", selectedHotel.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSelectedHotel(data);
        toast.success("Logo updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update logo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (name: string, bio: string) => {
    if (!selectedHotel) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("hotels")
        .update({
          name,
          description: bio,
        })
        .eq("id", selectedHotel.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSelectedHotel(data);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeUpdate = async (updates: Partial<NonNullable<typeof selectedHotel>['theme']>) => {
    if (!selectedHotel) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("hotels")
        .update({
          theme: { ...selectedHotel.theme, ...updates },
        })
        .eq("id", selectedHotel.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSelectedHotel(data);
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Logo Preview */}
      <div className="flex flex-col items-center justify-center mb-16">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border">
          {selectedHotel?.logo_url ? (
            <img 
              src={selectedHotel.logo_url} 
              alt={selectedHotel?.name || "Hotel logo"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-3xl text-muted-foreground">Logo</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 max-w-sm mx-auto">
        {/* Edit Logo Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-11 text-center flex items-center justify-center gap-2 rounded-xl"
            >
              <Image className="h-4 w-4" />
              Edit image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Logo</DialogTitle>
              <DialogDescription>
                Upload or change your hotel's logo image
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <ImageUpload
                value={selectedHotel?.logo_url || ""}
                onChange={(url) => handleLogoUpdate(url)}
                onUploading={setIsLoading}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-11 text-center flex items-center justify-center gap-2 rounded-xl"
            >
              <User className="h-4 w-4" />
              Edit display name and bio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your hotel's display name and bio
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleProfileUpdate(
                  formData.get("name") as string,
                  formData.get("bio") as string
                );
              }}
              className="space-y-4 py-4"
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Display Name
                </label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedHotel?.name}
                  placeholder="Enter your hotel's name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={selectedHotel?.description}
                  placeholder="Enter a short description"
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Booking Link Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-11 text-center flex items-center justify-center gap-2 rounded-xl"
            >
              <Link2 className="h-4 w-4" />
              Add booking link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Link</DialogTitle>
              <DialogDescription>
                Add a link where guests can make reservations
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleThemeUpdate({
                  bookingUrl: formData.get("bookingUrl") as string,
                });
              }}
              className="space-y-4 py-4"
            >
              <div className="space-y-2">
                <label htmlFor="bookingUrl" className="text-sm font-medium">
                  Booking URL
                </label>
                <Input
                  id="bookingUrl"
                  name="bookingUrl"
                  type="url"
                  defaultValue={selectedHotel?.theme?.bookingUrl}
                  placeholder="https://booking.com/your-hotel"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Contact Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-11 text-center flex items-center justify-center gap-2 rounded-xl"
            >
              <MessageSquare className="h-4 w-4" />
              Add contact email
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Email</DialogTitle>
              <DialogDescription>
                Add an email address for guest inquiries
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleThemeUpdate({
                  contactEmail: formData.get("contactEmail") as string,
                });
              }}
              className="space-y-4 py-4"
            >
              <div className="space-y-2">
                <label htmlFor="contactEmail" className="text-sm font-medium">
                  Contact Email
                </label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={selectedHotel?.theme?.contactEmail}
                  placeholder="contact@your-hotel.com"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 