"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";

interface Module {
  id: string;
  name: string;
  description: string;
  category: "dining" | "activities" | "wellness" | "transport" | "other";
  enabled: boolean;
  isActive: boolean;
  imageUrl?: string;
}

// Mock data - replace with actual data fetching
const modules: Module[] = [
  {
    id: "restaurant-booking",
    name: "Restaurant Booking",
    description: "Enable guests to make restaurant reservations and view menus",
    category: "dining",
    enabled: true,
    isActive: true,
    imageUrl: "https://picsum.photos/id/1048/800/400",
  },
  {
    id: "menu-booking",
    name: "Menu Booking",
    description: "Allow guests to pre-order meals and customize their dining experience",
    category: "dining",
    enabled: true,
    isActive: true,
    imageUrl: "https://picsum.photos/id/1040/800/400",
  },
  {
    id: "activities",
    name: "Activities",
    description: "Manage and book various activities and experiences",
    category: "activities",
    enabled: true,
    isActive: true,
    imageUrl: "https://picsum.photos/id/1036/800/400",
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Book spa treatments, massages, and wellness services",
    category: "wellness",
    enabled: true,
    isActive: true,
    imageUrl: "https://picsum.photos/id/1037/800/400",
  },
  {
    id: "transfers",
    name: "Transfers",
    description: "Arrange airport transfers and transportation services",
    category: "transport",
    enabled: true,
    isActive: true,
    imageUrl: "https://picsum.photos/id/1033/800/400",
  },
];

const categories = [
  { id: "all", label: "All Modules" },
  { id: "dining", label: "Dining" },
  { id: "activities", label: "Activities" },
  { id: "wellness", label: "Wellness" },
  { id: "transport", label: "Transport" },
  { id: "other", label: "Other" },
];

export default function LinksPage() {
  const router = useRouter();
  const hasModules = modules.length > 0;

  useEffect(() => {
    if (!hasModules) {
      router.push("/dashboard/modules");
    }
  }, [hasModules, router]);

  if (!hasModules) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No modules available</AlertTitle>
          <AlertDescription>
            No modules have been configured yet. Redirecting to modules page...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hotel Modules</h1>
        <Link href="/dashboard/modules">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Configure Modules
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {modules
                  .filter(
                    (module) =>
                      category.id === "all" || module.category === category.id
                  )
                  .map((module) => (
                    <Card
                      key={module.id}
                      className="overflow-hidden transition-shadow hover:shadow-lg"
                    >
                      {module.imageUrl && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={module.imageUrl}
                            alt={module.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{module.name}</CardTitle>
                          <Badge variant={module.enabled ? "default" : "secondary"}>
                            {module.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Link href={`/dashboard/modules/${module.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            Configure Module
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}