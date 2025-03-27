"use client";

import { ExternalLink, FileText, Blocks } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { LinkType } from "./types";

interface LinkTypeSelectorProps {
  value: LinkType;
  onValueChange: (value: LinkType) => void;
}

export function LinkTypeSelector({ value, onValueChange }: LinkTypeSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(newValue: string) => onValueChange(newValue as LinkType)}
      className="grid grid-cols-3 gap-4"
    >
      <div>
        <RadioGroupItem
          value="external"
          id="external"
          className="peer sr-only"
        />
        <label
          htmlFor="external"
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
            value === "external" && "border-primary"
          )}
        >
          <ExternalLink className="mb-2 h-6 w-6" />
          <span className="text-sm font-medium">External Link</span>
        </label>
      </div>
      <div>
        <RadioGroupItem
          value="pdf"
          id="pdf"
          className="peer sr-only"
        />
        <label
          htmlFor="pdf"
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
            value === "pdf" && "border-primary"
          )}
        >
          <FileText className="mb-2 h-6 w-6" />
          <span className="text-sm font-medium">PDF Document</span>
        </label>
      </div>
      <div>
        <RadioGroupItem
          value="module"
          id="module"
          className="peer sr-only"
        />
        <label
          htmlFor="module"
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
            value === "module" && "border-primary"
          )}
        >
          <Blocks className="mb-2 h-6 w-6" />
          <span className="text-sm font-medium">Interactive Module</span>
        </label>
      </div>
    </RadioGroup>
  );
} 