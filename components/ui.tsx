import Image from "next/image";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  dark = false,
  center = true,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 md:mb-14 ${center ? "text-center mx-auto" : ""} max-w-2xl`}>
      <p className={`kicker text-lg md:text-xl ${dark ? "text-gold-soft" : "text-nyonya"}`}>{kicker}</p>
      <h2
        className={`mt-2 font-serif text-3xl md:text-4xl font-bold leading-tight ${
          dark ? "text-paper" : "text-cocoa"
        }`}
      >
        {title}
      </h2>
      <div className={`mt-4 flex items-center gap-2 ${center ? "justify-center" : ""}`} aria-hidden="true">
        <span className="h-px w-10 bg-gold" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px w-10 bg-gold" />
      </div>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${dark ? "text-sand" : "text-bark"}`}>{subtitle}</p>
      )}
    </div>
  );
}

/** 图片框：可用 position + zoom 从分镜图里裁一块当示意图 */
export function KuihImage({
  src,
  alt,
  position = "50% 50%",
  zoom = 1,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  position?: string;
  zoom?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  // 还没有照片：先放一张淡淡的 logo，等真实照片补上
  if (!src) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-blush/40 ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        <Image src="/images/brand/logo.png" alt="" width={800} height={713} className="h-auto w-1/2 max-w-40 opacity-60" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: position, transform: `scale(${zoom})`, transformOrigin: position }}
      />
    </div>
  );
}
