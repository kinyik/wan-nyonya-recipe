import settings from "@/data/settings.json";
import { catalog, toCents } from "@/lib/catalog";
import type { CartLine } from "@/lib/cart";
import { ORDER_ID_RE, itemsSummary, orderTotal, type OrderForm, type OrderPayload } from "@/lib/order";

/**
 * 收到网站的订单 → 在服务器上重新检查、按 products.json 重算总价 → 转发到 Google Apps Script 写进 Sheet。
 * Apps Script 网址和密码放在环境变量里（.env.local / Vercel），不会出现在浏览器。
 */
export async function POST(request: Request) {
  const url = process.env.ORDER_SHEET_URL;
  const secret = process.env.ORDER_SHEET_SECRET;
  if (!url || !secret) {
    return Response.json({ ok: false, error: "Google Sheet 还没设定（缺 ORDER_SHEET_URL 或 ORDER_SHEET_SECRET）" }, { status: 503 });
  }

  let body: OrderPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "资料格式不对" }, { status: 400 });
  }

  const problem = checkOrder(body);
  if (problem) return Response.json({ ok: false, error: problem }, { status: 400 });

  const { orderId, lines, form } = body;
  const order = {
    orderId,
    name: form.name.trim(),
    phone: form.phone.trim(),
    method: form.method,
    address: form.method === "delivery" ? form.address.trim() : "",
    date: form.date,
    items: itemsSummary(lines),
    total: orderTotal(lines), // 用服务器上的价钱重算，不信任浏览器传来的金额
    note: form.note.trim(),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, order }),
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const result = (await res.json()) as { ok: boolean; error?: string };
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    return Response.json({ ok: false, error: `连不上 Google Sheet：${String(err)}` }, { status: 502 });
  }
}

/** 检查订单资料；有问题就回传原因，没问题回传 null */
function checkOrder(body: OrderPayload): string | null {
  if (!body || typeof body !== "object") return "没有资料";
  const { orderId, lines, form } = body;

  if (typeof orderId !== "string" || !ORDER_ID_RE.test(orderId)) return "订单编号不对";

  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 30) return "订单内容不对";
  for (const l of lines as CartLine[]) {
    if (!l || !catalog[l.id]) return "有不存在的产品";
    if (!Number.isInteger(l.qty) || l.qty < 1 || l.qty > 99) return "数量不对";
  }
  if (toCents(orderTotal(lines)) < toCents(settings.minOrder)) return "未达最低消费";

  const f = form as OrderForm | undefined;
  if (!f) return "没有客人资料";
  const str = (v: unknown, max: number) => typeof v === "string" && v.length <= max;
  if (!str(f.name, 60) || !f.name.trim()) return "姓名不对";
  if (!str(f.phone, 30)) return "电话不对";
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 13) return "电话不对";
  if (f.method !== "pickup" && f.method !== "delivery") return "取货方式不对";
  if (!str(f.address, 300)) return "地址太长";
  if (f.method === "delivery" && !f.address.trim()) return "缺送货地址";
  if (!str(f.date, 10) || !/^\d{4}-\d{2}-\d{2}$/.test(f.date)) return "日期不对";
  if (!str(f.note, 500)) return "备注太长";
  return null;
}
