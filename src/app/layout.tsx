import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { LOCALE_HTML_LANG } from "@/lib/i18n/locales";
import { getRequestLocale } from "@/lib/i18n/request";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.travelgratuitygroup.com"),
  title: {
    default: "Travel Gratuity Group",
    template: "%s · Travel Gratuity Group",
  },
  description:
    "Cashless tipping for hotel staff and tour guides. Guests scan a QR with their phone camera. No guest app, no guest account, no login.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getRequestLocale();
  return (
    <html
      lang={LOCALE_HTML_LANG[locale]}
      data-scroll-behavior="smooth"
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
