"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#products", label: t.nav.products },
    { href: "#story", label: t.nav.about },
    { href: "#how-to-order", label: t.nav.howto },
    { href: "#contact", label: t.nav.contact },
  ];

  const LangToggle = (
    <div className="inline-flex rounded-full border border-gold/50 p-0.5 text-xs font-medium" role="group" aria-label="Language">
      {(["zh", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            lang === l ? "bg-cocoa text-gold-soft" : "text-bark hover:text-cocoa"
          }`}
        >
          {l === "zh" ? "中" : "EN"}
        </button>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/images/brand/logo.png" alt={`${t.brand.name} ${t.brand.en}`} width={800} height={713} priority className="h-12 w-auto" />
          <span className="hidden leading-none min-[400px]:block">
            <span className="block font-serif text-lg font-bold text-cocoa">{t.brand.name}</span>
            <span className="kicker block text-[13px] text-clay">{t.brand.en}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-sm text-bark md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-nyonya">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden sm:block">{LangToggle}</div>
          <a
            href="#products"
            className="rounded-full bg-nyonya px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-nyonya-deep"
          >
            {t.nav.order}
          </a>
          <button
            type="button"
            className="-mr-1 p-2 text-cocoa md:hidden"
            aria-label={t.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-sand/70 bg-cream px-4 pb-5 md:hidden">
          <ul className="divide-y divide-sand/70">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="block py-3.5 text-base text-cocoa" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pt-3">{LangToggle}</div>
        </div>
      )}
    </header>
  );
}
