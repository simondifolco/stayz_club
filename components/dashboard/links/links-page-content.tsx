"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Block, BlockItem, LinkType, EditBlockDialogProps, EditLinkDialogProps, HotelBlock, HotelLink, SortOrderItem } from "./types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SortableBlock } from "./sortable-block";
import { useBlocks } from "@/hooks/use-blocks";
import { EditBlockDialog } from "./edit-block-dialog";
import { EditLinkDialog } from "./edit-link-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { SortableLink } from "./sortable-link";

interface LinkFormData {
  title: string;
  type: LinkType;
  url?: string;
  pdfUrl?: string;
}

interface LinksPageContentProps {
  blocks: Block[];
  loading: boolean;
  error: Error | null;
  isAddBlockOpen: boolean;
  setIsAddBlockOpen: (open: boolean) => void;
  onAddBlock: (title: string) => Promise<void>;
  onEditBlock: (blockId: string, title: string) => Promise<void>;
  onDeleteBlock: (blockId: string) => Promise<void>;
  onAddLink: (
    blockId: string,
    title: string,
    type: LinkType,
    url?: string,
    pdfUrl?: string
  ) => Promise<void>;
  onEditLink: (
    linkId: string,
    blockId: string,
    title: string,
    type: LinkType,
    url?: string,
    pdfUrl?: string
  ) => Promise<void>;
  onDeleteLink: (linkId: string) => Promise<void>;
  onUpdateBlockSortOrder: (items: SortOrderItem[]) => Promise<void>;
  onUpdateLinkSortOrder: (blockId: string, items: SortOrderItem[]) => Promise<void>;
}

export function LinksPageContent({ 
  blocks,
  loading,
  error,
  isAddBlockOpen,
  setIsAddBlockOpen,
  onAddBlock,
  onEditBlock,
  onDeleteBlock,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onUpdateBlockSortOrder,
  onUpdateLinkSortOrder
}: LinksPageContentProps) {
  // Dialog states
  const [isEditBlockOpen, setIsEditBlockOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isEditLinkOpen, setIsEditLinkOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    try {
      if (active.id !== over.id) {
        // Check if we're dragging a block or a link
        const activeBlock = blocks.find((block) => block.id === active.id);
        
        if (activeBlock) {
          // Handle block dragging
          const oldIndex = blocks.findIndex((item) => item.id === active.id);
          const newIndex = blocks.findIndex((item) => item.id === over.id);
          const newBlocks = arrayMove(blocks, oldIndex, newIndex);
          
          // Create items array for all blocks with updated sort orders
          const blockItems = newBlocks.map((block, index) => ({
            id: block.id,
            sort_order: index
          }));

          await onUpdateBlockSortOrder(blockItems);
        } else {
          // Handle link dragging
          const parentBlock = blocks.find((block) =>
            block.links.some((link) => link.id === active.id)
          );

          if (parentBlock) {
            const oldIndex = parentBlock.links.findIndex((link) => link.id === active.id);
            const newIndex = parentBlock.links.findIndex((link) => link.id === over.id);
            const newLinks = arrayMove(parentBlock.links, oldIndex, newIndex);

            // Create items array for all links with updated sort orders
            const linkItems = newLinks.map((link, index) => ({
              id: link.id,
              sort_order: index
            }));

            await onUpdateLinkSortOrder(parentBlock.id, linkItems);
          }
        }
      }
    } catch (error) {
      console.error('Error updating sort order:', error);
      toast.error('Failed to update order');
    }
  }, [blocks, onUpdateBlockSortOrder, onUpdateLinkSortOrder]);

  const handleAddBlock = async (title: string) => {
    try {
      await onAddBlock(title);
      toast.success("Block added successfully");
    } catch (error: any) {
      console.error('Error adding block:', error);
      toast.error("Failed to add block", {
        description: error.message
      });
    }
  };

  const handleEditBlock = async (blockId: string, title: string) => {
    try {
      await onEditBlock(blockId, title);
      setIsEditBlockOpen(false);
      setSelectedBlockId(null);
      toast.success("Block updated successfully");
    } catch (error: any) {
      console.error('Error editing block:', error);
      toast.error("Failed to update block", {
        description: error.message
      });
    }
  };

  const handleAddLink = async (blockId: string, data: LinkFormData) => {
    try {
      await onAddLink(
        blockId,
        data.title,
        data.type,
        data.type === 'external' ? data.url : undefined,
        data.type === 'pdf' ? data.pdfUrl : undefined
      );
      setIsAddLinkOpen(false);
      setSelectedBlockId(null);
      toast.success("Link added successfully");
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error("Failed to add link", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  };

  const handleEditLink = async (linkId: string, blockId: string, data: LinkFormData) => {
    try {
      await onEditLink(
        linkId,
        blockId,
        data.title,
        data.type,
        data.type === 'external' ? data.url : undefined,
        data.type === 'pdf' ? data.pdfUrl : undefined
      );
      setIsEditLinkOpen(false);
      setSelectedLinkId(null);
      setSelectedBlockId(null);
      toast.success("Link updated successfully");
    } catch (error: any) {
      console.error('Error editing link:', error);
      toast.error("Failed to update link", {
        description: error.message
      });
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await onDeleteBlock(blockId);
      toast.success("Block deleted successfully");
    } catch (error: any) {
      console.error('Error deleting block:', error);
      toast.error("Failed to delete block", {
        description: error.message
      });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await onDeleteLink(linkId);
      toast.success("Link deleted successfully");
    } catch (error: any) {
      console.error('Error deleting link:', error);
      toast.error("Failed to delete link", {
        description: error.message
      });
    }
  };

  if (!blocks?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h3 className="text-lg font-semibold mb-2">No Blocks Yet</h3>
        <p className="text-muted-foreground mb-6">Create your first block to start organizing your links.</p>
        <Button 
          onClick={() => setIsAddBlockOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Block
        </Button>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="space-y-6">
          <SortableContext
            items={blocks.map(block => block.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onAddLink={() => {
                  setSelectedBlockId(block.id);
                  setIsAddLinkOpen(true);
                }}
                onEditBlock={() => {
                  setSelectedBlockId(block.id);
                  setIsEditBlockOpen(true);
                }}
                onDeleteBlock={() => handleDeleteBlock(block.id)}
                onEditLink={(linkId) => {
                  setSelectedBlockId(block.id);
                  setSelectedLinkId(linkId);
                  setIsEditLinkOpen(true);
                }}
                onDeleteLink={(linkId) => handleDeleteLink(linkId)}
              >
                <SortableContext
                  items={block.links.map(link => link.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {block.links.map((link) => (
                    <SortableLink
                      key={link.id}
                      link={link}
                      onDelete={() => handleDeleteLink(link.id)}
                      onEdit={() => {
                        setSelectedBlockId(block.id);
                        setSelectedLinkId(link.id);
                        setIsEditLinkOpen(true);
                      }}
                    />
                  ))}
                </SortableContext>
              </SortableBlock>
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <EditBlockDialog
        isOpen={isAddBlockOpen}
        onOpenChange={setIsAddBlockOpen}
        onSubmit={handleAddBlock}
      />

      {selectedBlockId && (
        <>
          <EditBlockDialog
            isOpen={isEditBlockOpen}
            onOpenChange={setIsEditBlockOpen}
            onSubmit={(title: string) => handleEditBlock(selectedBlockId, title)}
            defaultValues={blocks.find(b => b.id === selectedBlockId)}
          />

          <EditLinkDialog
            isOpen={isAddLinkOpen}
            onOpenChange={setIsAddLinkOpen}
            onSubmit={(data: LinkFormData) => handleAddLink(selectedBlockId, data)}
          />

          {selectedLinkId && (
            <EditLinkDialog
              isOpen={isEditLinkOpen}
              onOpenChange={setIsEditLinkOpen}
              onSubmit={(data: LinkFormData) => handleEditLink(selectedLinkId, selectedBlockId, data)}
              defaultValues={blocks
                .find(b => b.id === selectedBlockId)
                ?.links.find(l => l.id === selectedLinkId)
              }
            />
          )}
        </>
      )}
    </>
  );
} 