"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PdfUploadInputProps {
  onChange: (file: File) => void;
}

export function PdfUploadInput({ onChange }: PdfUploadInputProps) {
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
} 