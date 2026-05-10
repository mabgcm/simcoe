import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsentAnalytics } from "@/components/layout/CookieConsentAnalytics";
import { getMessages, getRequestLocale } from "@/i18n/server";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: {
    default: "Simcoe Turkish Association",
    template: "%s | Simcoe Turkish Association"
  },
  description: "Simcoe Turkish Association community platform for members, events, newcomers, sponsors and donations.",
  openGraph: {
    title: "Simcoe Turkish Association",
    description: "Community, culture and support for Turkish Canadians in Simcoe County.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image"
  }
};

/** Root shell with global navigation, analytics and app providers. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = getRequestLocale();
  const messages = getMessages(locale);

  return (
    <html lang={locale} className={`${playfair.variable} ${sourceSans.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
          <CookieConsentAnalytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
