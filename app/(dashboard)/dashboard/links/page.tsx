"use client";

import { Button } from "@/components/ui/button";
import { Plus, Twitter, Github, MoreVertical, Pencil, ExternalLink, FileText, Blocks } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface Link {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  type: LinkType;
  url?: string; // For external links
  pdfFile?: File; // For PDF documents
  moduleId?: string; // For module selection
}

type LinkType = 'external' | 'pdf' | 'module';

type Module = {
  id: string;
  name: string;
  description: string;
};

// Available modules for selection
const AVAILABLE_MODULES: Module[] = [
  { id: 'spa', name: 'Spa Booking', description: 'Spa and wellness booking' },
  { id: 'restaurant', name: 'Restaurant', description: 'Restaurant reservations' },
  { id: 'concierge', name: 'Concierge', description: 'Concierge services' },
];

interface Block {
  id: number;
  name: string;
  isEnabled: boolean;
  links: Link[];
}

// Update initial mock data
const blocks: Block[] = [
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
];

function AddBlockDialog({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name);
      setName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Block
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Block</DialogTitle>
          <DialogDescription>
            Create a new block to organize your links.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter block name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!name.trim()}>
            Add Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddLinkDialog({ blockId, onAdd, blockName }: { 
  blockId: number; 
  blockName: string;
  onAdd: (blockId: number, name: string, type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<LinkType>("external");
  const [url, setUrl] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | undefined>();
  const [moduleId, setModuleId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(blockId, name, type, url, pdfFile, moduleId);
      setName("");
      setUrl("");
      setPdfFile(undefined);
      setModuleId("");
      setOpen(false);
    }
  };

  const isValid = () => {
    if (!name.trim()) return false;
    switch (type) {
      case 'external':
        return !!url.trim();
      case 'pdf':
        return !!pdfFile;
      case 'module':
        return !!moduleId;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link to {blockName}</DialogTitle>
          <DialogDescription>
            Choose the type of link you want to add. Modules are interactive components, external links point to other websites, and PDFs are downloadable documents.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter link name"
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <LinkTypeSelector value={type} onValueChange={setType} />
          </div>
          {type === 'external' && (
            <ExternalLinkInput value={url} onChange={setUrl} />
          )}
          {type === 'pdf' && (
            <PdfUploadInput onChange={setPdfFile} />
          )}
          {type === 'module' && (
            <ModuleSelector value={moduleId} onChange={setModuleId} />
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!isValid()}>
            Add Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditBlockDialog({ block, onEdit, onDelete }: { 
  block: Block; 
  onEdit: (id: number, name: string) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(block.name);
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    if (name.trim()) {
      onEdit(block.id, name);
      setOpen(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Edit Block
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Block</DialogTitle>
          <DialogDescription>
            Change the block name or delete the block.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter block name"
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            Delete Block
          </Button>
          <Button onClick={handleEdit} disabled={!name.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditLinkDialog({ 
  link, 
  blockId, 
  blocks,
  onEdit,
  onDelete
}: { 
  link: Link; 
  blockId: number;
  blocks: Block[];
  onEdit: (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(link.name);
  const [selectedBlockId, setSelectedBlockId] = useState(blockId.toString());
  const [type, setType] = useState<LinkType>(link.type);
  const [url, setUrl] = useState<string>(link.url || "");
  const [pdfFile, setPdfFile] = useState<File | undefined>(link.pdfFile);
  const [moduleId, setModuleId] = useState<string>(link.moduleId || "");
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    if (name.trim()) {
      onEdit(blockId, parseInt(selectedBlockId), link.id, name, link.status, type, url, pdfFile, moduleId);
      setOpen(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  const isValid = () => {
    if (!name.trim()) return false;
    switch (type) {
      case 'external':
        return !!url.trim();
      case 'pdf':
        return !!pdfFile;
      case 'module':
        return !!moduleId;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Choose the type of link. Modules are interactive components, external links point to other websites, and PDFs are downloadable documents.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter link name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="block">Block</Label>
            <Select value={selectedBlockId} onValueChange={setSelectedBlockId}>
              <SelectTrigger>
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                {blocks.map(block => (
                  <SelectItem key={block.id} value={block.id.toString()}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <LinkTypeSelector value={type} onValueChange={setType} />
          </div>
          {type === 'external' && (
            <ExternalLinkInput value={url} onChange={setUrl} />
          )}
          {type === 'pdf' && (
            <PdfUploadInput onChange={setPdfFile} />
          )}
          {type === 'module' && (
            <ModuleSelector value={moduleId} onChange={setModuleId} />
          )}
        </div>
        <DialogFooter className="flex items-center justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            Delete Link
          </Button>
          <Button onClick={handleEdit} disabled={!isValid()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SortableLink({ link, blockId, blocks, onDelete, onEdit }: { 
  link: Link; 
  blockId: number;
  blocks: Block[];
  onDelete: () => void;
  onEdit: (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `link-${blockId}-${link.id}`,
    data: {
      type: 'link',
      link,
      blockId,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-md border mb-2 bg-background
        ${isDragging ? 'shadow-lg border-border' : 'border-transparent'} 
        ${link.status === 'inactive' ? 'opacity-60 bg-muted/50' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <DragHandleDots2Icon 
          className="h-4 w-4 text-muted-foreground cursor-move flex-shrink-0" 
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

function SortableBlock({ 
  block,
  blocks, 
  onAddLink, 
  onDeleteBlock, 
  onDeleteLink,
  onEditBlock,
  onEditLink
}: { 
  block: Block;
  blocks: Block[];
  onAddLink: (blockId: number, name: string, type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => void;
  onDeleteBlock: () => void;
  onDeleteLink: (linkId: number) => void;
  onEditBlock: (id: number, name: string) => void;
  onEditLink: (blockId: number, targetBlockId: number, linkId: number, name: string, status: Link['status'], type: LinkType, url?: string, pdfFile?: File, moduleId?: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: block.id,
    data: {
      type: 'block',
      block,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`mb-6 ${isDragging ? 'shadow-lg' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2" {...attributes} {...listeners}>
          <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground cursor-move" />
          <CardTitle className="text-base font-medium">{block.name}</CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <AddLinkDialog blockId={block.id} blockName={block.name} onAdd={(blockId, name, type, url, pdfFile, moduleId) => onAddLink(blockId, name, type, url, pdfFile, moduleId)} />
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

function PhonePreview({ blocks }: { blocks: Block[] }) {
  return (
    <div className="w-[320px] h-[640px] bg-black rounded-[2.5rem] shadow-xl border border-white/10 fixed top-6 right-6 overflow-hidden">
      <div className="absolute inset-[2px] rounded-[2.4rem] overflow-hidden bg-background">
        {/* Status Bar */}
        <div className="relative w-full h-7 bg-background px-4 flex items-center justify-between z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-muted rounded-b-[1rem] flex items-center justify-center">
            <div className="w-[8px] h-[8px] bg-foreground/80 rounded-full absolute right-4" />
          </div>
        </div>

        {/* App Content */}
        <div className="relative h-[calc(100%-27px)] w-full overflow-y-auto">
          {/* Profile Content */}
          <div className="flex flex-col items-center pt-8 px-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden">
              <div className="w-full h-full bg-muted-foreground/5" />
            </div>
            
            {/* Profile Name */}
            <h3 className="mt-4 text-xl font-semibold text-foreground">@villa-bakara</h3>
            <p className="text-sm text-muted-foreground mt-1">Villa Bakara</p>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Twitter className="w-5 h-5 text-foreground/80" />
              </div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Github className="w-5 h-5 text-foreground/80" />
              </div>
            </div>

            {/* Blocks */}
            {blocks.map((block) => (
              <div key={block.id} className="w-full mt-8">
                <h4 className="text-sm font-medium mb-3 px-2 text-muted-foreground">{block.name}</h4>
                <div className="space-y-3">
                  {block.links.filter(link => link.status === "active").map((link) => (
                    <div
                      key={link.id}
                      className="w-full h-12 bg-muted rounded-xl flex items-center px-4 relative hover:bg-accent transition-colors cursor-pointer"
                    >
                      <span className="text-foreground">{link.name}</span>
                      <MoreVertical className="w-5 h-5 text-muted-foreground absolute right-3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[5px] flex items-center justify-center pb-1">
          <div className="w-[134px] h-1 bg-muted-foreground/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Move LinksPageContent outside of dynamic import
function LinksPageContent() {
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
    useSensor(PointerSensor),
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

    // Handle block reordering
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
    <div className="flex gap-6">
      <div className="flex-1 max-w-[calc(100%-352px)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
          <AddBlockDialog onAdd={handleAddBlock} />
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
        <div className="space-y-4">
          {blocks.map((block) => (
                <SortableBlock 
                  key={block.id} 
                  block={block}
                  blocks={blocks}
                  onAddLink={(blockId, name, type, url, pdfFile, moduleId) => handleAddLink(blockId, name, type, url, pdfFile, moduleId)}
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
      <PhonePreview blocks={blocks} />
    </div>
  );
}

// Create the dynamic component with proper type annotations
const DynamicLinksPageContent = dynamic<Record<string, never>>(() => 
  Promise.resolve(LinksPageContent), 
  { ssr: false }
);

// Main component that renders the client-only content
export default function LinksPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <DynamicLinksPageContent />
    </Suspense>
  );
}

function LinkTypeSelector({ value, onValueChange }: { 
  value: LinkType; 
  onValueChange: (value: LinkType) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(newValue: string) => onValueChange(newValue as LinkType)}
      className="grid grid-cols-3 gap-4"
    >
      <div>
        <RadioGroupItem
          value="external"
          id="external"
          className="peer sr-only"
        />
        <label
          htmlFor="external"
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
            value === "external" && "border-primary"
          )}
        >
          <ExternalLink className="mb-2 h-6 w-6" />
          <span className="text-sm font-medium">External Link</span>
        </label>
      </div>
      <div>
        <RadioGroupItem
          value="pdf"
          id="pdf"
          className="peer sr-only"
        />
        <label
          htmlFor="pdf"
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
            value === "pdf" && "border-primary"
          )}
        >
          <FileText className="mb-2 h-6 w-6" />
          <span className="text-sm font-medium">PDF Document</span>
        </label>
      </div>
      <div>
        <RadioGroupItem
          value="module"
          id="module"
          className="peer sr-only"
        />
        <label
          htmlFor="module"
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
            value === "module" && "border-primary"
          )}
        >
          <Blocks className="mb-2 h-6 w-6" />
          <span className="text-sm font-medium">Interactive Module</span>
        </label>
      </div>
    </RadioGroup>
  );
}

function ExternalLinkInput({ value, onChange }: { 
  value?: string; 
  onChange: (url: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="url">URL</Label>
      <Input
        id="url"
        type="url"
        placeholder="https://example.com"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function PdfUploadInput({ onChange }: { 
  onChange: (file: File) => void;
}) {
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

function ModuleSelector({ value, onChange }: { 
  value?: string; 
  onChange: (moduleId: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="module">Select Module</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a module" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_MODULES.map((module) => (
            <SelectItem key={module.id} value={module.id}>
              <div className="flex flex-col">
                <span>{module.name}</span>
                <span className="text-xs text-muted-foreground">
                  {module.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 