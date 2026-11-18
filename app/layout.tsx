import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const serif = Noto_Serif_SC({
  weight: ["500", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
  preload: false,
});

const sans = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "云惹坊 Wan Nyonya Recipe｜手工娘惹糕",
  description: "云惹坊手工娘惹糕：九层糕、斑斓椰浆糕、蝶豆花糯米糕，WhatsApp 一键下单。",
};

export const viewport: Viewport = {
  themeColor: "#3a2418",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
