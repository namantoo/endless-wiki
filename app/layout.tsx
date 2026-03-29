import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { APP_NAME, APP_TAGLINE } from "@/lib/config/tokens";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    // "black-translucent" = status bar overlays the app (edge-to-edge on iOS)
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Reads saved theme before first paint — prevents white flash on dark pref */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('wheels_theme');if(!t)t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* iOS home screen icon — Safari ignores the manifest for this */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="h-full overflow-hidden">
        <Providers>{children}</Providers>
        {/* Registers /sw.js — must be client-side, hence a separate component */}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
