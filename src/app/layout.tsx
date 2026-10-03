import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: "Andriy Calisthenics & AI Coach",
  description: "Елітний мобільний PWA для калістеніки з персональним ШІ-тренером Gemini 2.5 Flash для Андрія",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Calisthenics AI",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark bg-zinc-950">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <div className="relative min-h-screen flex flex-col max-w-md mx-auto shadow-2xl shadow-emerald-950/20 bg-zinc-950 border-x border-zinc-900/60">
          {children}
        </div>
      </body>
    </html>
  );
}
