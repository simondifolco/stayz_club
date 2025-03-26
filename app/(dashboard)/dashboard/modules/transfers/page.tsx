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
import { Transfer, TransferModuleSettings } from "@/lib/modules/types";
import { Badge } from "@/components/ui/badge";
import { TransferDialog } from "@/components/modules/transfers/transfer-dialog";

const mockTransfers: Transfer[] = [
  {
    id: "1",
    name: "Airport Transfer - Premium",
    description: "Luxury airport transfer service with meet and greet",
    type: "airport",
    vehicle: {
      type: "Luxury Sedan",
      capacity: 4,
      features: ["WiFi", "Air Conditioning", "Leather Seats"],
      image: "/images/vehicles/luxury-sedan.jpg",
    },
    price: 120,
    currency: "USD",
    duration: 45,
    distance: 35,
    route: {
      pickup: {
        name: "International Airport",
        address: "Airport Terminal 1",
        coordinates: { lat: 40.7128, lng: -74.0060 },
      },
      dropoff: {
        name: "City Center Hotels",
        address: "Downtown Area",
        coordinates: { lat: 40.7580, lng: -73.9855 },
      },
    },
    availableVehicles: 5,
    requirements: [
      "Valid ID required",
      "Flight details needed",
      "24h advance booking",
    ],
    cancellationPolicy: {
      deadline: 24,
      refundPercentage: 80,
    },
  },
  {
    id: "2",
    name: "Port Transfer - Group",
    description: "Comfortable transfer service from cruise port to city",
    type: "port",
    vehicle: {
      type: "Minivan",
      capacity: 8,
      features: ["Luggage Space", "Air Conditioning", "USB Charging"],
      image: "/images/vehicles/minivan.jpg",
    },
    price: 180,
    currency: "USD",
    duration: 30,
    distance: 20,
    route: {
      pickup: {
        name: "Cruise Port Terminal",
        address: "Port Main Gate",
        coordinates: { lat: 40.7023, lng: -74.0167 },
      },
      dropoff: {
        name: "City Hotels Zone",
        address: "Hotel District",
        coordinates: { lat: 40.7505, lng: -73.9934 },
      },
    },
    availableVehicles: 3,
    requirements: [
      "Cruise details required",
      "12h advance booking",
      "Maximum 8 passengers",
    ],
    cancellationPolicy: {
      deadline: 12,
      refundPercentage: 70,
    },
  },
];

export default function TransfersModulePage() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [moduleSettings, setModuleSettings] = useState<TransferModuleSettings>({
    enabled: true,
    settings: {
      requiresDeposit: true,
      depositAmount: 50,
      allowsCancellation: true,
      cancellationPolicy: {
        deadline: 24,
        refundPercentage: 80,
      },
      minBookingNotice: 6,
      maxPassengers: 8,
      autoConfirm: false,
      luggageRestrictions: {
        maxPieces: 2,
        maxWeightPerPiece: 23,
      },
    },
    availability: {
      daysInAdvance: 90,
      operatingHours: [
        {
          dayOfWeek: 1,
          start: "06:00",
          end: "22:00",
        },
      ],
      specialClosures: [],
    },
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | undefined>();

  async function handleTransferSubmit(data: Omit<Transfer, "id">) {
    try {
      if (selectedTransfer) {
        // Update existing transfer
        const updatedTransfers = transfers.map((t) =>
          t.id === selectedTransfer.id ? { ...data, id: t.id } : t
        );
        setTransfers(updatedTransfers);
        toast.success("Transfer updated successfully");
      } else {
        // Add new transfer
        const newTransfer = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
        };
        setTransfers([...transfers, newTransfer]);
        toast.success("Transfer added successfully");
      }
      setDialogOpen(false);
      setSelectedTransfer(undefined);
    } catch (error) {
      toast.error("Failed to save transfer");
    }
  }

  function handleEditTransfer(transfer: Transfer) {
    setSelectedTransfer(transfer);
    setDialogOpen(true);
  }

  function handleDeleteTransfer(transferId: string) {
    try {
      setTransfers(transfers.filter((t) => t.id !== transferId));
      toast.success("Transfer deleted successfully");
    } catch (error) {
      toast.error("Failed to delete transfer");
    }
  }

  function getTypeLabel(type: Transfer["type"]) {
    const labels: Record<Transfer["type"], string> = {
      airport: "Airport Transfer",
      port: "Port Transfer",
      station: "Station Transfer",
      custom: "Custom Transfer",
    };
    return labels[type];
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
            <h2 className="text-2xl font-bold tracking-tight">Transfers</h2>
            <p className="text-muted-foreground">
              Manage your transfer services and settings
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transfer
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {transfers.map((transfer) => (
            <Card key={transfer.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="line-clamp-1">{transfer.name}</CardTitle>
                  <Badge variant="secondary">{getTypeLabel(transfer.type)}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {transfer.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span>
                      {transfer.vehicle.type} ({transfer.vehicle.capacity} seats)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{transfer.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span>
                      {transfer.price} {transfer.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <span>{transfer.availableVehicles} vehicles</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteTransfer(transfer.id)}
                >
                  Delete
                </Button>
                <Button onClick={() => handleEditTransfer(transfer)}>Edit</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <TransferDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transfer={selectedTransfer}
        onSubmit={handleTransferSubmit}
      />
    </div>
  );
} 