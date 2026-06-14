import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Spline_Sans_Mono } from "next/font/google";
import { BrandProvider } from "@/components/brand-provider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prairie Signal Supply Co. — AI Workflow Dashboard",
  description:
    "A product-style demo that turns scattered business data into daily summaries, priority alerts, and next-step visibility for small business teams.",
  // Demo subdomain — intentionally kept out of search indexes. The portfolio
  // case study at armatir.com/projects/prairie-signal-supply-co is the
  // indexable, canonical entry point for this work.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-accent="amber"
      data-mode="dark"
      className={`${bricolage.variable} ${instrument.variable} ${splineMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BrandProvider>{children}</BrandProvider>
      </body>
    </html>
  );
}
