import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Calendar, Mail } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

// Remove dynamic config since we want to use static params
export const runtime = 'edge';

interface PageProps {
  params: Promise<{
    id: string; // This is the hotel slug
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface HotelItem {
  id: string;
  hotel_id: string;
  parent_id?: string;
  title: string;
  description?: string;
  item_type: 'block' | 'link';
  link_type?: 'external' | 'pdf';
  url?: string | null;
  pdf_url?: string | null;
  is_active: boolean;
  sort_order?: number;
}

interface Hotel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    darkMode: boolean;
    showLogo: boolean;
    buttonStyle: "minimal" | "outline" | "solid" | "soft";
    font: "geist" | "inter" | "manrope" | "montserrat";
    bookingUrl?: string;
    contactEmail?: string;
  };
}

interface HotelBlock {
  id: string;
  hotel_id: string;
  title: string;
  description?: string;
  is_active: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

interface HotelLink {
  id: string;
  hotel_id: string;
  block_id: string;
  title: string;
  description?: string;
  link_type: 'external' | 'pdf';
  url?: string | null;
  pdf_url?: string | null;
  is_active: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

interface Link {
  id: string;
  title: string;
  description?: string;
  type: 'external' | 'pdf';
  url?: string;
  pdfUrl?: string;
  is_active: boolean;
  sort_order?: number;
}

interface Block {
  id: string;
  title: string;
  description?: string;
  is_active: boolean;
  sort_order?: number;
  links: Link[];
}

async function getLinkData(slug: string) {
  const supabase = await createClient();

  try {
    // Get the full hotel data
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (hotelError) {
      console.error('Error fetching hotel data:', hotelError);
      return null;
    }

    if (!hotel) {
      console.error('No hotel found with slug:', slug);
      return null;
    }

    // Fetch blocks and links in parallel
    const [blocksResult, linksResult] = await Promise.all([
      supabase
        .from('hotel_blocks')
        .select('*')
        .eq('hotel_id', hotel.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('hotel_links')
        .select('*')
        .eq('hotel_id', hotel.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
    ]);

    if (blocksResult.error) {
      console.error('Error fetching blocks:', blocksResult.error);
      return null;
    }
    if (linksResult.error) {
      console.error('Error fetching links:', linksResult.error);
      return null;
    }

    const blocks = blocksResult.data || [];
    const links = linksResult.data || [];

    // Transform the data
    const transformedBlocks = blocks.map((block: HotelBlock) => ({
      id: block.id,
      title: block.title,
      description: block.description,
      is_active: block.is_active,
      sort_order: block.sort_order,
      links: links
        .filter((link: HotelLink) => link.block_id === block.id)
        .map((link: HotelLink) => ({
          id: link.id,
          title: link.title,
          description: link.description,
          type: link.link_type as 'external' | 'pdf',
          url: link.url || undefined,
          pdfUrl: link.pdf_url || undefined,
          is_active: link.is_active,
          sort_order: link.sort_order
        }))
    }));

    return {
      hotel: {
        ...hotel,
        theme: hotel.theme || {
          primaryColor: '#000000',
          secondaryColor: '#ffffff',
          backgroundColor: '#ffffff',
          buttonStyle: 'minimal',
          font: 'geist',
          showLogo: true
        }
      },
      blocks: transformedBlocks
    };
  } catch (error) {
    console.error('Error fetching link data:', error);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const data = await getLinkData(resolvedParams.id);

  if (!data) {
    return {
      title: 'Not Found',
      description: 'The requested hotel links page could not be found.'
    };
  }

  const { hotel } = data;

  return {
    title: `${hotel.name} - Official Links`,
    description: hotel.description || `View ${hotel.name}'s official links and resources`,
    openGraph: {
      title: `${hotel.name} - Official Links`,
      description: hotel.description || `View ${hotel.name}'s official links and resources`,
      images: hotel.logo_url ? [{ url: hotel.logo_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hotel.name} - Official Links`,
      description: hotel.description || `View ${hotel.name}'s official links and resources`,
      images: hotel.logo_url ? [hotel.logo_url] : [],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
      },
    },
    alternates: {
      canonical: 'https://stayz.club/links',
    },
  };
}

export default async function LinksPage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const data = await getLinkData(resolvedParams.id);

  if (!data) {
    notFound();
  }

  const { hotel, blocks } = data;
  const theme = hotel.theme;

  const containerStyle = {
    "--theme-primary": theme?.primaryColor || "#000000",
    "--theme-secondary": theme?.secondaryColor || "#ffffff",
    backgroundColor: theme?.backgroundColor || "#fafafa",
  } as React.CSSProperties;

  const containerClassName = cn(
    "min-h-screen",
    {
      'font-geist': theme?.font === 'geist',
      'font-inter': theme?.font === 'inter',
      'font-manrope': theme?.font === 'manrope',
      'font-montserrat': theme?.font === 'montserrat',
    }
  );

  return (
    <main className={containerClassName} style={containerStyle}>
      <div className="container max-w-[600px] mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          {theme?.showLogo && hotel.logo_url && (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-border">
              <Image 
                src={hotel.logo_url} 
                alt={hotel.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--theme-primary)' }}>
            @{hotel.name?.toLowerCase().replace(/\s+/g, '')}
          </h1>
          {hotel.description && (
            <p className="text-[15px] text-muted-foreground mb-6 text-center max-w-[280px]">
              {hotel.description}
            </p>
          )}

          {/* Primary Actions */}
          <div className="flex justify-center gap-6 w-full">
            {theme?.bookingUrl && (
              <a 
                href={theme.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-[64px] h-[64px] flex items-center justify-center rounded-full transition-all duration-200 border-2",
                  {
                    'bg-transparent hover:bg-primary/10 border-transparent': theme?.buttonStyle === 'minimal',
                    'bg-transparent': theme?.buttonStyle === 'outline',
                    'bg-primary text-primary-foreground hover:opacity-90 border-transparent': theme?.buttonStyle === 'solid',
                    'bg-primary/10 hover:bg-primary/20 border-transparent': theme?.buttonStyle === 'soft',
                    'bg-white hover:bg-black/5 border-transparent': !theme?.buttonStyle
                  }
                )}
                style={{ 
                  borderColor: theme?.buttonStyle === 'outline' ? 'var(--theme-primary)' : 'transparent'
                }}
              >
                <Calendar className="h-6 w-6" style={{ color: theme?.buttonStyle === 'solid' ? 'var(--theme-secondary)' : 'var(--theme-primary)' }} />
              </a>
            )}
            {theme?.contactEmail && (
              <a 
                href={`mailto:${theme.contactEmail}`}
                className={cn(
                  "w-[64px] h-[64px] flex items-center justify-center rounded-full transition-all duration-200 border-2",
                  {
                    'bg-transparent hover:bg-primary/10 border-transparent': theme?.buttonStyle === 'minimal',
                    'bg-transparent': theme?.buttonStyle === 'outline',
                    'bg-primary text-primary-foreground hover:opacity-90 border-transparent': theme?.buttonStyle === 'solid',
                    'bg-primary/10 hover:bg-primary/20 border-transparent': theme?.buttonStyle === 'soft',
                    'bg-white hover:bg-black/5 border-transparent': !theme?.buttonStyle
                  }
                )}
                style={{ 
                  borderColor: theme?.buttonStyle === 'outline' ? 'var(--theme-primary)' : 'transparent'
                }}
              >
                <Mail className="h-6 w-6" style={{ color: theme?.buttonStyle === 'solid' ? 'var(--theme-secondary)' : 'var(--theme-primary)' }} />
              </a>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-6">
          {blocks.map((block) => (
            <div key={block.id} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground px-1 text-center">{block.title}</h3>
              {block.links.map((link) => (
                <a
                  key={link.id}
                  href={link.type === 'external' ? link.url : link.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group block w-full p-4 rounded-2xl transition-all duration-200 border-2",
                    {
                      'bg-transparent hover:bg-primary/10 border-transparent': theme?.buttonStyle === 'minimal',
                      'bg-transparent': theme?.buttonStyle === 'outline',
                      'bg-primary text-primary-foreground hover:opacity-90 border-transparent': theme?.buttonStyle === 'solid',
                      'bg-primary/10 hover:bg-primary/20 border-transparent': theme?.buttonStyle === 'soft',
                      'bg-white hover:bg-black/5 border-transparent': !theme?.buttonStyle
                    }
                  )}
                  style={{ 
                    borderColor: theme?.buttonStyle === 'outline' ? 'var(--theme-primary)' : 'transparent'
                  }}
                >
                  <h3 className="font-medium text-[17px] text-center" style={{ 
                    color: theme?.buttonStyle === 'solid' ? 'var(--theme-secondary)' : 'var(--theme-primary)' 
                  }}>
                    {link.title}
                  </h3>
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Powered By */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="block mt-1 text-3xl font-geist bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary transition-colors uppercase tracking-tighter font-black">stayz<span className="font-extralight lowercase">.club</span></span>
          </p>
        </div>
      </div>
    </main>
  );
} 