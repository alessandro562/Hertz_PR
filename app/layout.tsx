import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

export const metadata: Metadata = {
  title: {
    default: "hertz PR Hub",
    template: "%s · hertz PR Hub",
  },
  description: "CRM operativo per PR e capi promoter — hertz",
  applicationName: "hertz PR Hub",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "hertz PR",
  },
  // Tab/app icon comes from app/icon.png + app/apple-icon.png (Next.js file
  // conventions) — the hertz waveform mark on ink, not the old default favicon.
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#151515",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-svh bg-background">
        {/* Set --app-height to the real device viewport BEFORE first paint, then
            keep it in sync on resize/rotate. Runs synchronously at the top of
            <body> so the mobile shell is sized correctly on the very first frame
            — the bottom tab bar lands at the true bottom of every phone, with no
            first-paint bounce. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function s(){var h=(window.visualViewport&&window.visualViewport.height)||window.innerHeight;document.documentElement.style.setProperty('--app-height',h+'px');}s();window.addEventListener('resize',s);window.addEventListener('orientationchange',s);if(window.visualViewport){window.visualViewport.addEventListener('resize',s);}})();",
          }}
        />
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
