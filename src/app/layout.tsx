import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MyPlanzo — Book event vendors in Mumbai",
    template: "%s · MyPlanzo",
  },
  description:
    "Find verified decorators, caterers, photographers & venues for birthdays, baby showers, and more. No calls, no hassle.",
  openGraph: {
    title: "MyPlanzo — Book event vendors in Mumbai",
    description:
      "Find verified decorators, caterers, photographers & venues for birthdays, baby showers, and more. No calls, no hassle.",
    siteName: "MyPlanzo",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "MyPlanzo — Book event vendors in Mumbai",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPlanzo — Book event vendors in Mumbai",
    description:
      "Find verified decorators, caterers, photographers & venues for birthdays, baby showers, and more.",
    images: ["/logo.jpg"],
  },
  // PWA — installable on iOS Safari / Android Chrome.
  appleWebApp: {
    capable: true,
    title: "MyPlanzo",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased`}>{children}</body>
    </html>
  );
}
