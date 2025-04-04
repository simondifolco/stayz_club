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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkType, ModuleType } from "./types";
import { LinkTypeSelector } from "./link-type-selector";
import { ExternalLinkInput } from "./external-link-input";
import { PdfUploadInput } from "./pdf-upload-input";
import { ModuleTypeSelector } from "./module-type-selector";

interface AddLinkDialogProps {
  blockId: number;
  blockName: string;
  onAdd: (blockId: number, name: string, type: LinkType, url?: string, pdfFile?: File, moduleType?: ModuleType) => void;
}

export function AddLinkDialog({ blockId, blockName, onAdd }: AddLinkDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<LinkType>("external");
  const [url, setUrl] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | undefined>();
  const [moduleType, setModuleType] = useState<ModuleType | undefined>();
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(blockId, name, type, url, pdfFile, moduleType);
      setName("");
      setUrl("");
      setPdfFile(undefined);
      setModuleType(undefined);
      setOpen(false);
    }
  };

  const isValid = () => {
    if (!name.trim()) return false;
    switch (type) {
      case 'external':
        return !!url.trim();
      case 'pdf':
        return !!pdfFile;
      case 'module':
        return !!moduleType;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link to {blockName}</DialogTitle>
          <DialogDescription>
            Choose the type of link you want to add. External links point to other websites, PDFs are downloadable documents, and modules are interactive features.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter link name"
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <LinkTypeSelector value={type} onValueChange={setType} />
          </div>
          {type === 'external' && (
            <ExternalLinkInput value={url} onChange={setUrl} />
          )}
          {type === 'pdf' && (
            <PdfUploadInput onChange={setPdfFile} />
          )}
          {type === 'module' && (
            <div className="grid gap-2">
              <Label>Module Type</Label>
              <ModuleTypeSelector value={moduleType} onChange={setModuleType} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!isValid()}>
            Add Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 