// 网站正式网址：分享卡、sitemap、robots 都会用到
// 1. 有自己的域名时，在 .env.local / Vercel 填 NEXT_PUBLIC_SITE_URL=https://你的域名
// 2. 没填的话，部署在 Vercel 会自动用 Vercel 给的正式网址
// 3. 都没有（本机开发）就用 localhost
function resolveSiteUrl() {
  const custom = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (custom) return custom.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
