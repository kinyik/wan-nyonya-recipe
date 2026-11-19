import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { SITE_URL } from "@/lib/site";
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

const TITLE = "云惹坊 Wan Nyonya Recipe｜手工娘惹糕";
const DESCRIPTION =
  "云惹坊手工娘惹糕：九层糕、彩虹千层糕、斑斓椰浆糕、蝶豆花糯米糕，当天现做。聚会拼盘、茶歇盒、送礼盒，WhatsApp 一键下单。";

// 分享预览图由 app/opengraph-image.jpg 自动加上
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "云惹坊 Wan Nyonya Recipe",
  keywords: ["娘惹糕", "Nyonya Kuih", "Kuih Lapis", "九层糕", "Kuih Talam", "Pulut Tai Tai", "Kuala Lumpur", "吉隆坡", "云惹坊", "Wan Nyonya Recipe"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "云惹坊 Wan Nyonya Recipe",
    title: TITLE,
    description: DESCRIPTION,
    locale: "zh_CN",
    alternateLocale: ["en_MY"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#3a2418",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body>
        {children}
        {/* Vercel 访客统计：在 Vercel 项目的 Analytics 分页查看 */}
        <Analytics />
      </body>
    </html>
  );
}
