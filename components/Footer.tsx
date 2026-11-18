"use client";

import settings from "@/data/settings.json";
import { useLang, whatsappLink } from "@/lib/i18n";
import Image from "next/image";
import { WhatsAppIcon } from "./Hero";

export default function Footer() {
  const { t, lang } = useLang();
  const phone = `+${settings.whatsappNumber.slice(0, 2)} ${settings.whatsappNumber.slice(2)}`;

  return (
    <footer id="contact" className="bg-cocoa text-sand">
      <div className="tile-band" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <Image src="/images/brand/logo.png" alt={`${t.brand.name} ${t.brand.en}`} width={800} height={713} className="h-28 w-auto" />
          <p className="mt-4 text-sm leading-relaxed">{t.highlights.title}</p>
        </div>
        <div>
          <h3 className="font-serif font-bold text-gold-soft">{t.footer.pickupLabel}</h3>
          <p className="mt-2 text-sm leading-relaxed">{settings.pickup[lang]}</p>
        </div>
        <div>
          <h3 className="font-serif font-bold text-gold-soft">{t.footer.hoursLabel}</h3>
          <p className="mt-2 text-sm leading-relaxed">{settings.hours[lang]}</p>
        </div>
        <div>
          <h3 className="font-serif font-bold text-gold-soft">{t.footer.contactLabel}</h3>
          <a
            href={whatsappLink(t.hero.whatsappGreeting)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-sm hover:text-paper"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            {phone}
          </a>
          <h3 className="mt-5 font-serif font-bold text-gold-soft">{t.footer.followLabel}</h3>
          <div className="mt-2 flex gap-4 text-sm">
            <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-paper">Instagram</a>
            <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-paper">Facebook</a>
            <a href={settings.socials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-paper">TikTok</a>
          </div>
        </div>
      </div>
      <p className="border-t border-bark px-4 py-5 text-center text-xs text-sand/70">
        © {new Date().getFullYear()} {t.brand.name} {t.brand.en}. {t.footer.rights}
      </p>
    </footer>
  );
}
