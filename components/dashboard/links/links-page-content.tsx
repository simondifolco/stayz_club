"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Block, Link, LinkType } from "./types";
import { SortableBlock } from "./sortable-block";
import { AddBlockDialog } from "./add-block-dialog";
import { PhonePreview } from "./phone-preview";
import { ThemeSettingsDialog } from "@/components/dashboard/theme-settings-dialog";

export function LinksPageContent() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 1,
      name: "Latest News",
      isEnabled: true,
      links: [
        {
          id: 1,
          name: "Summer Special Offers",
          status: "active",
          type: "external"
        },
        {
          id: 2,
          name: "Upcoming Events",
          status: "active",
          type: "external"
        }
      ]
    },
    {
      id: 2,
      name: "Restaurant Menus",
      isEnabled: true,
      links: [
        {
          id: 3,
          name: "Fine Dining Menu",
          status: "active",
          type: "pdf"
        },
        {
          id: 4,
          name: "Room Service Menu",
          status: "active",
          type: "pdf"
        },
        {
          id: 5,
          name: "Bar & Lounge Menu",
          status: "active",
          type: "pdf"
        }
      ]
    },
    {
      id: 3,
      name: "Modules",
      isEnabled: true,
      links: [
        {
          id: 6,
          name: "Spa Booking",
          status: "active",
          type: "module"
        },
        {
          id: 7,
          name: "Concierge Services",
          status: "active",
          type: "module"
        }
      ]
    }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced from 8px to 5px for quicker activation
        delay: 50, // Reduced from 100ms to 50ms for quicker response
        tolerance: 8, // Increased from 5px to 8px for better tolerance
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [previewOpen, setPreviewOpen] = useState(false);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current as { type: string; blockId?: number; link?: Link };
    const overData = over.data.current as { type: string; blockId?: number; link?: Link };

    if (!activeData || !overData) return;

    // Handle block reordering with animation
    if (activeData.type === 'block' && overData.type === 'block') {
      if (active.id !== over.id) {
        setBlocks((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }

    // Handle link reordering within a block
    if (activeData.type === 'link' && overData.type === 'link') {
      const sourceBlockId = activeData.blockId;
      const targetBlockId = overData.blockId;
      
      if (sourceBlockId === targetBlockId) {
        setBlocks((items) => {
          return items.map((block) => {
            if (block.id === sourceBlockId) {
              const oldIndex = block.links.findIndex(
                (link) => link.id === (activeData.link as Link).id
              );
              const newIndex = block.links.findIndex(
                (link) => link.id === (overData.link as Link).id
              );
              return {
                ...block,
                links: arrayMove(block.links, oldIndex, newIndex),
              };
            }
            return block;
          });
        });
      }
    }
  }

  const handleAddBlock = (name: string) => {
    const newBlock: Block = {
      id: Math.max(0, ...blocks.map(b => b.id)) + 1,
      name,
      isEnabled: true,
      links: [],
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleAddLink = (blockId: number, name: string, type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newLink: Link = {
          id: Math.max(0, ...block.links.map(l => l.id)) + 1,
          name,
          status: 'active',
          type,
          url,
          pdfFile,
          moduleId
        };
        return {
          ...block,
          links: [...block.links, newLink],
        };
      }
      return block;
    }));
  };

  const handleDeleteBlock = (blockId: number) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleDeleteLink = (blockId: number, linkId: number) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          links: block.links.filter(link => link.id !== linkId),
        };
      }
      return block;
    }));
  };

  const handleEditBlock = (id: number, name: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, name } : block
    ));
  };

  const handleEditLink = (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        // If we're just toggling status (same block), update the link in place
        if (blockId === targetBlockId) {
          return {
            ...block,
            links: block.links.map(link => 
              link.id === linkId 
                ? { ...link, name, status, type, url, pdfFile, moduleId }
                : link
            )
          };
        }
        // If moving to different block, remove from current block
        return {
          ...block,
          links: block.links.filter(link => link.id !== linkId)
        };
      }
      // If moving to different block, add to target block
      if (block.id === targetBlockId && blockId !== targetBlockId) {
        const linkToMove = blocks
          .find(b => b.id === blockId)
          ?.links.find(l => l.id === linkId);
        
        if (linkToMove) {
          const updatedLink = { ...linkToMove, name, status, type, url, pdfFile, moduleId };
          return {
            ...block,
            links: [...block.links, updatedLink]
          };
        }
      }
      return block;
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col xl:flex-row gap-6 relative">
        <div className="flex-1 w-full xl:max-w-[calc(100%-352px)]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Links</h1>
            <div className="flex items-center gap-2">
              <ThemeSettingsDialog />
              <AddBlockDialog onAdd={handleAddBlock} />
            </div>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[
              restrictToVerticalAxis,
              restrictToWindowEdges,
            ]}
          >
            <SortableContext
              items={blocks.map((block) => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 mb-6 xl:mb-0">
                {blocks.map((block) => (
                  <SortableBlock 
                    key={block.id} 
                    block={block}
                    blocks={blocks}
                    onAddLink={handleAddLink}
                    onDeleteBlock={() => handleDeleteBlock(block.id)}
                    onDeleteLink={(linkId) => handleDeleteLink(block.id, linkId)}
                    onEditBlock={handleEditBlock}
                    onEditLink={handleEditLink}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <div className="hidden mt-10 xl:block">
          <PhonePreview blocks={blocks} />
        </div>
        <div className="fixed bottom-6 inset-x-0 flex justify-center">
          <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full shadow-lg bg-background xl:hidden px-6"
              >
                Preview
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-screen p-0">
              <VisuallyHidden asChild>
                <SheetTitle>Mobile Preview</SheetTitle>
              </VisuallyHidden>
              <div className="h-full overflow-y-auto flex items-center justify-center py-6">
                <PhonePreview blocks={blocks} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
} 