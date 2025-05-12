import "@/styles/globals.css";

import * as React from "react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

// import { PostHogPageView } from "@/app/posthog-pageview";
import { ThemeProvider } from "@/components/providers";
// import { SmoothScroll } from "@/components/smooth-scroll";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  authors: [
    {
      name: "iboughtbed",
      url: "https://github.com/iboughtbed",
    },
  ],
  creator: "iboughtbed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@iboughtbed",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen overflow-x-hidden font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextIntlClientProvider messages={messages}>
                <div vaul-drawer-wrapper="">{children}</div>
                <TailwindIndicator />
                <Sonner richColors />
              </NextIntlClientProvider>
            </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
