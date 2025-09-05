// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  // Fixes Next warning about metadataBase
  metadataBase: new URL(siteUrl),

  // Title handling
  title: {
    default: "Warbuoy — Marketing Agency",
    template: "%s — Warbuoy",
  },
  description:
    "We scale local brands, coaches, and e-commerce stores with ads, funnels & creative that convert.",
  keywords: [
    "marketing agency",
    "facebook ads",
    "tiktok ads",
    "ecommerce growth",
    "fitness coach marketing",
    "funnels",
    "Warbuoy",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Warbuoy — Marketing Agency",
    description:
      "Ads. Funnels. Creative. Everything you need to turn attention into consistent revenue.",
    url: siteUrl,
    siteName: "Warbuoy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Warbuoy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warbuoy — Marketing Agency",
    description:
      "Ads. Funnels. Creative. Everything you need to turn attention into consistent revenue.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Warbuoy",
    url: siteUrl,
    email: "suren@warbuoymarketing.ca",
    logo: `${siteUrl}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "suren@warbuoymarketing.ca",
        contactType: "sales",
        availableLanguage: ["en"],
      },
    ],
  };

  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh bg-warbuoyBlack text-white antialiased selection:bg-blue-600 selection:text-white">
        {/* A11y: skip link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-3 focus:py-2"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main-content">{children}</main>

        {/* Structured data for rich snippets */}
        <script
          type="application/ld+json"
          // prevents hydration mismatch warnings
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
