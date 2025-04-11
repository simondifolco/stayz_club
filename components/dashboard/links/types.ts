export type LinkType = 'external' | 'pdf';
export type ItemType = 'block' | 'link';
export type ModuleType = 'activities' | 'wellness' | 'dining' | 'tickets' | 'rentals' | 'transfers';

export interface HotelItem {
  id: string;
  hotel_id: string;
  parent_id?: string;
  title: string;
  description?: string;
  item_type: 'block' | 'link';
  link_type?: LinkType;
  url?: string | null;
  pdf_url?: string | null;
  is_active: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

// UI Types
export interface Link {
  id: string;
  title: string;
  type: LinkType;
  url?: string;
  pdfUrl?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface Block {
  id: string;
  title: string;
  is_active?: boolean;
  sort_order?: number;
  links: Link[];
}

export interface BlockItem {
  id: string;
  title: string;
  description?: string;
  is_active?: boolean;
}

export interface EditBlockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string) => void;
  defaultValues?: BlockItem;
}

export interface EditLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    type: LinkType;
    url?: string;
    pdfUrl?: string;
  }) => void;
  defaultValues?: Link;
} 