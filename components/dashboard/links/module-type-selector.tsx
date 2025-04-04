"use client";

import { ModuleType } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModuleTypeSelectorProps {
  value: ModuleType | undefined;
  onChange: (value: ModuleType) => void;
}

const MODULE_TYPES: { value: ModuleType; label: string }[] = [
  { value: "activities", label: "Activities" },
  { value: "wellness", label: "Wellness" },
  { value: "dining", label: "Dining" },
  { value: "tickets", label: "Tickets" },
  { value: "rentals", label: "Rentals" },
  { value: "transfers", label: "Transfers" },
];

export function ModuleTypeSelector({ value, onChange }: ModuleTypeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a module type" />
      </SelectTrigger>
      <SelectContent>
        {MODULE_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 