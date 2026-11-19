"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import dict from "@/data/i18n.json";
import settings from "@/data/settings.json";
import { money } from "./catalog";

export type Lang = "zh" | "en";
export type Dict = (typeof dict)["zh"];

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "zh" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  return (
    <LangContext.Provider value={{ lang, t: dict[lang] as Dict, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}

/** Fill {placeholders} in a string with values from settings.json (localised where needed). */
export function fill(text: string, lang: Lang) {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = (settings as Record<string, unknown>)[key];
    if (v && typeof v === "object" && lang in v) return (v as Record<Lang, string>)[lang];
    if (typeof v === "number") return money(v);
    return v === undefined ? `{${key}}` : String(v);
  });
}

export function whatsappLink(message: string) {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
