"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Bell, Share2, Loader2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
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

interface Hotel {
  id: string;
  name: string;
  description?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    buttonStyle?: 'minimal' | 'outline' | 'solid' | 'soft';
  };
}

interface ClientActionsProps {
  hotel: Hotel;
  theme?: Hotel['theme'];
}

export function ClientShare({ hotel, theme }: ClientActionsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const safeTheme = {
    primaryColor: theme?.primaryColor || '#000000',
    secondaryColor: theme?.secondaryColor || '#ffffff',
    backgroundColor: theme?.backgroundColor || '#ffffff',
    buttonStyle: theme?.buttonStyle || 'minimal'
  };

  const iconButtonClassName = cn(
    "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 border-2 shadow-sm hover:shadow-md",
    {
      'bg-transparent hover:bg-primary/10 border-transparent': safeTheme.buttonStyle === 'minimal',
      'bg-transparent hover:bg-primary/5': safeTheme.buttonStyle === 'outline',
      'hover:opacity-90 border-transparent': safeTheme.buttonStyle === 'solid',
      'bg-primary/10 hover:bg-primary/20 border-transparent': safeTheme.buttonStyle === 'soft',
    }
  );

  const buttonStyle = {
    borderColor: safeTheme.buttonStyle === 'outline' ? safeTheme.primaryColor : 'transparent',
    color: safeTheme.buttonStyle === 'solid' ? safeTheme.secondaryColor : safeTheme.primaryColor,
    backgroundColor: safeTheme.buttonStyle === 'solid' ? safeTheme.primaryColor : undefined
  };

  const dialogContentStyle = {
    backgroundColor: safeTheme.backgroundColor,
    color: safeTheme.primaryColor,
    '--theme-primary': safeTheme.primaryColor,
    '--theme-secondary': safeTheme.secondaryColor,
  } as React.CSSProperties;

  const dialogTitleStyle = {
    color: safeTheme.primaryColor,
  };

  const dialogDescriptionStyle = {
    color: safeTheme.primaryColor,
    opacity: 0.8,
  };

  const handleCopyLink = () => {
    if (!window?.location?.href) {
      toast.error("Unable to copy link at this time");
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
    setIsShareOpen(false);
  };

  return (
    <>
      <button 
        className={iconButtonClassName}
        style={buttonStyle}
        onClick={handleCopyLink}
      >
        <Share2 className="h-5 w-5" style={{ color: safeTheme.buttonStyle === 'solid' ? safeTheme.secondaryColor : safeTheme.primaryColor }} />
      </button>
    </>
  );
}

export function ClientSubscribe({ hotel, theme }: ClientActionsProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const safeTheme = {
    primaryColor: theme?.primaryColor || '#000000',
    secondaryColor: theme?.secondaryColor || '#ffffff',
    backgroundColor: theme?.backgroundColor || '#ffffff',
    buttonStyle: theme?.buttonStyle || 'minimal'
  };

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      hotel_id: hotel.id,
    },
  });

  const iconButtonClassName = cn(
    "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 border-2 shadow-sm hover:shadow-md",
    {
      'bg-transparent hover:bg-primary/10 border-transparent': safeTheme.buttonStyle === 'minimal',
      'bg-transparent hover:bg-primary/5': safeTheme.buttonStyle === 'outline',
      'hover:opacity-90 border-transparent': safeTheme.buttonStyle === 'solid',
      'bg-primary/10 hover:bg-primary/20 border-transparent': safeTheme.buttonStyle === 'soft',
    }
  );

  const buttonStyle = {
    borderColor: safeTheme.buttonStyle === 'outline' ? safeTheme.primaryColor : 'transparent',
    color: safeTheme.buttonStyle === 'solid' ? safeTheme.secondaryColor : safeTheme.primaryColor,
    backgroundColor: safeTheme.buttonStyle === 'solid' ? safeTheme.primaryColor : undefined
  };

  const dialogContentStyle = {
    backgroundColor: safeTheme.backgroundColor,
    color: safeTheme.primaryColor,
    '--theme-primary': safeTheme.primaryColor,
    '--theme-secondary': safeTheme.secondaryColor,
  } as React.CSSProperties;

  const dialogTitleStyle = {
    color: safeTheme.primaryColor,
  };

  const dialogDescriptionStyle = {
    color: safeTheme.primaryColor,
    opacity: 0.8,
  };

  const dialogButtonClassName = cn(
    "flex items-center justify-center gap-2 transition-all duration-200 border-2",
    {
      'bg-transparent hover:bg-primary/10 border-transparent': safeTheme.buttonStyle === 'minimal',
      'bg-transparent hover:bg-primary/5': safeTheme.buttonStyle === 'outline',
      'hover:opacity-90 border-transparent': safeTheme.buttonStyle === 'solid',
      'bg-primary/10 hover:bg-primary/20 border-transparent': safeTheme.buttonStyle === 'soft',
    }
  );

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

  return (
    <>
      <button 
        className={iconButtonClassName}
        style={buttonStyle}
        onClick={() => setIsContactOpen(true)}
      >
        <Bell className="h-5 w-5" style={{ color: safeTheme.buttonStyle === 'solid' ? safeTheme.secondaryColor : safeTheme.primaryColor }} />
      </button>

      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent style={dialogContentStyle}>
          <DialogHeader>
            <DialogTitle style={dialogTitleStyle}>Subscribe to {hotel.name}</DialogTitle>
            <DialogDescription style={dialogDescriptionStyle}>
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
                    <FormLabel style={{ color: safeTheme.primaryColor }}>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your name" 
                        {...field} 
                        className={cn(
                          "border-2 transition-colors focus-visible:ring-1",
                          {
                            'focus-visible:ring-primary/20 focus-visible:border-primary': safeTheme.buttonStyle === 'solid',
                            'focus-visible:ring-primary/20': safeTheme.buttonStyle !== 'solid',
                          }
                        )}
                        style={{
                          borderColor: safeTheme.buttonStyle === 'outline' ? safeTheme.primaryColor : 'var(--border)',
                          color: safeTheme.primaryColor,
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{ color: safeTheme.primaryColor }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: safeTheme.primaryColor }}>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your@email.com" 
                        {...field} 
                        className={cn(
                          "border-2 transition-colors focus-visible:ring-1",
                          {
                            'focus-visible:ring-primary/20 focus-visible:border-primary': safeTheme.buttonStyle === 'solid',
                            'focus-visible:ring-primary/20': safeTheme.buttonStyle !== 'solid',
                          }
                        )}
                        style={{
                          borderColor: safeTheme.buttonStyle === 'outline' ? safeTheme.primaryColor : 'var(--border)',
                          color: safeTheme.primaryColor,
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{ color: safeTheme.primaryColor }} />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className={cn(dialogButtonClassName, "w-full p-4 rounded-2xl")}
                disabled={isLoading}
                style={buttonStyle}
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
    </>
  );
} 