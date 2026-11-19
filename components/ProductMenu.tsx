"use client";

import data from "@/data/products.json";
import settings from "@/data/settings.json";
import { money } from "@/lib/catalog";
import { useLang } from "@/lib/i18n";
import { KuihImage, SectionHeading } from "./ui";
import AddToCart from "./AddToCart";

export default function ProductMenu() {
  const { t, lang } = useLang();
  return (
    <section id="products" className="bg-paper px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker={t.menu.kicker} title={t.menu.title} subtitle={t.menu.subtitle} />
        {/* 用 flex 排：最后一行不满时置中（7 款 = 桌面 4 + 3，手机 2 + 2 + 2 + 1） */}
        <ul className="flex flex-wrap justify-center gap-3 sm:gap-5">
          {data.products.map((p) => (
            <li
              key={p.id}
              className="flex w-[calc(50%-0.375rem)] flex-col overflow-hidden rounded-2xl bg-cream ring-1 ring-sand sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
            >
              <div className="relative">
                <KuihImage
                  src={p.image}
                  alt={p.name[lang]}
                  position={"imagePosition" in p ? p.imagePosition : undefined}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="aspect-square"
                />
                {settings.samplePhotos && p.image && (
                  <span className="absolute left-2 top-2 rounded-full bg-cocoa/70 px-2 py-0.5 text-[11px] text-paper backdrop-blur">
                    {t.menu.sample}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <h3 className="font-serif text-lg font-bold leading-snug sm:text-xl">{p.name[lang]}</h3>
                <p className="kicker mt-0.5 text-[15px] text-clay">
                  {p.malay}
                  {lang === "zh" && <span className="hidden sm:inline"> · {p.name.en}</span>}
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="font-display text-2xl font-semibold text-nyonya-deep">
                    {settings.currency}
                    {money(p.price)}
                  </span>
                  <span className="text-right text-xs text-bark sm:text-sm">{p.unit[lang]}</span>
                </div>
                {"note" in p && p.note && <p className="mt-1.5 text-xs leading-relaxed text-clay">{p.note[lang]}</p>}
                <div className="mt-4">
                  <AddToCart id={p.id} label={t.menu.add} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
