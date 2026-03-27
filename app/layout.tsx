import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

// Note: Space Grotesk + Inter are declared in globals.css via CSS variables
// (--font-heading, --font-body). Google Fonts self-hosting requires network
// access at build time. In production, replace the CSS variable values with
// next/font/google imports once the build environment allows it.

export const metadata: Metadata = {
  title: "Weels",
  description: "Spin through the world's knowledge. Endless Wikipedia discovery.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className=""
      suppressHydrationWarning
    >
      <body className="h-full overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
