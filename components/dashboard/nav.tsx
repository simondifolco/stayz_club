"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Link as LinkIcon,
  BarChart,
  Settings,
  Bell,
  Users,
  Briefcase,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOutAction } from "@/app/actions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddHotelDialog } from "@/components/dashboard/add-hotel-dialog";
import { useHotel } from "@/contexts/hotel-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Links",
    href: "/dashboard/links",
    icon: LinkIcon,
  },
  {
    title: "Modules",
    href: "/dashboard/modules",
    icon: Briefcase,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

function NavLinks({ className, onSelect }: { className?: string; onSelect?: () => void }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onSelect}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.title}
          </Link>
        );
      })}
    </div>
  );
}

function HotelSelector() {
  const { hotels, selectedHotel, setSelectedHotel, addHotel } = useHotel();

  const handleAddHotel = async (hotelData: { name: string; slug: string }) => {
    await addHotel(hotelData);
  };

  return (
    <div className="px-3 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                <span className="text-xs font-medium">
                  {selectedHotel?.name?.slice(0, 2).toUpperCase() || 'HO'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{selectedHotel?.name || "Select Hotel"}</span>
                <span className="text-xs text-muted-foreground">Hotel</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[200px]" 
          align="start"
          alignOffset={-11}
          sideOffset={8}
        >
          {hotels.map((hotel) => (
            <DropdownMenuItem
              key={hotel.id}
              className="flex items-center gap-3 py-2 px-3"
              onClick={() => setSelectedHotel(hotel)}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                <span className="text-xs font-medium">
                  {hotel.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-sm">{hotel.name}</span>
            </DropdownMenuItem>
          ))}
          <AddHotelDialog onAdd={handleAddHotel} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function UserSection({ className }: { className?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!user) return null;

  return (
    <div className={cn("px-3 py-2", className)}>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
          <span className="text-xs font-medium">
            {user.email?.[0].toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm">{user.email?.split('@')[0]}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>
      <form action={signOutAction}>
        <Button variant="ghost" size="sm" className="w-full justify-start px-3 text-sm font-normal" type="submit">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </form>
    </div>
  );
}

export function DashboardNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex w-[240px] border-r flex-col h-screen fixed top-0 left-0 z-30 bg-background">
        <div className="flex flex-col flex-1 gap-2 p-2">
          <HotelSelector />
          <NavLinks />
          <div className="mt-auto">
            <UserSection />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-2">
            <div className="flex flex-col h-full gap-2">
              <HotelSelector />
              <NavLinks onSelect={() => setOpen(false)} />
              <div className="mt-auto">
                <UserSection />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
} 