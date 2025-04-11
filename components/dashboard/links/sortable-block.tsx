"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortableBlockProps {
  block: Block;
  onDeleteBlock: () => Promise<void>;
  onEditBlock: () => void;
  onAddLink: () => void;
  onDeleteLink: (linkId: string) => Promise<void>;
  onEditLink: (linkId: string) => void;
  children?: React.ReactNode;
}

export function SortableBlock({
  block,
  onDeleteBlock,
  onEditBlock,
  onAddLink,
  onDeleteLink,
  onEditLink,
  children,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{block.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddLink}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEditBlock}>
                  Edit Block
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={onDeleteBlock}
                >
                  Delete Block
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2">
          {children}
        </div>
      </Card>
    </div>
  );
} 