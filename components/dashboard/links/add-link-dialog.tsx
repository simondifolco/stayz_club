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
import { LinkType } from "./types";
import { LinkTypeSelector } from "./link-type-selector";
import { ExternalLinkInput } from "./external-link-input";
import { PdfUploadInput } from "./pdf-upload-input";
import { ModuleSelector } from "./module-selector";

interface AddLinkDialogProps {
  blockId: number;
  blockName: string;
  onAdd: (blockId: number, name: string, type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => void;
}

export function AddLinkDialog({ blockId, blockName, onAdd }: AddLinkDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<LinkType>("external");
  const [url, setUrl] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | undefined>();
  const [moduleId, setModuleId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(blockId, name, type, url, pdfFile, moduleId);
      setName("");
      setUrl("");
      setPdfFile(undefined);
      setModuleId("");
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
        return !!moduleId;
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
            Choose the type of link you want to add. Modules are interactive components, external links point to other websites, and PDFs are downloadable documents.
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
            <ModuleSelector value={moduleId} onChange={setModuleId} />
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