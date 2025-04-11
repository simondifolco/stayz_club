"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditLinkDialogProps, LinkType } from "./types";

export function EditLinkDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  defaultValues
}: EditLinkDialogProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [type, setType] = useState<LinkType>(defaultValues?.type ?? "external");
  const [url, setUrl] = useState(defaultValues?.url ?? "");
  const [pdfUrl, setPdfUrl] = useState(defaultValues?.pdfUrl ?? "");

  const isValid = () => {
    if (!title.trim()) return false;
    return type === "external" ? !!url.trim() : !!pdfUrl.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    await onSubmit({
      title,
      type,
      url: type === "external" ? url : undefined,
      pdfUrl: type === "pdf" ? pdfUrl : undefined,
    });
    setTitle("");
    setType("external");
    setUrl("");
    setPdfUrl("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Link" : "Add Link"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter link title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "external" ? "default" : "outline"}
                onClick={() => setType("external")}
                className="flex-1"
              >
                External Link
              </Button>
              <Button
                type="button"
                variant={type === "pdf" ? "default" : "outline"}
                onClick={() => setType("pdf")}
                className="flex-1"
              >
                PDF Document
              </Button>
            </div>
          </div>
          {type === "external" ? (
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="pdfUrl">PDF URL</Label>
              <Input
                id="pdfUrl"
                type="url"
                placeholder="https://..."
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid()}>
              {defaultValues ? "Save Changes" : "Add Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 