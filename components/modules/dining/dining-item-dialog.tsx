"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DiningItemForm } from "./dining-item-form";
import { DiningItem } from "@/lib/modules/types";

interface DiningItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: DiningItem;
  onSubmit: (data: Omit<DiningItem, "id">) => Promise<void>;
}

export function DiningItemDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: DiningItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Menu Item" : "Add Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {item
              ? "Make changes to your menu item here. Click save when you're done."
              : "Add a new item to your menu. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <DiningItemForm
          initialData={item}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 