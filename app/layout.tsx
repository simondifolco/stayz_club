import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import { Manrope } from "next/font/google";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

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

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          let isDark = window.matchMedia('(prefers-color-scheme: dark)')
          let theme = localStorage.getItem('theme')
          if (theme === 'system' || !theme) {
            document.documentElement.classList.toggle('dark', isDark.matches)
          } else {
            document.documentElement.classList.toggle('dark', theme === 'dark')
          }
          document.documentElement.style.colorScheme = isDark.matches ? 'dark' : 'light'
        `,
      }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", geistSans.variable, inter.variable, manrope.variable, montserrat.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
