import settings from "@/data/settings.json";
import { catalog, money, toCents } from "./catalog";
import type { CartLine } from "./cart";

export type OrderForm = {
  name: string;
  phone: string;
  method: "pickup" | "delivery";
  address: string;
  date: string; // YYYY-MM-DD
  note: string;
};

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const pad = (n: number) => String(n).padStart(2, "0");

/** 这张单要提前几天订：普通盒装 leadDaysSingle 天，有套餐/礼盒就 leadDaysSet 天 */
export function leadDaysFor(lines: CartLine[]) {
  const hasSet = lines.some((l) => catalog[l.id]?.kind === "set");
  return hasSet ? settings.leadDaysSet : settings.leadDaysSingle;
}

/** 最早可选日期：今天 + 提前天数（用客人电脑的日期） */
export function earliestDate(lines: CartLine[], from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + leadDaysFor(lines));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDateZh(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return `${y}年${m}月${d}日（星期${WEEKDAYS[day]}）`;
}

/** 订单编号，例如 WN-261118-7K3Q：WhatsApp 讯息和 Google Sheet 都用同一个，方便对单 */
export function makeOrderId(now = new Date()) {
  const ymd = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 去掉容易看错的 0 O 1 I
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => chars[b % chars.length]).join("");
  return `WN-${ymd}-${rand}`;
}
export const ORDER_ID_RE = /^WN-\d{6}-[A-Z0-9]{4}$/;

/** 订单内容写成一行文字，存进 Google Sheet 用 */
export function itemsSummary(lines: CartLine[]) {
  return lines.map((l) => `${catalog[l.id].name.zh} ×${l.qty}`).join("；");
}

/** 总价（RM），用「仙」计算再换回来，不会有小数误差 */
export function orderTotal(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty * toCents(catalog[l.id].price), 0) / 100;
}

/** 发到 /api/order 的资料 */
export type OrderPayload = { orderId: string; lines: CartLine[]; form: OrderForm };

/**
 * 把订单存进 Google Sheet（经过网站自己的 /api/order）。
 * 不等结果、不挡住 WhatsApp：就算存表失败，客人照样能下单。
 */
export function sendOrderToSheet(payload: OrderPayload) {
  fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((r) => r.json())
    .then((res: { ok: boolean; error?: string }) => {
      if (!res.ok) console.warn("订单没有存进 Google Sheet：", res.error);
    })
    .catch((err) => console.warn("订单没有存进 Google Sheet：", err));
}

/** 组合发到 WhatsApp 的订单讯息（中文，方便店家看） */
export function buildOrderMessage(lines: CartLine[], form: OrderForm, orderId?: string) {
  const c = settings.currency;
  const total = orderTotal(lines);
  const items = lines.map((l) => {
    const item = catalog[l.id];
    const label = item.malay ? `${item.name.zh}（${item.malay}）` : item.name.zh;
    return `• ${label} × ${l.qty} = ${c}${money(orderTotal([l]))}`;
  });

  return [
    "你好云惹坊，我想下单：",
    ...(orderId ? [`订单编号：${orderId}`] : []),
    "",
    "【订单内容】",
    ...items,
    `总价：${c}${money(total)}`,
    "",
    "【客人资料】",
    `姓名：${form.name.trim()}`,
    `电话：${form.phone.trim()}`,
    `方式：${form.method === "pickup" ? "自取" : "送货"}`,
    ...(form.method === "delivery" ? [`送货地址：${form.address.trim()}`] : []),
    `日期：${formatDateZh(form.date)}`,
    ...(form.note.trim() ? [`备注：${form.note.trim()}`] : []),
    "",
    "请帮我确认，谢谢！",
  ].join("\n");
}

export function orderWhatsappUrl(message: string) {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
