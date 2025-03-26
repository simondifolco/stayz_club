import Link from "next/link";

interface LinksLayoutProps {
  children: React.ReactNode;
}

export default function LinksLayout({ children }: LinksLayoutProps) {
  return (
    <main className="relative min-h-screen bg-background">
      {children}
      <footer className="absolute bottom-0 w-full py-4 text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:opacity-80">
          Powered by <span className="text-3xl font-geist bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary transition-colors uppercase tracking-tighter font-black">stayz<span className="font-extralight lowercase"> .club</span></span>
        </Link>
      </footer>
    </main>
  );
} 