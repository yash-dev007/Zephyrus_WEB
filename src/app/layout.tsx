import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/base.css";
import "../styles/hero.css";
import "../styles/content.css";
import "../styles/footer.css";
import "../styles/motion.css";
import { siteConfig, siteUrl } from "@/data/site";

const bubbledot = localFont({
  src: "../fonts/bubbledot-finepos.woff2",
  variable: "--font-bubbledot",
  weight: "400",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});

const geistPixel = localFont({
  src: "../fonts/GeistPixel-Circle.woff2",
  variable: "--font-geist-pixel",
  weight: "400",
  display: "swap",
  preload: false,
  fallback: ["monospace"],
});

const inter = localFont({
  src: "../fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const bootScript = `
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("reduce");
    }
  } catch (error) {}
  window.__zephyrusBooted = false;
  window.setTimeout(function () {
    if (!window.__zephyrusBooted) root.classList.remove("js");
  }, 2000);
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "technology",
  keywords: [
    "local-first AI",
    "self-hosted AI",
    "AI harness",
    "AI agents",
    "RAG",
    "Ollama",
    "FastAPI",
    "ChromaDB",
    "SearXNG",
    "privacy",
    "open source",
  ],
  authors: [{ name: "Yash", url: siteConfig.github }],
  creator: "Yash",
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zephyrus — local-first AI harness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/assets/img/zephyrus-mark.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bubbledot.variable} ${geistPixel.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script
          id="zephyrus-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: bootScript }}
        />
        {children}
      </body>
    </html>
  );
}
