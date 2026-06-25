import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { getAppEnvironment, getRuntimeSiteUrl, getSiteDescription, getSiteName, isStagingEnvironment } from "@/lib/site-env";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getRuntimeSiteUrl()),
  applicationName: getSiteName(),
  title: {
    default: getSiteName(),
    template: `%s · ${getSiteName()}`,
  },
  description: getSiteDescription(),
  ...(isStagingEnvironment()
    ? { robots: { index: false, follow: false, nocache: true } }
    : {}),
  appleWebApp: {
    capable: true,
    title: getSiteName(),
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
