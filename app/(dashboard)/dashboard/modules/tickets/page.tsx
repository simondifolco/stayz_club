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
import { Ticket, TicketModuleSettings } from "@/lib/modules/types";
import { Badge } from "@/components/ui/badge";
import { TicketDialog } from "@/components/modules/tickets/ticket-dialog";

const mockTickets: Ticket[] = [
  {
    id: "1",
    name: "Summer Jazz Festival",
    description: "An evening of smooth jazz under the stars",
    type: "concert",
    date: "2024-07-15",
    time: "19:00",
    venue: {
      name: "Garden Amphitheater",
      address: "123 Park Avenue",
      coordinates: {
        lat: 40.7128,
        lng: -74.0060,
      },
    },
    price: 75,
    currency: "EUR",
    capacity: 500,
    availableTickets: 350,
    images: [],
    category: ["music", "jazz", "outdoor"],
    duration: 180,
    restrictions: ["18+", "No outside food or drinks"],
  },
  {
    id: "2",
    name: "Historical City Tour",
    description: "Discover the hidden gems of our historic city center",
    type: "tour",
    date: "2024-06-20",
    time: "10:00",
    venue: {
      name: "City Center",
      address: "1 Main Street",
      coordinates: {
        lat: 40.7112,
        lng: -74.0055,
      },
    },
    price: 35,
    currency: "EUR",
    capacity: 20,
    availableTickets: 15,
    images: [],
    category: ["tour", "history", "walking"],
    duration: 120,
    restrictions: ["Comfortable walking shoes required"],
  },
];

export default function TicketsModulePage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [moduleSettings, setModuleSettings] = useState<TicketModuleSettings>({
    enabled: true,
    settings: {
      requiresDeposit: true,
      depositAmount: 10,
      allowsCancellation: true,
      cancellationPolicy: {
        deadline: 48,
        refundPercentage: 80,
      },
      minBookingNotice: 24,
      maxTicketsPerBooking: 10,
      autoConfirm: true,
    },
    availability: {
      daysInAdvance: 90,
      specialClosures: [],
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>(
    undefined
  );

  const handleTicketSubmit = async (data: Omit<Ticket, "id">) => {
    try {
      if (selectedTicket) {
        // Update existing ticket
        setTickets(
          tickets.map((ticket) =>
            ticket.id === selectedTicket.id ? { ...data, id: ticket.id } : ticket
          )
        );
      } else {
        // Add new ticket
        setTickets([...tickets, { ...data, id: Math.random().toString() }]);
      }
      setIsDialogOpen(false);
      setSelectedTicket(undefined);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("Failed to save ticket");
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
    toast.success("Ticket deleted successfully");
  };

  const formatDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
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
            <h1 className="text-2xl font-bold">Tickets</h1>
            <p className="text-muted-foreground">
              Manage your events and ticket sales
            </p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{ticket.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {ticket.description}
                  </CardDescription>
                </div>
                <Badge>{ticket.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(ticket.date, ticket.time)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Venue</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.venue.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.venue.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.price} {ticket.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Availability</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.availableTickets} of {ticket.capacity} tickets available
                  </p>
                </div>
                {ticket.category.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Categories</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ticket.category.map((cat, index) => (
                        <Badge key={index} variant="outline">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {ticket.restrictions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Restrictions</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ticket.restrictions.map((restriction, index) => (
                        <Badge key={index} variant="outline">
                          {restriction}
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
                onClick={() => handleDeleteTicket(ticket.id)}
              >
                Delete
              </Button>
              <Button onClick={() => handleEditTicket(ticket)}>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <TicketDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        ticket={selectedTicket}
        onSubmit={handleTicketSubmit}
      />
    </div>
  );
} 