import settings from "@/data/settings.json";
import { catalog } from "./catalog";
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

/** 最早可选日期：今天 + settings.leadDays 天（用客人电脑的日期） */
export function earliestDate(from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + settings.leadDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDateZh(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return `${y}年${m}月${d}日（星期${WEEKDAYS[day]}）`;
}

/** 组合发到 WhatsApp 的订单讯息（中文，方便店家看） */
export function buildOrderMessage(lines: CartLine[], form: OrderForm) {
  const c = settings.currency;
  const total = lines.reduce((n, l) => n + l.qty * catalog[l.id].price, 0);
  const items = lines.map((l) => {
    const item = catalog[l.id];
    const label = item.malay ? `${item.name.zh}（${item.malay}）` : item.name.zh;
    return `• ${label} × ${l.qty} = ${c}${item.price * l.qty}`;
  });

  return [
    "你好云惹坊，我想下单：",
    "",
    "【订单内容】",
    ...items,
    `总价：${c}${total}`,
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
