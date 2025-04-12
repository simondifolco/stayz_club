import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Block } from "@/components/dashboard/links/types";
import { createClient } from "@/utils/supabase/server";
import { Bell, Calendar, Mail, Share2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CornerActions } from "./components/actions";

interface LinkPageProps {
  params: {
    id: string; // This is the hotel slug
  };
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
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    buttonStyle?: 'minimal' | 'outline' | 'solid' | 'soft';
    font?: 'geist' | 'inter' | 'manrope' | 'montserrat';
    showLogo?: boolean;
    bookingUrl?: string;
    contactEmail?: string;
  };
}

async function getLinkData(slug: string) {
  const supabase = await createClient();

  // First, get only the necessary public hotel data
  const { data: hotel, error: hotelError } = await supabase
    .from('hotels')
    .select(`
      id,
      name,
      slug,
      description,
      logo_url,
      theme,
      is_active
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (hotelError || !hotel) {
    console.error('Error fetching hotel:', hotelError);
    return notFound();
  }

  // Security check: Verify the hotel is active
  if (!hotel.is_active) {
    return notFound();
  }

  // Then, get only necessary public hotel items data
  const { data: items, error: itemsError } = await supabase
    .from('hotel_items')
    .select(`
      id,
      title,
      description,
      item_type,
      link_type,
      url,
      pdf_url,
      is_active,
      sort_order,
      parent_id
    `)
    .eq('hotel_id', hotel.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (itemsError) {
    console.error('Error fetching hotel items:', itemsError);
    return notFound();
  }

  // Transform items into blocks structure
  const blockItems = (items as HotelItem[] || [])
    .filter(item => item.item_type === 'block' && item.is_active);
  const linkItems = (items as HotelItem[] || [])
    .filter(item => item.item_type === 'link' && item.is_active);

  // Only return necessary public data
  const blocks: Block[] = blockItems.map(block => ({
    id: block.id,
    title: block.title,
    description: block.description,
    is_active: block.is_active,
    sort_order: block.sort_order,
    links: linkItems
      .filter(link => link.parent_id === block.id)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map(link => ({
        id: link.id,
        title: link.title,
        description: link.description || '',
        type: link.link_type as "external" | "pdf",
        url: link.url || undefined,
        pdfUrl: link.pdf_url || undefined,
        is_active: link.is_active,
        sort_order: link.sort_order
      }))
  })).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Only return necessary public hotel data
  return {
    blocks,
    hotel: {
      id: hotel.id,
      name: hotel.name,
      logo_url: hotel.logo_url,
      description: hotel.description,
      theme: {
        primaryColor: hotel.theme?.primaryColor,
        secondaryColor: hotel.theme?.secondaryColor,
        backgroundColor: hotel.theme?.backgroundColor,
        buttonStyle: hotel.theme?.buttonStyle,
        font: hotel.theme?.font,
        showLogo: hotel.theme?.showLogo,
        bookingUrl: hotel.theme?.bookingUrl,
        contactEmail: hotel.theme?.contactEmail,
      }
    }
  };
}

export async function generateMetadata(
  props: { params: { id: string } }
): Promise<Metadata> {
  const params = await props.params;
  const data = await getLinkData(params.id);

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

// Add security headers
export const headers = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export default async function LinkPage(
  props: { params: { id: string } }
) {
  const params = await props.params;
  const data = await getLinkData(params.id);
  const theme = data.hotel.theme;

  const containerClassName = cn(
    "w-full h-full overflow-y-auto",
    {
      'font-geist': theme?.font === 'geist',
      'font-inter': theme?.font === 'inter',
      'font-manrope': theme?.font === 'manrope',
      'font-montserrat': theme?.font === 'montserrat',
    }
  );

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: theme?.backgroundColor || '#FFFFFF' }}>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        {/* Corner Actions */}
        <div className="fixed top-8 left-8 right-8 flex justify-between z-50">
          <CornerActions 
            data={{
              username: data.hotel.name.toLowerCase().replace(/\s+/g, ''),
              hotelName: data.hotel.name,
              logo: data.hotel.logo_url || '',
              hotelId: data.hotel.id,
              theme: {
                buttonStyle: theme?.buttonStyle,
                primaryColor: theme?.primaryColor,
                secondaryColor: theme?.secondaryColor,
              },
            }} 
          />
        </div>

        <div className={cn("mx-auto max-w-[420px] lg:max-w-[375px]", containerClassName)}>
          <div className="px-4 py-8 mt-16 sm:mt-20">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8">
              {theme?.showLogo && (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-border">
                  {data.hotel.logo_url ? (
                    <Image 
                      src={data.hotel.logo_url} 
                      alt={data.hotel.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground">Logo</span>
                    </div>
                  )}
                </div>
              )}
              <h1 className="text-xl font-semibold mb-1" style={{ color: theme?.primaryColor }}>
                @{data.hotel.name.toLowerCase().replace(/\s+/g, '')}
              </h1>
              {data.hotel.description && (
                <p className="text-[15px] text-muted-foreground mb-6 text-center max-w-[280px]">
                  {data.hotel.description}
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
                      borderColor: theme?.buttonStyle === 'outline' ? theme.primaryColor : 'transparent',
                      color: theme?.buttonStyle === 'solid' ? theme.secondaryColor : theme.primaryColor
                    }}
                  >
                    <Calendar className="h-6 w-6" />
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
                      borderColor: theme?.buttonStyle === 'outline' ? theme.primaryColor : 'transparent',
                      color: theme?.buttonStyle === 'solid' ? theme.secondaryColor : theme.primaryColor
                    }}
                  >
                    <Mail className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-6">
              {data.blocks.map((block) => (
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
                        borderColor: theme?.buttonStyle === 'outline' ? theme.primaryColor : 'transparent'
                      }}
                    >
                      <h3 className="font-medium text-[17px] text-center" style={{ 
                        color: theme?.buttonStyle === 'solid' ? theme.secondaryColor : theme.primaryColor
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
                Powered by <span className="text-3xl font-geist bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary transition-colors uppercase tracking-tighter font-black">stayz<span className="font-extralight lowercase">.club</span></span>
              </p>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
} 