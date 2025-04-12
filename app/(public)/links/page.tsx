import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Hotel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
}

export default async function LinksPage() {
  const supabase = await createClient();

  // Get all active hotels
  const { data: hotels, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hotels:', error);
    return (
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Error</h1>
        <p>Failed to load hotels. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 py-12">
      <div className="max-w-[2000px] mx-auto">
        <h1 className="mb-12 text-5xl font-bold text-center">Hotel Links</h1>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {(hotels as Hotel[]).map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative h-80 w-full">
                {hotel.logo_url ? (
                  <Image
                    src={hotel.logo_url}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1920px) 33vw, 20vw"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <span className="text-5xl text-muted-foreground">
                      {hotel.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-3xl mb-3">{hotel.name}</CardTitle>
                <CardDescription className="text-xl">{hotel.description}</CardDescription>
                <Link href={`/links/${hotel.slug}`} className="mt-8 w-full">
                  <Button variant="outline" className="w-full text-xl py-8">
                    View Links Page
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}