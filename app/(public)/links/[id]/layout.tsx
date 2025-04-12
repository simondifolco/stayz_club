import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { CornerActions } from "./components/actions";

interface HotelData {
  id: string;
  name: string;
  logo_url: string | null;
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
        logo_url
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching hotel:', error);
      return null;
    }

    return hotel;
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

  return (
    <main className="relative min-h-screen">
      {children}
    </main>
  );
} 