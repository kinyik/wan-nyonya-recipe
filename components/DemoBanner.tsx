"use client";

import settings from "@/data/settings.json";
import { useLang } from "@/lib/i18n";

/** 网页最上方的娘惹花砖边框；示范模式时在中间放一个小提示 */
export default function DemoBanner() {
  const { t } = useLang();
  return (
    <div className="nyonya-border flex min-h-9 items-center justify-center px-3 py-1">
      {settings.demoMode && (
        <span className="rounded-full bg-cocoa/90 px-3 py-0.5 text-center text-[11px] leading-snug text-gold-soft ring-1 ring-gold/60">
          {t.demoBanner}
        </span>
      )}
    </div>
  );
}
