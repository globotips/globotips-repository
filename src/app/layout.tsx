import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { GUEST_BRAND_DESCRIPTION, GUEST_BRAND_NAME } from "@/lib/brand";
import { PUBLIC_TIP_HOST } from "@/lib/config";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${PUBLIC_TIP_HOST}`),
  title: {
    default: GUEST_BRAND_NAME,
    template: `%s · ${GUEST_BRAND_NAME}`,
  },
  description: GUEST_BRAND_DESCRIPTION,
  applicationName: GUEST_BRAND_NAME,
  openGraph: {
    title: GUEST_BRAND_NAME,
    description: GUEST_BRAND_DESCRIPTION,
    siteName: GUEST_BRAND_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: GUEST_BRAND_NAME,
    description: GUEST_BRAND_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
