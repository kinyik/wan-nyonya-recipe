"use client";

import { useLang } from "@/lib/i18n";
import { SectionHeading } from "./ui";

export default function FAQ() {
  const { t } = useLang();
  return (
    <section className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading kicker={t.faq.kicker} title={t.faq.title} />
        <div className="divide-y divide-sand border-y border-sand">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-2xl font-normal text-gold transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-bark">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
