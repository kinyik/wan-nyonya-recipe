import data from "@/data/products.json";

export type CatalogItem = {
  id: string;
  kind: "product" | "set";
  name: { zh: string; en: string };
  malay?: string;
  price: number;
  image: string;
};

/** 产品 + 套餐合成一张表，购物篮用 id 查价钱和名称 */
export const catalog: Record<string, CatalogItem> = Object.fromEntries([
  ...data.products.map((p) => [p.id, { id: p.id, kind: "product", name: p.name, malay: p.malay, price: p.price, image: p.image }]),
  ...data.sets.map((s) => [s.id, { id: s.id, kind: "set", name: s.name, price: s.price, image: s.image }]),
]);

/**
 * 钱一律先换成「仙」（整数）再加减，避免 9.9 × 3 = 29.700000000000003 这种小数误差。
 */
export const toCents = (rm: number) => Math.round(rm * 100);

/** 金额显示：整数显示 58，有小数显示 9.90 */
export function money(rm: number) {
  const cents = toCents(rm);
  return cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);
}
