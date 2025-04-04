import { useHotel } from "@/contexts/hotel-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Calendar, MessageSquare, Share2, ChevronRight, Smartphone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobilePreviewProps {
  blocks: Array<{
    id: number;
    name: string;
    links: Array<{
      id: number;
      name: string;
      description: string;
      type: "external" | "pdf";
      url?: string;
      pdfUrl?: string;
    }>;
  }>;
}

export function MobilePreview({ blocks }: MobilePreviewProps) {
  const { selectedHotel } = useHotel();
  const theme = selectedHotel?.theme;

  const PreviewContent = () => (
    <div 
      className={cn(
        "w-full h-full overflow-y-auto",
        theme?.darkMode ? "bg-[#0a0a0a] text-white" : "bg-[#fafafa] text-black",
        {
          'font-geist': theme?.font === 'geist',
          'font-inter': theme?.font === 'inter',
          'font-manrope': theme?.font === 'manrope',
          'font-montserrat': theme?.font === 'montserrat',
        }
      )}
      style={{
        "--theme-primary": theme?.primaryColor || "#000000",
        "--theme-secondary": theme?.secondaryColor || "#ffffff",
      } as React.CSSProperties}
    >
      <div className="px-4 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <button className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
            theme?.darkMode 
              ? "bg-[#1a1a1a] hover:bg-white/5" 
              : "bg-white hover:bg-black/5"
          )}>
            <Bell className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
          </button>
          <button className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
            theme?.darkMode 
              ? "bg-[#1a1a1a] hover:bg-white/5" 
              : "bg-white hover:bg-black/5"
          )}>
            <Share2 className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
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
                  "w-[64px] h-[64px] flex items-center justify-center rounded-full transition-all duration-200",
                  theme?.darkMode 
                    ? "bg-[#1a1a1a] hover:bg-white/5" 
                    : "bg-white hover:bg-black/5"
                )}
              >
                <Calendar className="h-6 w-6" style={{ color: 'var(--theme-primary)' }} />
              </a>
            )}
            {theme?.contactEmail && (
              <a 
                href={`mailto:${theme.contactEmail}`}
                className={cn(
                  "w-[64px] h-[64px] flex items-center justify-center rounded-full transition-all duration-200",
                  theme?.darkMode 
                    ? "bg-[#1a1a1a] hover:bg-white/5" 
                    : "bg-white hover:bg-black/5"
                )}
              >
                <Mail className="h-6 w-6" style={{ color: 'var(--theme-primary)' }} />
              </a>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {blocks.map((block) => (
            <div key={block.id} className="space-y-3">
              {block.links.map((link) => (
                <div
                  key={link.id}
                  className={cn(
                    "group block w-full p-4 rounded-2xl transition-all duration-200",
                    theme?.darkMode 
                      ? "bg-[#1a1a1a] hover:bg-white/5" 
                      : "bg-white hover:bg-black/5"
                  )}
                  style={{ borderColor: 'var(--theme-primary)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[17px]" style={{ color: 'var(--theme-primary)' }}>
                        {link.name}
                      </h3>
                      {link.description && (
                        <p className="text-[15px] text-muted-foreground">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight 
                      className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" 
                      style={{ color: 'var(--theme-primary)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Powered By */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-medium">STAYZ.club</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Preview */}
      <div className="hidden lg:block w-[375px] h-[667px] bg-background rounded-[3rem] border-8 border-muted shadow-xl">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
          <PreviewContent />
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
            <PreviewContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
} 