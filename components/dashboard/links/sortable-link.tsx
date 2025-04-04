"use client";

import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, LinkType, ModuleType, Block } from "./types";
import { EditLinkDialog } from "./edit-link-dialog";

interface SortableLinkProps {
  link: Link;
  blockId: number;
  blocks: Block[];
  onDelete: () => void;
  onEdit: (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType, url?: string, pdfFile?: File, moduleType?: ModuleType) => void;
}

export function SortableLink({ link, blockId, blocks, onDelete, onEdit }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link.id,
    data: {
      type: 'link',
      blockId,
      link,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1 : undefined,
    position: isDragging ? 'relative' : undefined,
    opacity: isDragging ? 0.8 : 1,
    willChange: 'transform',
    touchAction: 'none',
  } as const;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/5 transition-colors duration-200 ease-out touch-none",
        isDragging ? "scale-[1.02] shadow-xl ring-2 ring-primary bg-accent/5" : "",
        link.status === 'inactive' && "opacity-60"
      )}
    >
      <div className="flex items-center gap-3 select-none touch-none" {...attributes} {...listeners}>
        <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-grab active:cursor-grabbing" />
        <span className="text-sm font-medium">{link.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={link.status === 'active'}
          onCheckedChange={(checked) => 
            onEdit(blockId, blockId, link.id, link.name, checked ? 'active' : 'inactive', link.type, link.url, link.pdfFile, link.moduleType)
          }
        />
        <EditLinkDialog 
          link={link} 
          blockId={blockId} 
          blocks={blocks}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
} 