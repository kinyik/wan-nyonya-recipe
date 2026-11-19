"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { catalog, toCents } from "./catalog";

export type CartLine = { id: string; qty: number };

type Ctx = {
  lines: CartLine[];
  count: number;
  total: number;
  qtyOf: (id: string) => number;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "cart-v1";
const MAX_QTY = 99;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // 记住客人的购物篮（关掉网页再回来还在）
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartLine[];
      if (Array.isArray(saved)) setLines(saved.filter((l) => catalog[l?.id] && Number.isInteger(l.qty) && l.qty > 0));
    } catch {}
    setLoaded(true);
  }, []);
  // 读取完旧的购物篮之后才开始存，否则会先用空篮子把旧资料盖掉
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const value = useMemo<Ctx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + l.qty * toCents(catalog[l.id].price), 0) / 100;
    return {
      lines,
      count,
      total,
      qtyOf: (id) => lines.find((l) => l.id === id)?.qty ?? 0,
      setQty: (id, qty) => {
        const q = Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));
        setLines((prev) => {
          const rest = prev.filter((l) => l.id !== id);
          if (q === 0) return rest;
          const i = prev.findIndex((l) => l.id === id);
          if (i === -1) return [...prev, { id, qty: q }];
          const next = [...prev];
          next[i] = { id, qty: q };
          return next;
        });
      },
      clear: () => setLines([]),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
