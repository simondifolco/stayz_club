interface LinksLayoutProps {
  children: React.ReactNode;
}

export default function LinksLayout({ children }: LinksLayoutProps) {
  return (
    <main className="relative min-h-screen bg-background">
      {children}
      <footer className="absolute bottom-0 w-full py-4 text-center text-sm text-muted-foreground">
        <p>Powered by MHotel</p>
      </footer>
    </main>
  );
} 