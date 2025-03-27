"use client";

import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Block, Link, LinkType } from "./types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableLink } from "./sortable-link";
import { AddLinkDialog } from "./add-link-dialog";
import { EditBlockDialog } from "./edit-block-dialog";

interface SortableBlockProps {
  block: Block;
  blocks: Block[];
  onAddLink: (blockId: number, name: string, type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => void;
  onDeleteBlock: () => void;
  onDeleteLink: (linkId: number) => void;
  onEditBlock: (id: number, name: string) => void;
  onEditLink: (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => void;
}

export function SortableBlock({ 
  block,
  blocks, 
  onAddLink, 
  onDeleteBlock, 
  onDeleteLink,
  onEditBlock,
  onEditLink
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ 
    id: block.id,
    data: {
      type: 'block',
      block,
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
    willChange: 'transform',
    touchAction: 'none',
  } as const;

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-6 transition-all duration-200 ease-out touch-none",
        isDragging ? "scale-[1.02] shadow-xl ring-2 ring-primary bg-accent/5" : "",
        isSorting ? "transform-gpu" : "",
        block.isEnabled ? "opacity-100" : "opacity-60"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div 
          className="flex items-center space-x-2 select-none touch-none" 
          {...attributes} 
          {...listeners}
        >
          <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-grab active:cursor-grabbing" />
          <CardTitle className="text-base font-medium">{block.name}</CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <AddLinkDialog blockId={block.id} blockName={block.name} onAdd={onAddLink} />
          <EditBlockDialog 
            block={block} 
            onEdit={onEditBlock}
            onDelete={onDeleteBlock}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <SortableContext
            items={block.links.map(link => `link-${block.id}-${link.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {block.links.map((link) => (
              <SortableLink 
                key={link.id} 
                link={link} 
                blockId={block.id}
                blocks={blocks}
                onDelete={() => onDeleteLink(link.id)}
                onEdit={onEditLink}
              />
            ))}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
} 