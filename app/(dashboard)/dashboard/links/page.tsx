"use client";

import { Button } from "@/components/ui/button";
import { Plus, Calendar, Globe, MoreVertical, Pencil, ExternalLink, FileText, Blocks } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ThemeSettingsDialog } from "@/components/dashboard/theme-settings-dialog";
import { LinksPageContent } from '@/components/dashboard/links/links-page-content';

const DynamicLinksPageContent = dynamic<Record<string, never>>(() => 
  Promise.resolve(LinksPageContent), 
  { ssr: false }
);

export default function LinksPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <DynamicLinksPageContent />
    </Suspense>
  );
}

const LinkTypeSelector = function LinkTypeSelector({ value, onValueChange }: { 
  value: LinkType; 
  onValueChange: (value: LinkType) => void;
}) {
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
};

const ExternalLinkInput = function ExternalLinkInput({ value, onChange }: { 
  value?: string; 
  onChange: (url: string) => void;
}) {
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
};

const PdfUploadInput = function PdfUploadInput({ onChange }: { 
  onChange: (file: File) => void;
}) {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="pdf">PDF Document</Label>
      <div className="flex gap-2 items-center">
        <Input
          id="pdf"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('pdf')?.click()}
          className="w-full"
        >
          <FileText className="mr-2 h-4 w-4" />
          {fileName || 'Upload PDF'}
        </Button>
      </div>
      {fileName && (
        <p className="text-sm text-muted-foreground">
          Selected file: {fileName}
        </p>
      )}
    </div>
  );
};

const ModuleSelector = function ModuleSelector({ value, onChange }: { 
  value?: string; 
  onChange: (moduleId: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="module">Select Module</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a module" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_MODULES.map((module) => (
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
          {AVAILABLE_MODULES.find(m => m.id === value)?.description}
        </p>
      )}
    </div>
  );
}; 