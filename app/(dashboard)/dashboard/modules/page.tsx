"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Building2, Flower2, UtensilsCrossed, Ticket, Car, Bus } from "lucide-react";

const MODULES = [
  {
    id: "activities",
    name: "Activities",
    description: "Experiences near destination",
    icon: Building2,
    path: "/dashboard/modules/activities"
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Spa, massage, and more",
    icon: Flower2,
    path: "/dashboard/modules/wellness"
  },
  {
    id: "dining",
    name: "Dining",
    description: "Dining, cooking classes, more",
    icon: UtensilsCrossed,
    path: "/dashboard/modules/dining"
  },
  {
    id: "tickets",
    name: "Tickets",
    description: "Museums, concerts, more",
    icon: Ticket,
    path: "/dashboard/modules/tickets"
  },
  {
    id: "rentals",
    name: "Rentals",
    description: "Rental equipment for leisure use",
    icon: Car,
    path: "/dashboard/modules/rentals"
  },
  {
    id: "transfers",
    name: "Transfers",
    description: "Transport to and from destinations",
    icon: Bus,
    path: "/dashboard/modules/transfers"
  }
];

export default function ModulesPage() {
  const router = useRouter();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Modules</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <Card 
              key={module.id} 
              className="relative overflow-hidden border border-border/40 hover:border-border/80 hover:shadow-md transition-all cursor-pointer bg-background"
              onClick={() => router.push(module.path)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold tracking-tight">{module.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 