import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Calendar, MessageSquare, ChevronRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { CornerActions } from "./components";

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
    hotelName: "Hotel des Dunes",
    username: "@hoteldesdunes",
    logo: `https://picsum.photos//400/400`,
    description: "Experience luxury and comfort in the heart of the city",
    bookingUrl: "https://booking.com/hoteldesdunes",
    chatUrl: "https://wa.me/1234567890",
    links: [
      {
        id: "1",
        title: "Book Your Stay",
        description: "Best rate guarantee",
        url: "https://booking.com/hoteldesdunes",
      },
      {
        id: "2",
        title: "Restaurant Le Dune",
        description: "Reserve your table",
        url: "https://restaurant.hoteldesdunes.com",
      },
      {
        id: "3",
        title: "Spa & Wellness",
        description: "Discover our treatments",
        url: "https://spa.hoteldesdunes.com",
      },
      {
        id: "4",
        title: "Special Offers",
        description: "Exclusive packages",
        url: "https://offers.hoteldesdunes.com",
      }
    ]
  };

  return mockData;
}

export async function generateMetadata({ params }: LinkPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getLinkData(resolvedParams.id);

  return {
    title: `${data.hotelName} - Official Links`,
    description: data.description,
    openGraph: {
      title: `${data.hotelName} - Book Your Stay & Experiences`,
      description: data.description,
      type: "website",
      images: [
        {
          url: data.logo,
          width: 800,
          height: 800,
          alt: data.hotelName
        }
      ]
    }
  };
}

function LinkDisplay({ data }: { data: Awaited<ReturnType<typeof getLinkData>> }) {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] px-4 py-8">
      <div className="max-w-[420px] mx-auto relative">
        {/* Corner Actions - Now client-side interactive */}
        <Suspense fallback={null}>
          <CornerActions data={data} />
        </Suspense>

        {/* Profile Section */}
        <div className="flex flex-col items-center">
          <div className="w-[88px] h-[88px] rounded-full overflow-hidden mb-5">
            <img 
              src={data.logo} 
              alt={data.hotelName}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            {data.username}
          </h1>
          <p className="text-[15px] text-muted-foreground mb-8">
            {data.hotelName}
          </p>

          {/* Primary Actions */}
          <div className="flex justify-center gap-6 w-full mb-8">
            <a 
              href={data.bookingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-[64px] h-[64px] flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              <Calendar className="h-6 w-6 text-foreground" />
            </a>
            <a 
              href={data.chatUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-[64px] h-[64px] flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              <MessageSquare className="h-6 w-6 text-foreground" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-[10px]">
          {data.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[17px] text-foreground">
                    {link.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground">
                    {link.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
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