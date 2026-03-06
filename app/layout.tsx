import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

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
  title: "Revenue Brain",
  description: "Missed call tracking and auto-response for businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          {children}
          <footer className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 py-3 text-center text-sm text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80">
            © 2026 Revenue Brain — Operated by Arturo Garrido
          </footer>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
