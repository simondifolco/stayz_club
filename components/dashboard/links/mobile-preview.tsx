"use client";

import { memo, useEffect, useMemo } from "react";
import { useHotel } from "@/contexts/hotel-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Calendar, MessageSquare, Share2, ChevronRight, Smartphone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Block } from "./types";

interface PreviewContentProps {
  blocks?: Block[];
}

const PreviewContent = memo(function PreviewContent({ blocks = [] }: PreviewContentProps) {
  const { selectedHotel } = useHotel();
  const theme = selectedHotel?.theme;

  // Sort blocks and links - moved outside useEffect for better performance
  const sortedBlocks = useMemo(() => {
    return [...(blocks || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [blocks]);

  const blocksWithSortedLinks = useMemo(() => {
    return sortedBlocks.map(block => ({
      ...block,
      links: [...block.links].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    }));
  }, [sortedBlocks]);

  // Force re-render when any relevant prop changes
  useEffect(() => {
    // This empty effect ensures re-render on dependency changes
  }, [
    blocks, // Direct blocks dependency
    sortedBlocks,
    blocksWithSortedLinks,
    theme,
    selectedHotel?.id // Add hotel ID dependency
  ]);

  // Memoize the style object to prevent unnecessary re-renders
  const containerStyle = useMemo(() => ({
    "--theme-primary": theme?.primaryColor || "#000000",
    "--theme-secondary": theme?.secondaryColor || "#ffffff",
    backgroundColor: theme?.backgroundColor || "#fafafa",
  } as React.CSSProperties), [theme?.primaryColor, theme?.secondaryColor, theme?.backgroundColor]);

  // Memoize the container className
  const containerClassName = useMemo(() => cn(
    "w-full h-full overflow-y-auto",
    {
      'font-geist': theme?.font === 'geist',
      'font-inter': theme?.font === 'inter',
      'font-manrope': theme?.font === 'manrope',
      'font-montserrat': theme?.font === 'montserrat',
    }
  ), [theme?.font]);

  return (
    <div 
      className={containerClassName}
      style={containerStyle}
    >
      <div className="px-4 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <button className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 border-2",
            {
              // Minimal (ghost) style
              'bg-transparent hover:bg-primary/10 border-transparent': theme?.buttonStyle === 'minimal',
              // Outline style
              'bg-transparent': theme?.buttonStyle === 'outline',
              // Solid style
              'bg-primary text-primary-foreground hover:opacity-90 border-transparent': theme?.buttonStyle === 'solid',
              // Soft style
              'bg-primary/10 hover:bg-primary/20 border-transparent': theme?.buttonStyle === 'soft',
              // Default style
              'bg-white hover:bg-black/5 border-transparent': !theme?.buttonStyle
            }
          )}
          style={{ 
            borderColor: theme?.buttonStyle === 'outline' ? 'var(--theme-primary)' : 'transparent'
          }}>
            <Bell className="h-5 w-5" style={{ color: theme?.buttonStyle === 'solid' ? 'var(--theme-secondary)' : 'var(--theme-primary)' }} />
          </button>
          <button className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 border-2",
            {
              // Minimal (ghost) style
              'bg-transparent hover:bg-primary/10 border-transparent': theme?.buttonStyle === 'minimal',
              // Outline style
              'bg-transparent': theme?.buttonStyle === 'outline',
              // Solid style
              'bg-primary text-primary-foreground hover:opacity-90 border-transparent': theme?.buttonStyle === 'solid',
              // Soft style
              'bg-primary/10 hover:bg-primary/20 border-transparent': theme?.buttonStyle === 'soft',
              // Default style
              'bg-white hover:bg-black/5 border-transparent': !theme?.buttonStyle
            }
          )}
          style={{ 
            borderColor: theme?.buttonStyle === 'outline' ? 'var(--theme-primary)' : 'transparent'
          }}>
            <Share2 className="h-5 w-5" style={{ color: theme?.buttonStyle === 'solid' ? 'var(--theme-secondary)' : 'var(--theme-primary)' }} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          {theme?.showLogo && (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-border">
              {selectedHotel?.logo_url ? (
                <img 
                  src={selectedHotel.logo_url} 
                  alt={selectedHotel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-2xl text-muted-foreground">Logo</span>
                </div>
              )}
            </div>
          )}
          <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--theme-primary)' }}>
            @{selectedHotel?.name?.toLowerCase().replace(/\s+/g, '')}
          </h1>
          {selectedHotel?.description && (
            <p className="text-[15px] text-muted-foreground mb-6 text-center max-w-[280px]">
              {selectedHotel.description}
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
                    // Minimal (ghost) style
                    'bg-transparent hover:bg-primary/10 border-transparent': theme?.buttonStyle === 'minimal',
                    // Outline style
                    'bg-transparent': theme?.buttonStyle === 'outline',
                    // Solid style
                    'bg-primary text-primary-foreground hover:opacity-90 border-transparent': theme?.buttonStyle === 'solid',
                    // Soft style
                    'bg-primary/10 hover:bg-primary/20 border-transparent': theme?.buttonStyle === 'soft',
                    // Default style
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
                    // Minimal (ghost) style
                    'bg-transparent hover:bg-primary/10 border-transparent': theme?.buttonStyle === 'minimal',
                    // Outline style
                    'bg-transparent': theme?.buttonStyle === 'outline',
                    // Solid style
                    'bg-primary text-primary-foreground hover:opacity-90 border-transparent': theme?.buttonStyle === 'solid',
                    // Soft style
                    'bg-primary/10 hover:bg-primary/20 border-transparent': theme?.buttonStyle === 'soft',
                    // Default style
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
          {blocksWithSortedLinks.map((block) => (
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
                      // Minimal (ghost) style
                      'bg-transparent hover:bg-primary/10 border-transparent': theme?.buttonStyle === 'minimal',
                      // Outline style
                      'bg-transparent': theme?.buttonStyle === 'outline',
                      // Solid style
                      'bg-primary text-primary-foreground hover:opacity-90 border-transparent': theme?.buttonStyle === 'solid',
                      // Soft style
                      'bg-primary/10 hover:bg-primary/20 border-transparent': theme?.buttonStyle === 'soft',
                      // Default style
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
            Powered by <span className="text-3xl font-geist bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary transition-colors uppercase tracking-tighter font-black">stayz<span className="font-extralight lowercase">.club</span></span>
          </p>
        </div>
      </div>
    </div>
  );
});

interface MobilePreviewProps {
  blocks?: Block[];
}

export function MobilePreview({ blocks = [] }: MobilePreviewProps) {
  return (
    <>
      {/* Desktop Preview */}
      <div className="hidden lg:block w-[375px] h-[667px] bg-background rounded-[3rem] border-8 border-muted shadow-xl">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
          <PreviewContent blocks={blocks} />
        </div>
      </div>

      {/* Mobile Preview Button & Sheet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full h-12 w-12">
              <Smartphone className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <PreviewContent blocks={blocks} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
} 