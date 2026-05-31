import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { SupportFab } from "@/components/SupportFab";
import { PixelPageView } from "@/components/PixelPageView";
import { FB_PIXEL_ID } from "@/lib/fbpixel";

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
        url: "/logo1.jpeg",
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
    images: ["/logo1.jpeg"],
  },
  // PWA — installable on iOS Safari / Android Chrome.
  appleWebApp: {
    capable: true,
    title: "MyPlanzo",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo1.jpeg",
    apple: "/logo1.jpeg",
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
      <head>
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased`}>
        <Suspense fallback={null}>
          <PixelPageView />
        </Suspense>
        {children}
        <SupportFab />
      </body>
    </html>
  );
}
