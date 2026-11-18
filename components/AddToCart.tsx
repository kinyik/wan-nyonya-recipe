"use client";

import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";

/** 还没加：显示「加入订单」；加了：变成 − 数量 + */
export default function AddToCart({ id, label, dark = false }: { id: string; label: string; dark?: boolean }) {
  const { qtyOf, setQty } = useCart();
  const { t } = useLang();
  const qty = qtyOf(id);

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => setQty(id, 1)}
        className={
          dark
            ? "rounded-full bg-gold px-4 py-2 text-sm font-medium text-cocoa transition-colors hover:bg-gold-soft"
            : "w-full rounded-full border border-cocoa py-2 text-sm font-medium text-cocoa transition-colors hover:bg-cocoa hover:text-paper"
        }
      >
        {label}
      </button>
    );
  }

  return <QtyStepper id={id} qty={qty} dark={dark} full={!dark} labels={t.cart} onChange={setQty} />;
}

export function QtyStepper({
  id,
  qty,
  onChange,
  labels,
  dark = false,
  full = false,
}: {
  id: string;
  qty: number;
  onChange: (id: string, qty: number) => void;
  labels: { decrease: string; increase: string };
  dark?: boolean;
  full?: boolean;
}) {
  const btn = `flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg leading-none transition-colors ${
    dark ? "bg-gold text-cocoa hover:bg-gold-soft" : "bg-cocoa text-paper hover:bg-bark"
  }`;
  return (
    <div className={`flex items-center justify-between gap-2 ${full ? "w-full" : ""}`}>
      <button type="button" className={btn} onClick={() => onChange(id, qty - 1)} aria-label={labels.decrease}>
        −
      </button>
      <span className={`min-w-6 text-center font-display text-xl font-semibold ${dark ? "text-paper" : "text-cocoa"}`} aria-live="polite">
        {qty}
      </span>
      <button type="button" className={btn} onClick={() => onChange(id, qty + 1)} aria-label={labels.increase}>
        +
      </button>
    </div>
  );
}
