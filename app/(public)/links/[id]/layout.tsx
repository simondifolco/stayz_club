import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ClientShare, ClientSubscribe } from "./components/client-actions";
import { Share2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelData {
  id: string;
  name: string;
  logo_url: string | null;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    buttonStyle?: 'minimal' | 'outline' | 'solid' | 'soft';
  };
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

async function getHotelData(slug: string): Promise<HotelData | null> {
  try {
    const supabase = await createClient();
    const { data: hotel, error } = await supabase
      .from('hotels')
      .select(`
        id,
        name,
        logo_url,
        theme
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching hotel:', error);
      return null;
    }

    return {
      ...hotel,
      theme: hotel.theme || {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        backgroundColor: '#ffffff',
        buttonStyle: 'minimal'
      }
    };
  } catch (error) {
    console.error('Error in getHotelData:', error);
    return null;
  }
}

export default async function Layout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  
  if (!resolvedParams.id) {
    notFound();
  }

  const hotel = await getHotelData(resolvedParams.id);

  if (!hotel) {
    notFound();
  }

  const safeTheme = {
    primaryColor: hotel.theme?.primaryColor || '#000000',
    secondaryColor: hotel.theme?.secondaryColor || '#ffffff',
    backgroundColor: hotel.theme?.backgroundColor || '#ffffff',
    buttonStyle: hotel.theme?.buttonStyle || 'minimal'
  };

  const navButtonClassName = cn(
    "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 border-2 shadow-sm hover:shadow-md",
    {
      'bg-transparent hover:bg-primary/10 border-transparent': safeTheme.buttonStyle === 'minimal',
      'bg-transparent hover:bg-primary/5': safeTheme.buttonStyle === 'outline',
      'hover:opacity-90 border-transparent': safeTheme.buttonStyle === 'solid',
      'bg-primary/10 hover:bg-primary/20 border-transparent': safeTheme.buttonStyle === 'soft',
    }
  );

  const navButtonStyle = {
    borderColor: safeTheme.buttonStyle === 'outline' ? safeTheme.primaryColor : 'transparent',
    color: safeTheme.buttonStyle === 'solid' ? safeTheme.secondaryColor : safeTheme.primaryColor,
    backgroundColor: safeTheme.buttonStyle === 'solid' ? safeTheme.primaryColor : undefined
  };

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: safeTheme.backgroundColor }}>
      <div className="fixed top-6 left-6 z-50">
        <ClientSubscribe hotel={hotel} theme={hotel.theme} />
      </div>
      <div className="fixed top-6 right-6 z-50">
        <ClientShare hotel={hotel} theme={hotel.theme} />
      </div>
      <div className="pt-24">
        {children}
      </div>
    </main>
  );
} 