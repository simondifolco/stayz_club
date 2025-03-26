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
import { Rental, RentalModuleSettings } from "@/lib/modules/types";
import { Badge } from "@/components/ui/badge";
import { RentalDialog } from "@/components/modules/rentals/rental-dialog";

const mockRentals: Rental[] = [
  {
    id: "1",
    name: "Mountain Bike",
    description: "High-performance mountain bike for all terrains",
    category: "sports",
    price: 45,
    currency: "EUR",
    quantity: 10,
    availableQuantity: 7,
    images: [],
    specifications: [
      "Frame Size: M/L",
      "Suspension: Full",
      "Gears: 21-speed",
      "Brakes: Hydraulic disc",
    ],
    requirements: [
      "Valid ID",
      "Credit card for deposit",
      "Basic cycling experience",
    ],
    isAvailable: true,
    maintenanceSchedule: {
      lastMaintenance: "2024-03-01",
      nextMaintenance: "2024-04-01",
      maintenanceInterval: 30,
    },
    insuranceRequired: true,
    depositAmount: 200,
  },
  {
    id: "2",
    name: "DSLR Camera Kit",
    description: "Professional camera kit with multiple lenses",
    category: "electronics",
    price: 75,
    currency: "EUR",
    quantity: 5,
    availableQuantity: 3,
    images: [],
    specifications: [
      "Camera: Canon EOS 5D Mark IV",
      "Lenses: 24-70mm, 70-200mm",
      "Memory Cards: 2x 64GB SD",
      "Battery Life: 8 hours",
    ],
    requirements: [
      "Photography experience",
      "Two forms of ID",
      "Insurance coverage",
    ],
    isAvailable: true,
    maintenanceSchedule: {
      lastMaintenance: "2024-02-15",
      nextMaintenance: "2024-03-15",
      maintenanceInterval: 30,
    },
    insuranceRequired: true,
    depositAmount: 500,
  },
];

export default function RentalsModulePage() {
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [moduleSettings, setModuleSettings] = useState<RentalModuleSettings>({
    enabled: true,
    settings: {
      requiresDeposit: true,
      depositAmount: 100,
      allowsCancellation: true,
      cancellationPolicy: {
        deadline: 24,
        refundPercentage: 80,
      },
      minBookingNotice: 4,
      maxRentalDuration: 14,
      autoConfirm: true,
    },
    availability: {
      daysInAdvance: 90,
      specialClosures: [],
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | undefined>();

  async function handleRentalSubmit(data: Omit<Rental, "id">) {
    try {
      if (selectedRental) {
        // Update existing rental
        const updatedRentals = rentals.map((r) =>
          r.id === selectedRental.id ? { ...data, id: r.id } : r
        );
        setRentals(updatedRentals);
        toast.success("Rental item updated successfully");
      } else {
        // Add new rental
        const newRental = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
        };
        setRentals([...rentals, newRental]);
        toast.success("Rental item added successfully");
      }
      setDialogOpen(false);
      setSelectedRental(undefined);
    } catch (error) {
      toast.error("Failed to save rental item");
    }
  }

  function handleEditRental(rental: Rental) {
    setSelectedRental(rental);
    setDialogOpen(true);
  }

  function handleDeleteRental(rentalId: string) {
    try {
      setRentals(rentals.filter((r) => r.id !== rentalId));
      toast.success("Rental item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete rental item");
    }
  }

  function getCategoryLabel(category: Rental["category"]) {
    const labels: Record<Rental["category"], string> = {
      sports: "Sports Equipment",
      electronics: "Electronics",
      equipment: "General Equipment",
      vehicles: "Vehicles",
      other: "Other",
    };
    return labels[category];
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Rentals</h2>
            <p className="text-muted-foreground">
              Manage your rental equipment and items
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Rental Item
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rentals.map((rental) => (
            <Card key={rental.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="line-clamp-1">{rental.name}</CardTitle>
                  <Badge variant="secondary">
                    {getCategoryLabel(rental.category)}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {rental.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span>
                      {rental.price} {rental.currency} per day
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Availability:</span>
                    <span>
                      {rental.availableQuantity} of {rental.quantity} available
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={rental.isAvailable ? "default" : "secondary"}>
                      {rental.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  {rental.specifications.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Specifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {rental.specifications.map((spec: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {rental.requirements.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {rental.requirements.map((req: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Insurance:</span>
                    <span>
                      {rental.insuranceRequired ? "Required" : "Optional"} •{" "}
                      {rental.depositAmount} {rental.currency} deposit
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteRental(rental.id)}
                >
                  Delete
                </Button>
                <Button onClick={() => handleEditRental(rental)}>Edit</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <RentalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rental={selectedRental}
        onSubmit={handleRentalSubmit}
      />
    </div>
  );
} 