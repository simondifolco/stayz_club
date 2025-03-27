export interface Link {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  type: LinkType;
  url?: string; // For external links
  pdfFile?: File; // For PDF documents
  moduleId?: string; // For module selection
}

export type LinkType = 'external' | 'pdf' | 'module';

export interface Module {
  id: string;
  name: string;
  description: string;
}

export interface Block {
  id: number;
  name: string;
  isEnabled: boolean;
  links: Link[];
}

// Available modules for selection
export const AVAILABLE_MODULES: Module[] = [
  {
    id: "activities",
    name: "Activities",
    description: "Experiences near destination",
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Spa, massage, and more",
  },
  {
    id: "dining",
    name: "Dining",
    description: "Dining, cooking classes, more",
  },
  {
    id: "tickets",
    name: "Tickets",
    description: "Museums, concerts, more",
  },
  {
    id: "rentals",
    name: "Rentals",
    description: "Rental equipment for leisure use",
  },
  {
    id: "transfers",
    name: "Transfers",
    description: "Transport to and from destinations",
  }
]; 