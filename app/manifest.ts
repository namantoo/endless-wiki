import type { MetadataRoute } from "next";
import { APP_NAME, APP_TAGLINE } from "@/lib/config/tokens";

// The manifest tells the browser how to treat this site as an installed app.
// Next.js App Router serves this automatically at /manifest.webmanifest
// which browsers look for when deciding whether to offer "Add to Home Screen".

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: APP_TAGLINE,

    // Where to open when the user taps the home screen icon
    start_url: "/",

    // "standalone" = opens with NO browser chrome (no URL bar, no back button).
    // This is what makes it feel like a real app rather than a browser tab.
    // Other options: "fullscreen" (also hides status bar), "browser" (normal tab)
    display: "standalone",

    // Color shown during app launch before the page loads
    background_color: "#0D0D0D",

    // Color of the OS status bar on Android
    theme_color: "#0D0D0D",

    // Lock to portrait — this is a scrolling card app
    orientation: "portrait",

    // App store category hints (used by some app stores / search engines)
    categories: ["education", "news"],

    // Icons at multiple sizes — the browser picks the best fit:
    //   192x192 → home screen icon on Android
    //   512x512 → used when the OS needs a larger version (splash screen, etc.)
    //   apple-touch-icon → iOS home screen (referenced in layout <head> separately)
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
