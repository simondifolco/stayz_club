export interface Link {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  type: LinkType;
  url?: string; // For external links
  pdfFile?: File; // For PDF documents
  moduleType?: ModuleType; // For module links
}

export type LinkType = 'external' | 'pdf' | 'module';

export type ModuleType = 'activities' | 'wellness' | 'dining' | 'tickets' | 'rentals' | 'transfers';

export interface Block {
  id: number;
  name: string;
  isEnabled: boolean;
  links: Link[];
} 