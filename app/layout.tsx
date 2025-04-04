import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import { Manrope } from "next/font/google";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Stayz Club",
  description: "Your customer experiences at its best",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: '--font-geist',
});

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: '--font-inter',
});

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: '--font-manrope',
});

const montserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${inter.variable} ${manrope.variable} ${montserrat.variable}`} 
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Toaster />
          <SonnerToaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
