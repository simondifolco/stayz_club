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
import { Textarea } from "@/components/ui/textarea";

interface AddLinkDialogProps {
  blockId: number;
  blockName: string;
  onAdd: (blockId: number, name: string, description: string, type: 'external' | 'pdf', url?: string, pdfUrl?: string) => void;
}

export function AddLinkDialog({ blockId, blockName, onAdd }: AddLinkDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'external' | 'pdf'>('external');
  const [url, setUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (name.trim() && description.trim()) {
      onAdd(blockId, name, description, type, type === 'external' ? url : undefined, type === 'pdf' ? pdfUrl : undefined);
      setName("");
      setDescription("");
      setUrl("");
      setPdfUrl("");
      setOpen(false);
    }
  };

  const isValid = () => {
    if (!name.trim() || !description.trim()) return false;
    return type === 'external' ? !!url.trim() : !!pdfUrl.trim();
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
            Add a link to your block. External links point to other websites, while PDFs are downloadable documents.
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={type === 'external' ? 'default' : 'outline'}
                onClick={() => setType('external')}
              >
                External Link
              </Button>
              <Button
                type="button"
                variant={type === 'pdf' ? 'default' : 'outline'}
                onClick={() => setType('pdf')}
              >
                PDF Document
              </Button>
            </div>
          </div>
          {type === 'external' && (
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}
          {type === 'pdf' && (
            <div className="grid gap-2">
              <Label htmlFor="pdfUrl">PDF URL</Label>
              <Input
                id="pdfUrl"
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://..."
              />
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