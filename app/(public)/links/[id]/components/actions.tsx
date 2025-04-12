"use client";

import { useState } from "react";
import { Bell, Share2, Link, Facebook, Twitter, MessageSquare, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  hotel_id: z.string().uuid(),
});

interface CornerActionsProps {
  data: {
    username: string;
    hotelName: string;
    logo: string;
    hotelId: string;
    theme?: {
      buttonStyle?: 'minimal' | 'outline' | 'solid' | 'soft';
      primaryColor?: string;
      secondaryColor?: string;
    };
  };
}

export function CornerActions({ data }: CornerActionsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      hotel_id: data.hotelId,
    },
  });

  const buttonClassName = cn(
    "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 border-2",
    {
      'bg-transparent hover:bg-primary/10 border-transparent': data.theme?.buttonStyle === 'minimal',
      'bg-transparent': data.theme?.buttonStyle === 'outline',
      'bg-primary text-primary-foreground hover:opacity-90 border-transparent': data.theme?.buttonStyle === 'solid',
      'bg-primary/10 hover:bg-primary/20 border-transparent': data.theme?.buttonStyle === 'soft',
      'bg-white hover:bg-black/5 border-transparent': !data.theme?.buttonStyle
    }
  );

  const buttonStyle = {
    borderColor: data.theme?.buttonStyle === 'outline' ? data.theme?.primaryColor : 'transparent',
    color: data.theme?.buttonStyle === 'solid' ? data.theme?.secondaryColor : data.theme?.primaryColor,
    backgroundColor: data.theme?.buttonStyle === 'solid' ? data.theme?.primaryColor : undefined
  };

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Already subscribed") {
          toast.error("You are already subscribed to this hotel");
        } else {
          toast.error("Failed to subscribe");
        }
        return;
      }

      toast.success("Successfully subscribed!");
      setIsContactOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to subscribe");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <button 
        className={buttonClassName}
        style={buttonStyle}
        onClick={() => setIsContactOpen(true)}
      >
        <Bell className="h-5 w-5" />
      </button>

      <button 
        className={buttonClassName}
        style={buttonStyle}
        onClick={() => setIsShareOpen(true)}
      >
        <Share2 className="h-5 w-5" />
      </button>

      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to {data.hotelName}</DialogTitle>
            <DialogDescription>
              Get notified about special offers and updates from this hotel.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                style={{
                  backgroundColor: data.theme?.primaryColor,
                  color: data.theme?.secondaryColor,
                  borderColor: data.theme?.buttonStyle === 'outline' ? data.theme?.primaryColor : 'transparent'
                }}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Subscribe
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Share Link</DialogTitle>
            <DialogDescription>
              Share this link with your friends and family
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCopyLink}
              style={{
                borderColor: data.theme?.primaryColor,
                color: data.theme?.primaryColor
              }}
            >
              <Link className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`)}
              style={{
                borderColor: data.theme?.primaryColor,
                color: data.theme?.primaryColor
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
              style={{
                borderColor: data.theme?.primaryColor,
                color: data.theme?.primaryColor
              }}
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`)}
              style={{
                borderColor: data.theme?.primaryColor,
                color: data.theme?.primaryColor
              }}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 