"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RentalForm } from "./rental-form";
import { Rental } from "@/lib/modules/types";

interface RentalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rental?: Rental;
  onSubmit: (data: Omit<Rental, "id">) => Promise<void>;
}

export function RentalDialog({
  open,
  onOpenChange,
  rental,
  onSubmit,
}: RentalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {rental ? "Edit Rental Item" : "Add Rental Item"}
          </DialogTitle>
          <DialogDescription>
            {rental
              ? "Make changes to your rental item here. Click save when you're done."
              : "Add a new item to your rental inventory. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <RentalForm
          initialData={rental}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 