import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LinkDisplay } from "@/components/links/link-display";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LinkPageProps {
  params: Promise<{
    id: string;
  }>;
}

// This will be replaced with actual data fetching
async function getLinkData(id: string) {
  // TODO: Implement data fetching from your backend
  const mockData = {
    id,
    hotelName: "Sample Hotel",
    logo: `https://picsum.photos//400/400`,
    coverImage: `https://picsum.photos/1920/1080`,
    theme: "default",
    location: "123 Hotel Street, City, Country",
    rating: 4.8,
    description: "Experience luxury and comfort in the heart of the city",
    services: [
      {
        id: "1",
        title: "Book a Room",
        description: "Find your perfect stay with our best rate guarantee",
        url: "https://booking.com",
        icon: "🏨",
        category: "accommodation",
        featured: true
      },
      {
        id: "2",
        title: "Restaurant Reservations",
        description: "Experience fine dining at our award-winning restaurant",
        url: "https://restaurant.com",
        icon: "🍽️",
        category: "dining",
        featured: true
      },
      {
        id: "3",
        title: "Spa & Wellness",
        description: "Relax and rejuvenate with our spa treatments",
        url: "https://spa.com",
        icon: "💆‍♀️",
        category: "wellness"
      },
      {
        id: "4",
        title: "Room Service",
        description: "24/7 in-room dining service",
        url: "https://roomservice.com",
        icon: "🛎️",
        category: "dining"
      },
      {
        id: "5",
        title: "Concierge Services",
        description: "Let us help you plan your perfect stay",
        url: "https://concierge.com",
        icon: "👨‍💼",
        category: "services"
      }
    ],
    socialLinks: {
      instagram: "https://instagram.com/samplehotel",
      facebook: "https://facebook.com/samplehotel",
      twitter: "https://twitter.com/samplehotel",
      tripadvisor: "https://tripadvisor.com/samplehotel"
    },
    contactInfo: {
      phone: "+1 234 567 8900",
      email: "info@samplehotel.com",
      whatsapp: "+1 234 567 8900"
    }
  };

  return mockData;
}

export async function generateMetadata({ params }: LinkPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getLinkData(resolvedParams.id);

  return {
    title: `${data.hotelName} - Book Your Stay & Experiences`,
    description: `${data.description}. Book your stay, restaurant, spa, and more at ${data.hotelName}. Located in ${data.location}`,
    openGraph: {
      title: `${data.hotelName} - Luxury Hotel Experience`,
      description: `${data.description}. Book your stay, restaurant, spa, and more at ${data.hotelName}. Located in ${data.location}`,
      type: "website",
      images: [
        {
          url: data.coverImage,
          width: 1200,
          height: 630,
          alt: data.hotelName
        }
      ]
    }
  };
}

export default async function LinkPage({ params }: LinkPageProps) {
  const resolvedParams = await params;
  const data = await getLinkData(resolvedParams.id);

  if (!data) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LinkDisplay data={data} />
    </Suspense>
  );
} 