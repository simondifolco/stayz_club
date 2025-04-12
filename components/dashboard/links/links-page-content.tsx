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
import { Block, BlockItem, HotelItem, LinkType, EditBlockDialogProps, EditLinkDialogProps } from "./types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SortableBlock } from "./sortable-block";
import { useHotelItems } from "@/hooks/use-hotel-items";
import { useHotel } from "@/contexts/hotel-context";
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

export function LinksPageContent() {
  const { selectedHotel } = useHotel();
  const { blocks, loading, error, addBlock, addLink, deleteBlock, deleteLink, editBlock, editLink, updateSortOrder } = useHotelItems();

  // Dialog states
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
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

    if (!over || !selectedHotel) return;

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
          const blockItems: HotelItem[] = newBlocks.map((block, index) => ({
            id: block.id,
            hotel_id: selectedHotel.id.toString(),
            title: block.title,
            description: block.description,
            item_type: 'block',
            is_active: block.is_active ?? true,
            sort_order: index,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          await updateSortOrder(blockItems);
        } else {
          // Handle link dragging
          const parentBlock = blocks.find((block) => 
            block.links.some((link) => link.id === active.id)
          );
          
          if (parentBlock) {
            const oldIndex = parentBlock.links.findIndex((link) => link.id === active.id);
            const newIndex = parentBlock.links.findIndex((link) => link.id === over.id);
            const newLinks = arrayMove(parentBlock.links, oldIndex, newIndex);

            // Create items array for all links in the block with updated sort orders
            const linkItems: HotelItem[] = newLinks.map((link, index) => ({
              id: link.id,
              hotel_id: selectedHotel.id.toString(),
              parent_id: parentBlock.id,
              title: link.title,
              description: link.description,
              item_type: 'link',
              link_type: link.type,
              url: link.type === 'external' ? link.url : null,
              pdf_url: link.type === 'pdf' ? link.pdfUrl : null,
              is_active: link.is_active ?? true,
              sort_order: index,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }));

            await updateSortOrder(linkItems);
          }
        }
      }
    } catch (error) {
      console.error('Error updating sort order:', error);
      toast.error('Failed to update order');
    }
  }, [blocks, selectedHotel, updateSortOrder]);

  const handleAddBlock = async (title: string) => {
    try {
      await addBlock(title);
      setIsAddBlockOpen(false);
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
      await editBlock(blockId, title);
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
      await addLink(
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
      await editLink(
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
      await deleteBlock(blockId);
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
      await deleteLink(linkId);
      toast.success("Link deleted successfully");
    } catch (error: any) {
      console.error('Error deleting link:', error);
      toast.error("Failed to delete link", {
        description: error.message
      });
    }
  };

  if (!selectedHotel) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h3 className="text-lg font-semibold mb-2">No Hotel Selected</h3>
        <p className="text-muted-foreground">Please select a hotel to manage its links.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
              <div className="space-y-2">
              {[1, 2].map((j) => (
                  <div key={j} className="h-12 bg-muted rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Links</h3>
        <p className="text-muted-foreground">{error.message}</p>
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