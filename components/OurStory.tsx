"use client";

import { useLang } from "@/lib/i18n";
import { KuihImage, SectionHeading } from "./ui";

export default function OurStory() {
  const { t } = useLang();
  return (
    <section id="story" className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative">
          <KuihImage
            src="/images/storyboard/4-heritage.png"
            alt=""
            position="30% 50%"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] rounded-t-[999px] rounded-b-2xl ring-1 ring-sand"
          />
          <div className="absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-xl bg-cocoa px-5 py-4 text-center font-serif text-sm leading-relaxed text-gold-soft shadow-xl md:text-base">
            「{t.story.quote}」
          </div>
        </div>
        <div className="pt-6 md:pt-0">
          <SectionHeading kicker={t.story.kicker} title={t.story.title} center={false} />
          <div className="-mt-4 space-y-4 text-base leading-loose text-bark">
            {t.story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
