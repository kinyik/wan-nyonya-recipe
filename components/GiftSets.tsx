"use client";

import data from "@/data/products.json";
import settings from "@/data/settings.json";
import { useLang, whatsappLink } from "@/lib/i18n";
import { KuihImage, SectionHeading } from "./ui";
import AddToCart from "./AddToCart";

export default function GiftSets() {
  const { t, lang } = useLang();
  return (
    <section className="tile-bg bg-cocoa px-4 py-20 text-paper md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker={t.sets.kicker} title={t.sets.title} subtitle={t.sets.subtitle} dark />
        <div className="grid gap-5 sm:grid-cols-2">
          {data.sets.map((s) => (
            <article key={s.id} className="flex flex-col overflow-hidden rounded-2xl bg-bark/60 ring-1 ring-gold/25 md:flex-row">
              <KuihImage
                src={s.image}
                alt={s.name[lang]}
                position={s.imagePosition}
                sizes="(min-width: 768px) 25vw, 100vw"
                className="aspect-[16/10] md:aspect-auto md:w-2/5"
              />
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="font-serif text-xl font-bold text-gold-soft">{s.name[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand">{s.desc[lang]}</p>
                <p className="mt-3 text-sm text-sand/80">
                  {t.sets.serves}
                  {lang === "zh" ? "：" : ": "}
                  <span className="text-paper">{s.serves[lang]}</span>
                </p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  <span className="font-display text-3xl font-semibold text-paper">
                    {settings.currency}
                    {s.price}
                  </span>
                  <AddToCart id={s.id} label={t.sets.add} dark />
                </div>
                <a
                  href={whatsappLink(`${t.hero.whatsappGreeting} ${s.name[lang]}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 self-end text-xs text-sand/80 underline underline-offset-4 hover:text-gold-soft"
                >
                  {t.sets.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
