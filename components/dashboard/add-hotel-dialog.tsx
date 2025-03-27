"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface AddHotelDialogProps {
  onAdd: (hotelData: { name: string; slug: string }) => void;
}

export function AddHotelDialog({ onAdd }: AddHotelDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      // Create a URL-friendly slug from the hotel name
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      onAdd({ name, slug });
      setName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          className="flex items-center gap-3 py-2 px-3"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-sm">Add New Hotel</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Hotel</DialogTitle>
          <DialogDescription>
            Create a new hotel to manage its links and services.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Hotel Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter hotel name"
              className="h-9"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!name.trim()}>
            Add Hotel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 