import { GeistSans } from 'geist/font';
import { GeistMono } from 'geist/font';
import { Inter, Manrope, Montserrat } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Stayz.club - Hotel Link in Bio Platform",
  description: "Create beautiful link in bio pages for your hotel.",
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        GeistSans.variable,
        GeistMono.variable,
        inter.variable,
        manrope.variable,
        montserrat.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
