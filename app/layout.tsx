import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
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
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fff9f0] text-amber-950">
        {children}
      </body>
    </html>
  );
}
