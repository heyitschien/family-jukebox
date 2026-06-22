import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { getAppEnvironment, getRuntimeSiteUrl, getSiteDescription, getSiteName } from "@/lib/site-env";

import "./globals.css";

const ICON_CACHE_VERSION = "20260622";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getRuntimeSiteUrl()),
  title: {
    default: getSiteName(),
    template: `%s · ${getSiteName()}`,
  },
  description: getSiteDescription(),
  icons: {
    icon: [{ url: `/icon?v=${ICON_CACHE_VERSION}`, sizes: "32x32", type: "image/png" }],
    shortcut: [`/icon?v=${ICON_CACHE_VERSION}`],
    apple: [{ url: `/apple-icon?v=${ICON_CACHE_VERSION}`, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appEnvironment = getAppEnvironment();

  return (
    <html lang="en" data-env={appEnvironment} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
