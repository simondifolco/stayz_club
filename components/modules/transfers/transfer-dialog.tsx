"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransferForm } from "./transfer-form";
import { Transfer } from "@/lib/modules/types";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfer?: Transfer;
  onSubmit: (data: Omit<Transfer, "id">) => Promise<void>;
}

export function TransferDialog({
  open,
  onOpenChange,
  transfer,
  onSubmit,
}: TransferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transfer ? "Edit Transfer" : "Add Transfer"}
          </DialogTitle>
          <DialogDescription>
            {transfer
              ? "Make changes to your transfer here. Click save when you're done."
              : "Add a new transfer service. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <TransferForm
          initialData={transfer}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 