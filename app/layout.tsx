import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";

// Lenis requires its core CSS to function smoothly
import "lenis/dist/lenis.css";
import "./globals.css";

const _geistSans = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReliefRoute AI — Zero Food Waste. Instant AI Rescue.",
  description:
    "ReliefRoute AI connects surplus kitchen inventory to local shelters using Gemini Vision AI and dynamic PostGIS routing before food expires.",
  generator: "v0.app",
  applicationName: "ReliefRoute AI",
  keywords: [
    "food rescue",
    "food waste",
    "AI logistics",
    "geospatial matching",
    "shelter network",
    "surplus food donation",
  ],
  openGraph: {
    title: "ReliefRoute AI — Zero Food Waste. Instant AI Rescue.",
    description:
      "Real-time geospatial matching between surplus kitchens and local shelters, powered by vision AI and PostGIS routing.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* The entire website is now wrapped in the smooth scrolling context */}
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
