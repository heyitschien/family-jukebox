import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppShell } from "@/components/app-shell";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Family Jukebox",
    template: "%s · Family Jukebox",
  },
  description: "Songs, silly memories, and little family anthems.",
  openGraph: {
    title: "Family Jukebox",
    description: "Songs, silly memories, and little family anthems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
