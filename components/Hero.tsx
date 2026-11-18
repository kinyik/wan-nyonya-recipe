"use client";

import Image from "next/image";
import { useLang, whatsappLink } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLang();
  const [line1, line2] = t.hero.title.split("\n");

  return (
    <section id="top" className="relative isolate overflow-hidden bg-cocoa">
      <Image
        src="/images/storyboard/7-ending.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-[30%_50%]"
      />
      {/* 手机：下方渐暗；电脑：右侧渐暗，文字放右边 */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-cocoa via-cocoa/60 to-cocoa/10 md:bg-gradient-to-l md:from-cocoa/95 md:via-cocoa/55 md:to-transparent" />

      <div className="mx-auto flex min-h-[88svh] max-w-6xl items-end px-4 pb-14 pt-40 md:min-h-[640px] md:items-center md:justify-end md:px-6 md:py-24">
        <div className="max-w-md text-paper md:text-right">
          <Image
            src="/images/brand/logo.png"
            alt=""
            width={800}
            height={713}
            className="mb-5 h-24 w-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] md:mb-6 md:ml-auto md:h-32"
          />
          <p className="kicker text-lg text-gold-soft">{t.hero.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.2] md:text-5xl">
            {line1}
            <br />
            <span className="text-gold-soft">{line2}</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-sand">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:justify-end">
            <a
              href={whatsappLink(t.hero.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-[1.02]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.hero.ctaWhatsapp}
            </a>
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full border border-gold-soft/70 px-6 py-3 font-medium text-gold-soft transition-colors hover:bg-gold-soft/10"
            >
              {t.hero.ctaProducts}
            </a>
          </div>
        </div>
      </div>
      <div className="tile-band" />
    </section>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm5.8 14.13c-.24.68-1.42 1.31-1.95 1.36-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.1-1.47-1.1-2.81 0-1.34.7-2 .96-2.27.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.6.46.23.54.77 1.88.84 2.02.07.13.11.3.02.48-.09.18-.13.29-.27.45-.13.16-.28.36-.4.48-.13.13-.27.28-.12.55.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.43.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.88.27.13.45.2.51.31.07.11.07.65-.17 1.32z" />
    </svg>
  );
}
