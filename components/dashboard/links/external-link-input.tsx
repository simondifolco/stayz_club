"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExternalLinkInputProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ExternalLinkInput({ value, onChange }: ExternalLinkInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="url">URL</Label>
      <Input
        id="url"
        type="url"
        placeholder="https://example.com"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
} 