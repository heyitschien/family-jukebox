import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { APP_THEME_COLOR } from "@/lib/app-install";
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
  applicationName: getSiteName(),
  appleWebApp: {
    capable: true,
    title: "Cousin Radio",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: APP_THEME_COLOR,
  colorScheme: "dark",
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
