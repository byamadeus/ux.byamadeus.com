import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
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
  title: "ux | byamadeus",
  description: "UX work by Amadeus Cameron — vision-driven product designer.",
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
      </body>
    </html>
  );
}
