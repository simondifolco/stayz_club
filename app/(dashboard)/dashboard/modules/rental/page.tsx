"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ModuleConfigForm } from "@/components/modules/module-config-form";
import { ModuleConfig } from "@/lib/modules/types";

const defaultConfig: ModuleConfig = {
  id: "rental",
  name: "Rentals",
  enabled: true,
  bookingFields: [
    {
      id: "equipment_type",
      label: "Equipment Type",
      type: "select",
      required: true,
      options: [
        { label: "Bicycle", value: "bicycle" },
        { label: "Water Sports Equipment", value: "water-sports" },
        { label: "Sports Equipment", value: "sports" },
        { label: "Beach Equipment", value: "beach" }
      ]
    },
    {
      id: "start_date",
      label: "Start Date",
      type: "date",
      required: true
    },
    {
      id: "end_date",
      label: "End Date",
      type: "date",
      required: true
    },
    {
      id: "quantity",
      label: "Quantity",
      type: "number",
      required: true,
      validation: {
        min: 1,
        max: 5,
        message: "Please enter a number between 1 and 5"
      }
    },
    {
      id: "size",
      label: "Size/Specification",
      type: "select",
      required: true,
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" }
      ]
    },
    {
      id: "notes",
      label: "Additional Notes",
      type: "textarea",
      required: false,
      placeholder: "Any specific requirements or preferences?"
    }
  ],
  pricing: {
    type: "per_hour",
    basePrice: 15,
    currency: "EUR"
  },
  availability: {
    daysInAdvance: 30,
    timeSlots: [
      { start: "08:00", end: "20:00" }
    ]
  }
};

export default function RentalsModulePage() {
  async function handleSave(config: ModuleConfig) {
    // TODO: Implement save to database
    console.log("Saving config:", config);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/modules">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Rentals</h2>
          </div>
          <p className="text-muted-foreground">
            Configure equipment rental bookings
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <ModuleConfigForm
          initialConfig={defaultConfig}
          onSave={handleSave}
          moduleType="rental"
        />
      </div>
    </div>
  );
} 