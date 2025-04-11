"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (name: string) => void;
}

export function AddBlockDialog({ open, onOpenChange, onAdd }: AddBlockDialogProps) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim() && onAdd) {
      onAdd(name);
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Block</DialogTitle>
          <DialogDescription>
            Create a new block to organize your links.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter block name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!name.trim()}>
            Add Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 