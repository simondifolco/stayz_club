export type LinkType = 'external' | 'pdf' | 'module';
export type ModuleType = 'activities' | 'wellness' | 'dining' | 'tickets' | 'rentals' | 'transfers';
export type LinkStatus = 'active' | 'inactive';

export interface Block {
  id: number;
  name: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

export interface Link {
  id: number;
  block_id: number;
  name: string;
  status: LinkStatus;
  type: LinkType;
  url?: string | null;
  pdf_url?: string | null;
  module_type?: ModuleType | null;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

export interface Database {
  blocks: Block[];
  links: Link[];
} 