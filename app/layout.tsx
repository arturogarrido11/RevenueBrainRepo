import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Revenue Brain — AI Receptionist for Businesses",
    template: "%s | Revenue Brain",
  },
  description:
    "Revenue Brain answers your missed calls with a natural AI voice, books appointments into your calendar, and captures every lead — automatically, 24/7.",
  metadataBase: new URL("https://revenuebrain.ai"),
  openGraph: {
    title: "Revenue Brain — AI Receptionist for Businesses",
    description:
      "Revenue Brain answers your missed calls with a natural AI voice, books appointments, and captures every lead — 24/7.",
    url: "https://revenuebrain.ai",
    siteName: "Revenue Brain",
    images: [
      {
        url: "/brand/social-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Revenue Brain — AI receptionist",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revenue Brain — AI Receptionist for Businesses",
    description:
      "Revenue Brain answers your missed calls with a natural AI voice, books appointments, and captures every lead — 24/7.",
    images: ["/brand/social-share-1200x630.png"],
  },
  icons: {
    icon: [
      { url: "/brand/favicon.ico", sizes: "any" },
      { url: "/brand/icon.svg", type: "image/svg+xml" },
      { url: "/brand/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/brand/site.webmanifest" },
    ],
  },
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={inter.variable}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
