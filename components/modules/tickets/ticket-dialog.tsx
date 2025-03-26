"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TicketForm } from "./ticket-form";
import { Ticket } from "@/lib/modules/types";

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: Ticket;
  onSubmit: (data: Omit<Ticket, "id">) => Promise<void>;
}

export function TicketDialog({
  open,
  onOpenChange,
  ticket,
  onSubmit,
}: TicketDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ticket ? "Edit Ticket" : "Add Ticket"}
          </DialogTitle>
          <DialogDescription>
            {ticket
              ? "Make changes to your ticket here. Click save when you're done."
              : "Add a new ticket to your events. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <TicketForm
          initialData={ticket}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 