"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { DiningItem, DiningModuleSettings } from "@/lib/modules/types";
import { Badge } from "@/components/ui/badge";
import { DiningItemDialog } from "@/components/modules/dining/dining-item-dialog";

const mockItems: DiningItem[] = [
  {
    id: "1",
    name: "Classic Eggs Benedict",
    description: "Poached eggs on English muffins with hollandaise sauce",
    category: "breakfast",
    price: 18,
    currency: "EUR",
    images: [],
    allergens: ["eggs", "gluten", "dairy"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 15,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Grilled Salmon",
    description: "Fresh salmon with seasonal vegetables and lemon butter sauce",
    category: "dinner",
    price: 28,
    currency: "EUR",
    images: [],
    allergens: ["fish", "dairy"],
    dietaryInfo: ["gluten-free", "high-protein"],
    preparationTime: 25,
    isAvailable: true,
  },
];

export default function DiningModulePage() {
  const [items, setItems] = useState<DiningItem[]>(mockItems);
  const [moduleSettings, setModuleSettings] = useState<DiningModuleSettings>({
    enabled: true,
    settings: {
      requiresDeposit: false,
      depositAmount: 0,
      allowsCancellation: true,
      cancellationPolicy: {
        deadline: 24,
        refundPercentage: 100,
      },
      minBookingNotice: 1,
      maxPartySize: 10,
      averageDiningTime: 90,
      autoConfirm: true,
    },
    availability: {
      daysInAdvance: 30,
      serviceHours: [
        { dayOfWeek: 1, service: "breakfast", start: "07:00", end: "10:30" },
        { dayOfWeek: 1, service: "lunch", start: "12:00", end: "14:30" },
        { dayOfWeek: 1, service: "dinner", start: "18:00", end: "22:00" },
        { dayOfWeek: 2, service: "breakfast", start: "07:00", end: "10:30" },
        { dayOfWeek: 2, service: "lunch", start: "12:00", end: "14:30" },
        { dayOfWeek: 2, service: "dinner", start: "18:00", end: "22:00" },
        { dayOfWeek: 3, service: "breakfast", start: "07:00", end: "10:30" },
        { dayOfWeek: 3, service: "lunch", start: "12:00", end: "14:30" },
        { dayOfWeek: 3, service: "dinner", start: "18:00", end: "22:00" },
        { dayOfWeek: 4, service: "breakfast", start: "07:00", end: "10:30" },
        { dayOfWeek: 4, service: "lunch", start: "12:00", end: "14:30" },
        { dayOfWeek: 4, service: "dinner", start: "18:00", end: "22:00" },
        { dayOfWeek: 5, service: "breakfast", start: "07:00", end: "10:30" },
        { dayOfWeek: 5, service: "lunch", start: "12:00", end: "14:30" },
        { dayOfWeek: 5, service: "dinner", start: "18:00", end: "22:00" },
        { dayOfWeek: 6, service: "breakfast", start: "07:30", end: "11:00" },
        { dayOfWeek: 6, service: "lunch", start: "12:00", end: "15:00" },
        { dayOfWeek: 6, service: "dinner", start: "18:00", end: "22:30" },
        { dayOfWeek: 7, service: "breakfast", start: "07:30", end: "11:00" },
        { dayOfWeek: 7, service: "lunch", start: "12:00", end: "15:00" },
        { dayOfWeek: 7, service: "dinner", start: "18:00", end: "22:00" },
      ],
      specialClosures: [],
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DiningItem | undefined>(
    undefined
  );

  const handleItemSubmit = async (data: Omit<DiningItem, "id">) => {
    try {
      if (selectedItem) {
        // Update existing item
        setItems(
          items.map((item) =>
            item.id === selectedItem.id ? { ...data, id: item.id } : item
          )
        );
      } else {
        // Add new item
        setItems([...items, { ...data, id: Math.random().toString() }]);
      }
      setIsDialogOpen(false);
      setSelectedItem(undefined);
    } catch (error) {
      console.error("Error submitting item:", error);
      toast.error("Failed to save item");
    }
  };

  const handleEditItem = (item: DiningItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
    toast.success("Item deleted successfully");
  };

  const getCategoryLabel = (category: DiningItem["category"]) => {
    const labels: Record<DiningItem["category"], string> = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      drinks: "Drinks",
      dessert: "Dessert",
    };
    return labels[category];
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/modules">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Dining</h1>
            <p className="text-muted-foreground">
              Manage your restaurant menu and dining options
            </p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {item.description}
                  </CardDescription>
                </div>
                <Badge variant={item.isAvailable ? "default" : "secondary"}>
                  {getCategoryLabel(item.category)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    {item.price} {item.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Preparation Time</p>
                  <p className="text-sm text-muted-foreground">
                    {item.preparationTime} minutes
                  </p>
                </div>
                {item.allergens.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Allergens</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.allergens.map((allergen, index) => (
                        <Badge key={index} variant="outline">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {item.dietaryInfo.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Dietary Info</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.dietaryInfo.map((info, index) => (
                        <Badge key={index} variant="outline">
                          {info}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </Button>
              <Button onClick={() => handleEditItem(item)}>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <DiningItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        onSubmit={handleItemSubmit}
      />
    </div>
  );
} 