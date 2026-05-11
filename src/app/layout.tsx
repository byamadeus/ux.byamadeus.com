import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import Script from "next/script";
import { EditProvider } from "@/lib/edit-context";
import { Nav } from "@/components/Nav";
import { LocalNav } from "@/components/LocalNav";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ux.byamadeus.com"),
  title: "ux | byamadeus",
  description: "Vision-driven product design by Amadeus Cameron.",
  openGraph: {
    title: "ux | byamadeus",
    description: "Vision-driven product design by Amadeus Cameron.",
    url: "https://ux.byamadeus.com",
    siteName: "byamadeus",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ux | byamadeus",
    description: "Vision-driven product design by Amadeus Cameron.",
  },
  icons: {
    icon: "/icon.gif",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${notoSans.variable} antialiased`}>
        <EditProvider>
          <Nav />
          <LocalNav />
          {children}
        </EditProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2CKJ5P1QST"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2CKJ5P1QST');
          `}
        </Script>
      </body>
    </html>
  );
}
