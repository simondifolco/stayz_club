"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WellnessServiceForm } from "./wellness-service-form";
import { WellnessService } from "@/lib/modules/types";

interface WellnessServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: WellnessService;
  onSubmit: (data: Omit<WellnessService, "id">) => Promise<void>;
}

export function WellnessServiceDialog({
  open,
  onOpenChange,
  service,
  onSubmit,
}: WellnessServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {service ? "Edit Service" : "Create New Service"}
          </DialogTitle>
          <DialogDescription>
            {service
              ? "Make changes to your wellness service here. Click save when you're done."
              : "Add a new wellness service to your spa offerings."}
          </DialogDescription>
        </DialogHeader>
        <WellnessServiceForm
          initialData={service}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 