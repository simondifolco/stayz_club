"use client";

import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, LinkType, Block } from "./types";
import { EditLinkDialog } from "./edit-link-dialog";

interface SortableLinkProps {
  link: Link;
  blockId: number;
  blocks: Block[];
  onDelete: () => void;
  onEdit: (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType) => void;
}

export function SortableLink({ link, blockId, blocks, onDelete, onEdit }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ 
    id: `link-${blockId}-${link.id}`,
    data: {
      type: 'link',
      link,
      blockId,
    },
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1 : undefined,
    position: isDragging ? 'relative' : undefined,
    opacity: isDragging ? 0.8 : 1,
  } as const;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-3 rounded-md border mb-2 bg-background transition-all ease-in-out duration-200 touch-none",
        isDragging ? "scale-[1.02] shadow-xl ring-2 ring-primary border-primary bg-accent/5" : "border-transparent",
        isSorting ? "transform-gpu" : "",
        link.status === 'inactive' ? 'opacity-60 bg-muted/50' : ''
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <DragHandleDots2Icon 
          className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-grab active:cursor-grabbing flex-shrink-0" 
          {...attributes} 
          {...listeners}
        />
        <span className={link.status === 'inactive' ? 'line-through text-muted-foreground' : ''}>
          {link.name}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={link.status === 'active'}
          onCheckedChange={(checked) => 
            onEdit(blockId, blockId, link.id, link.name, checked ? 'active' : 'inactive', link.type)
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