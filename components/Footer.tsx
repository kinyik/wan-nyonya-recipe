"use client";

import settings from "@/data/settings.json";
import { useLang, whatsappLink } from "@/lib/i18n";
import Image from "next/image";
import { WhatsAppIcon } from "./Hero";

/** 60122984655 → +60 12-298 4655（马来西亚手机号的常见写法） */
function formatPhone(n: string) {
  const m = n.match(/^60(1\d)(\d{3,4})(\d{4})$/);
  return m ? `+60 ${m[1]}-${m[2]} ${m[3]}` : `+${n}`;
}

export default function Footer() {
  const { t, lang } = useLang();
  // 只显示已经填了链接的社交平台
  const socials = (
    [
      ["Instagram", settings.socials.instagram],
      ["Facebook", settings.socials.facebook],
      ["TikTok", settings.socials.tiktok],
    ] as const
  ).filter(([, href]) => href.trim() !== "");
  const phone = formatPhone(settings.whatsappNumber);

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
          {socials.length > 0 && (
            <>
              <h3 className="mt-5 font-serif font-bold text-gold-soft">{t.footer.followLabel}</h3>
              <div className="mt-2 flex gap-4 text-sm">
                {socials.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                    {label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <p className="border-t border-bark px-4 py-5 text-center text-xs text-sand/70">
        © {new Date().getFullYear()} {t.brand.name} {t.brand.en}. {t.footer.rights}
      </p>
    </footer>
  );
}
