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
