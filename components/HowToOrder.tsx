"use client";

import { fill, useLang } from "@/lib/i18n";
import { SectionHeading } from "./ui";

export default function HowToOrder() {
  const { t, lang } = useLang();
  const rules = [t.howto.rules.lead, t.howto.rules.min, t.howto.rules.pickup, t.howto.rules.delivery];

  return (
    <section id="how-to-order" className="bg-blush/40 px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker={t.howto.kicker} title={t.howto.title} />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.howto.steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl bg-paper p-6 ring-1 ring-sand">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nyonya font-display text-xl font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-bark">{fill(s.desc, lang)}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border border-dashed border-gold bg-paper/70 p-6">
          <h3 className="font-serif text-lg font-bold">{t.howto.rulesTitle}</h3>
          <ul className="mt-3 grid gap-2 text-sm text-bark sm:grid-cols-2">
            {rules.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                {fill(r, lang)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
