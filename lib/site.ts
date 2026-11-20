// 网站正式网址：分享卡、sitemap、robots 都会用到
// 1. 想临时换网址时，在 .env.local / Vercel 填 NEXT_PUBLIC_SITE_URL=https://网址
// 2. 部署在 Vercel 正式版：用自己的域名 wannyonya.com.my
// 3. Vercel 预览版用它自己的网址；本机开发用 localhost
export const PRODUCTION_URL = "https://wannyonya.com.my";

function resolveSiteUrl() {
  const custom = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (custom) return custom.replace(/\/+$/, "");
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
