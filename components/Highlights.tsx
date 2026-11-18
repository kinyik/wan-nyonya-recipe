"use client";

import { useLang } from "@/lib/i18n";
import { KuihImage, SectionHeading } from "./ui";

const images = [
  { src: "/images/storyboard/2-product.png", position: "55% 45%" },
  { src: "/images/storyboard/3-texture.png", position: "65% 50%" },
  { src: "/images/storyboard/5-sharing.png", position: "65% 50%" },
];

export default function Highlights() {
  const { t } = useLang();
  return (
    <section className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker={t.highlights.kicker} title={t.highlights.title} />
        <div className="grid gap-6 md:grid-cols-3">
          {t.highlights.items.map((item, i) => (
            <article key={item.title} className="group overflow-hidden rounded-2xl bg-paper shadow-[0_1px_0_rgba(58,36,24,0.06)] ring-1 ring-sand">
              <KuihImage
                src={images[i].src}
                alt={item.title}
                position={images[i].position}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/3]"
              />
              <div className="p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl text-gold">0{i + 1}</span>
                  <h3 className="font-serif text-xl font-bold">{item.title}</h3>
                </div>
                <p className="mt-2 leading-relaxed text-bark">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
