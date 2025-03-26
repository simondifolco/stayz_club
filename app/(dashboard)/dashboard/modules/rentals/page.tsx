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
      depositAmount: 0,
      allowsCancellation: true,
      cancellationPolicy: {
        deadline: 24,
        refundPercentage: 100,
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | undefined>(
    undefined
  );

  const handleRentalSubmit = async (data: Omit<Rental, "id">) => {
    try {
      if (selectedRental) {
        // Update existing rental
        setRentals(
          rentals.map((rental) =>
            rental.id === selectedRental.id ? { ...data, id: rental.id } : rental
          )
        );
      } else {
        // Add new rental
        setRentals([...rentals, { ...data, id: Math.random().toString() }]);
      }
      setIsDialogOpen(false);
      setSelectedRental(undefined);
    } catch (error) {
      console.error("Error submitting rental:", error);
      toast.error("Failed to save rental");
    }
  };

  const handleEditRental = (rental: Rental) => {
    setSelectedRental(rental);
    setIsDialogOpen(true);
  };

  const handleDeleteRental = (rentalId: string) => {
    setRentals(rentals.filter((rental) => rental.id !== rentalId));
    toast.success("Rental deleted successfully");
  };

  const getCategoryLabel = (category: Rental["category"]) => {
    const labels: Record<Rental["category"], string> = {
      sports: "Sports",
      electronics: "Electronics",
      equipment: "Equipment",
      vehicles: "Vehicles",
      other: "Other",
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
            <h1 className="text-2xl font-bold">Rentals</h1>
            <p className="text-muted-foreground">
              Manage your rental equipment and items
            </p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rental Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental) => (
          <Card key={rental.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{rental.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {rental.description}
                  </CardDescription>
                </div>
                <Badge>{getCategoryLabel(rental.category)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    {rental.price} {rental.currency} per day
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Availability</p>
                  <p className="text-sm text-muted-foreground">
                    {rental.availableQuantity} of {rental.quantity} available
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Insurance & Deposit</p>
                  <p className="text-sm text-muted-foreground">
                    {rental.insuranceRequired ? "Insurance required" : "No insurance required"}
                    {rental.depositAmount > 0 && ` • ${rental.depositAmount} ${rental.currency} deposit`}
                  </p>
                </div>
                {rental.specifications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Specifications</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {rental.specifications.map((spec, index) => (
                        <Badge key={index} variant="outline">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {rental.requirements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Requirements</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {rental.requirements.map((req, index) => (
                        <Badge key={index} variant="outline">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Maintenance</p>
                  <p className="text-sm text-muted-foreground">
                    Next maintenance: {new Date(rental.maintenanceSchedule.nextMaintenance).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
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

      <RentalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        rental={selectedRental}
        onSubmit={handleRentalSubmit}
      />
    </div>
  );
} 