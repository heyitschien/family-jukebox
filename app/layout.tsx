import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { getAppEnvironment, getRuntimeSiteUrl, getSiteDescription, getSiteName } from "@/lib/site-env";

import "./globals.css";

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
    icon: "/og-share.jpg",
    apple: "/og-share.jpg",
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
