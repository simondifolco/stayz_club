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
import { WellnessService, WellnessModuleSettings } from "@/lib/modules/types";
import { Badge } from "@/components/ui/badge";
import { WellnessServiceDialog } from "@/components/modules/wellness/wellness-service-dialog";

const mockServices: WellnessService[] = [
  {
    id: "1",
    name: "Deep Tissue Massage",
    description: "A therapeutic massage that targets deep muscle tissue",
    category: "massage",
    duration: 60,
    price: 120,
    currency: "EUR",
    images: [],
    benefits: [
      "Relieves chronic muscle tension",
      "Improves blood circulation",
      "Reduces stress and anxiety",
    ],
    contraindications: [
      "Recent injuries",
      "Blood clots",
      "Pregnancy (first trimester)",
    ],
  },
  {
    id: "2",
    name: "Aromatherapy Facial",
    description: "A relaxing facial treatment using essential oils",
    category: "beauty",
    duration: 45,
    price: 85,
    currency: "EUR",
    images: [],
    benefits: [
      "Deep skin cleansing",
      "Natural aromatherapy benefits",
      "Improved skin texture",
    ],
    contraindications: [
      "Sensitive skin conditions",
      "Recent facial surgery",
      "Active acne",
    ],
  },
];

export default function WellnessModulePage() {
  const [services, setServices] = useState<WellnessService[]>(mockServices);
  const [moduleSettings, setModuleSettings] = useState<WellnessModuleSettings>({
    enabled: true,
    bookingNotice: 24,
    cancellationPolicy: {
      deadline: 24,
      refundPercentage: 50,
    },
    availability: {
      daysInAdvance: 30,
      operatingHours: [
        { dayOfWeek: 1, start: "09:00", end: "18:00" }, // Monday
        { dayOfWeek: 2, start: "09:00", end: "18:00" }, // Tuesday
        { dayOfWeek: 3, start: "09:00", end: "18:00" }, // Wednesday
        { dayOfWeek: 4, start: "09:00", end: "18:00" }, // Thursday
        { dayOfWeek: 5, start: "09:00", end: "18:00" }, // Friday
        { dayOfWeek: 6, start: "10:00", end: "16:00" }, // Saturday
      ],
      breakTimes: [],
      holidayClosures: [],
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<WellnessService | undefined>(
    undefined
  );

  const handleServiceSubmit = async (data: Omit<WellnessService, "id">) => {
    try {
      if (selectedService) {
        // Update existing service
        setServices(
          services.map((service) =>
            service.id === selectedService.id ? { ...data, id: service.id } : service
          )
        );
      } else {
        // Add new service
        setServices([...services, { ...data, id: Math.random().toString() }]);
      }
      setIsDialogOpen(false);
      setSelectedService(undefined);
    } catch (error) {
      console.error("Error submitting service:", error);
      toast.error("Failed to save service");
    }
  };

  const handleEditService = (service: WellnessService) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((service) => service.id !== serviceId));
    toast.success("Service deleted successfully");
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
            <h1 className="text-2xl font-bold">Wellness</h1>
            <p className="text-muted-foreground">
              Configure wellness services and treatments
            </p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {service.description}
                  </CardDescription>
                </div>
                <Badge>{service.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {service.duration} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    {service.price} {service.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Benefits</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-4">
                    {service.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleDeleteService(service.id)}
              >
                Delete
              </Button>
              <Button onClick={() => handleEditService(service)}>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <WellnessServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={selectedService}
        onSubmit={handleServiceSubmit}
      />
    </div>
  );
} 