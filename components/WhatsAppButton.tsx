"use client";

import { useCart } from "@/lib/cart";
import { useLang, whatsappLink } from "@/lib/i18n";
import { WhatsAppIcon } from "./Hero";

/** 右下角浮动的 WhatsApp 按钮，滚到哪里都能点 */
export default function WhatsAppButton() {
  const { t } = useLang();
  const { isOpen } = useCart();
  if (isOpen) return null;
  return (
    <a
      href={whatsappLink(t.hero.whatsappGreeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.hero.ctaWhatsapp}
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-4 ring-white/70 transition-transform hover:scale-105 md:right-6"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
