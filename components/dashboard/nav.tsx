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
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOutAction } from "@/app/actions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <div className={cn("flex-1", className)}>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onSelect}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
    <div className={cn("border-t pt-4 px-4", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>
      <form action={signOutAction}>
        <Button variant="ghost" className="w-full justify-start" type="submit">
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
      <nav className="hidden lg:flex w-[240px] border-r px-3 py-4 flex-col h-screen fixed top-0 left-0 z-30 bg-background">
        <NavLinks />
        <UserSection />
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
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="flex flex-col h-full py-4">
              <NavLinks onSelect={() => setOpen(false)} />
              <UserSection />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
} 