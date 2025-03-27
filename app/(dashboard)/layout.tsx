import { DashboardNav } from "@/components/dashboard/nav";
import { HotelProvider } from "@/contexts/hotel-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HotelProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <DashboardNav/>
          <main className="flex-1 p-4 lg:p-6 lg:pl-[calc(240px+1.5rem)]">
            {children}
          </main>
        </div>
      </div>
    </HotelProvider>
  );
} 