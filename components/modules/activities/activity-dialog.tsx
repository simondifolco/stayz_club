"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActivityForm } from "./activity-form";
import { Activity } from "@/lib/modules/types";

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: Activity;
  onSubmit: (data: Omit<Activity, "id">) => Promise<void>;
}

export function ActivityDialog({
  open,
  onOpenChange,
  activity,
  onSubmit,
}: ActivityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
          <DialogDescription>
            {activity
              ? "Make changes to your activity here. Click save when you're done."
              : "Add a new activity to your hotel's offerings."}
          </DialogDescription>
        </DialogHeader>
        <ActivityForm
          initialData={activity}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 