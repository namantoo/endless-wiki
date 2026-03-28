import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

// Fonts are loaded via Google Fonts CDN at runtime.
// next/font/google requires build-time network access to Google Fonts,
// which may be blocked in some environments. The CSS variable approach
// (--font-heading, --font-body) declared in globals.css works universally.

export const metadata: Metadata = {
  title: "Weels",
  description: "Spin through the world's knowledge. Endless Wikipedia discovery.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
