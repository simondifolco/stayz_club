"use client";

import { useState, useEffect } from "react";
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
import { Block, Link, LinkType, ModuleType } from "./types";
import { SortableBlock } from "./sortable-block";
import { AddBlockDialog } from "./add-block-dialog";

interface LinksPageContentProps {
  onBlocksChange: (blocks: Block[]) => void;
}

export function LinksPageContent({ onBlocksChange }: LinksPageContentProps) {
  const [mounted, setMounted] = useState(false);
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
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Call onBlocksChange whenever blocks change
  useEffect(() => {
    onBlocksChange(blocks);
  }, [blocks, onBlocksChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 50,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleAddLink = (blockId: number, name: string, type: LinkType, url?: string, pdfFile?: File, moduleType?: ModuleType) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newLink: Link = {
          id: Math.max(0, ...block.links.map(l => l.id)) + 1,
          name,
          status: 'active',
          type,
          url,
          pdfFile,
          moduleType
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

  const handleEditLink = (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType, url?: string, pdfFile?: File, moduleType?: ModuleType) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        // If we're just toggling status (same block), update the link in place
        if (blockId === targetBlockId) {
          return {
            ...block,
            links: block.links.map(link => 
              link.id === linkId 
                ? { ...link, name, status, type, url, pdfFile, moduleType }
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
          const updatedLink = { ...linkToMove, name, status, type, url, pdfFile, moduleType };
          return {
            ...block,
            links: [...block.links, updatedLink]
          };
        }
      }
      return block;
    }));
  };

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border p-6 space-y-4">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-muted rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext
          items={blocks.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
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
        </SortableContext>
      </DndContext>
      <AddBlockDialog onAdd={handleAddBlock} />
    </div>
  );
} 