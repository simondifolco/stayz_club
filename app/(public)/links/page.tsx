import Image from "next/image";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LinksPage() {
  // Mock data - replace with actual data fetching
  const links = [
    {
      id: "sample-hotel-1",
      hotelName: "Luxury Resort & Spa",
      description: "Experience luxury at its finest",
      imageId: "1048" // Luxury hotel image
    },
    {
      id: "sample-hotel-2", 
      hotelName: "Business Hotel",
      description: "Perfect for business travelers",
      imageId: "1040" // Modern building image
    }
  ];

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Hotel Links</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Card key={link.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-48 w-full">
              <Image
                src={`https://picsum.photos/id/${link.imageId}/800/400`}
                alt={link.hotelName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
            <CardHeader>
              <CardTitle>{link.hotelName}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
              <Link href={`/links/${link.id}`} className="mt-4 w-full">
                <Button variant="outline" className="w-full">
                  View Links Page
                </Button>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}