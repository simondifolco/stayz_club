"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, LinkType, ModuleType, Block } from "./types";
import { LinkTypeSelector } from "./link-type-selector";
import { ExternalLinkInput } from "./external-link-input";
import { PdfUploadInput } from "./pdf-upload-input";
import { ModuleTypeSelector } from "./module-type-selector";

interface EditLinkDialogProps {
  link: Link;
  blockId: number;
  blocks: Block[];
  onEdit: (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType, url?: string, pdfFile?: File, moduleType?: ModuleType) => void;
  onDelete: () => void;
}

export function EditLinkDialog({ 
  link, 
  blockId, 
  blocks,
  onEdit,
  onDelete
}: EditLinkDialogProps) {
  const [name, setName] = useState(link.name);
  const [selectedBlockId, setSelectedBlockId] = useState(blockId.toString());
  const [type, setType] = useState<LinkType>(link.type);
  const [url, setUrl] = useState<string>(link.url || "");
  const [pdfFile, setPdfFile] = useState<File | undefined>(link.pdfFile);
  const [moduleType, setModuleType] = useState<ModuleType | undefined>(link.moduleType);
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    if (name.trim()) {
      onEdit(blockId, parseInt(selectedBlockId), link.id, name, link.status, type, url, pdfFile, moduleType);
      setOpen(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    setOpen(false);
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
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Choose the type of link. External links point to other websites, PDFs are downloadable documents, and modules are interactive features.
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
            <Label htmlFor="block">Block</Label>
            <Select value={selectedBlockId} onValueChange={setSelectedBlockId}>
              <SelectTrigger>
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                {blocks.map(block => (
                  <SelectItem key={block.id} value={block.id.toString()}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <DialogFooter className="flex items-center justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            Delete Link
          </Button>
          <Button onClick={handleEdit} disabled={!isValid()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 