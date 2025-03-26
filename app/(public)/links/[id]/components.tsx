"use client";

import { useState } from "react";
import { Bell, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Facebook, Twitter, MessageSquare, Link } from "lucide-react";
interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    username: string;
    hotelName: string;
    logo: string;
  };
}

export function ShareDialog({ isOpen, onClose, data }: ShareDialogProps) {
  const shareOptions = [
    { name: 'Copy Link', icon: 'link', action: () => navigator.clipboard.writeText(window.location.href) },
    { name: 'Facebook', icon: 'facebook', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`) },
    { name: 'WhatsApp', icon: 'whatsapp', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`) },
    { name: 'Twitter', icon: 'twitter', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`) },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 rounded-3xl">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">Share {data.hotelName}</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => {
                  option.action();
                  if (option.name === 'Copy Link') {
                    setTimeout(onClose, 500);
                  }
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  {option.icon === 'link' ? (
                    <Link className="h-5 w-5 text-foreground" />
                  ) : option.icon === 'facebook' ? (
                    <Facebook className="h-5 w-5 text-foreground" />
                  ) : option.icon === 'whatsapp' ? (
                    <MessageSquare className="h-5 w-5 text-foreground" />
                  ) : (
                    <Twitter className="h-5 w-5 text-foreground" />
                  )}
                </div>
                <span className="text-sm text-foreground">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SubscribeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeDialog({ isOpen, onClose }: SubscribeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 rounded-3xl">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">Subscribe to Updates</DialogTitle>
            </div>
          </DialogHeader>
          
          <form className="space-y-4" onSubmit={(e) => { 
            e.preventDefault();
            // Handle form submission here
            // For now, we'll just close the dialog
            onClose();
          }}>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg border bg-transparent"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Subscribe
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CornerActionsProps {
  data: {
    username: string;
    hotelName: string;
    logo: string;
  };
}

export function CornerActions({ data }: CornerActionsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <div className="absolute -top-2 -left-2 right-0 flex justify-between">
      <button 
        onClick={() => setIsSubscribeOpen(true)}
        className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
      >
        <Bell className="h-4 w-4 text-foreground" />
      </button>
      <button 
        onClick={() => setIsShareOpen(true)}
        className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
      >
        <Share2 className="h-4 w-4 text-foreground" />
      </button>

      <ShareDialog 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        data={data}
      />
      <SubscribeDialog 
        isOpen={isSubscribeOpen} 
        onClose={() => setIsSubscribeOpen(false)} 
      />
    </div>
  );
} 