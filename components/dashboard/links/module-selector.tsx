"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_MODULES, Module } from "./types";

interface ModuleSelectorProps {
  value?: string;
  onChange: (moduleId: string) => void;
}

export function ModuleSelector({ value, onChange }: ModuleSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="module">Select Module</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a module" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_MODULES.map((module: Module) => (
            <SelectItem 
              key={module.id} 
              value={module.id}
              className="py-3"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{module.name}</span>
                <span className="text-xs text-muted-foreground">
                  {module.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <p className="text-sm text-muted-foreground">
          {AVAILABLE_MODULES.find((m: Module) => m.id === value)?.description}
        </p>
      )}
    </div>
  );
} 