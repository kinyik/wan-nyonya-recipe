"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import settings from "@/data/settings.json";
import { catalog } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { fill, useLang } from "@/lib/i18n";
import { buildOrderMessage, earliestDate, orderWhatsappUrl, type OrderForm } from "@/lib/order";
import { QtyStepper } from "./AddToCart";
import { WhatsAppIcon } from "./Hero";

type Errors = Partial<Record<keyof OrderForm, string>>;

const emptyForm: OrderForm = { name: "", phone: "", method: "pickup", address: "", date: "", note: "" };

export function BasketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10h18l-1.6 8.2a2 2 0 0 1-2 1.6H6.6a2 2 0 0 1-2-1.6L3 10z" />
      <path d="M7.5 10 11 4M16.5 10 13 4M9 14v2.5M12 14v2.5M15 14v2.5" />
    </svg>
  );
}

/** 有东西在购物篮时，左下角出现的小条 */
function CartBar() {
  const { count, total, open, isOpen } = useCart();
  const { t } = useLang();
  if (count === 0 || isOpen) return null;
  return (
    <button
      type="button"
      onClick={open}
      className="fixed bottom-5 left-4 z-40 flex items-center gap-3 rounded-full bg-cocoa py-2.5 pl-4 pr-5 text-paper shadow-xl ring-1 ring-gold/50 transition-transform hover:scale-[1.02] md:left-6"
    >
      <span className="relative">
        <BasketIcon className="h-6 w-6 text-gold-soft" />
        <span className="absolute -right-2 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-nyonya px-1 text-[11px] font-bold">
          {count}
        </span>
      </span>
      <span className="text-sm font-medium">
        {t.cart.open} · {settings.currency}
        {total}
      </span>
    </button>
  );
}

function Field({ label, error, children, htmlFor }: { label: string; error?: string; children: React.ReactNode; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-cocoa">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-nyonya-deep">{error}</p>}
    </div>
  );
}

const inputCls = (bad?: string) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-base text-cocoa outline-none transition-colors placeholder:text-clay/50 focus:border-nyonya focus:ring-2 focus:ring-nyonya/20 ${
    bad ? "border-nyonya-deep" : "border-sand"
  }`;

function CartPanel() {
  const { lines, total, setQty, clear, close, isOpen } = useCart();
  const { t, lang } = useLang();
  const [form, setForm] = useState<OrderForm>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeFn = useRef(close);
  closeFn.current = close;
  const earliest = earliestDate();

  // 打开时：焦点放到关闭按钮、背景不能滚动、按 Esc 关闭
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeFn.current();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const short = Math.max(0, settings.minOrder - total);
  const set = <K extends keyof OrderForm>(k: K, v: OrderForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = t.cart.required;
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) e.phone = t.cart.required;
    else if (digits.length < 9 || digits.length > 13) e.phone = t.cart.phoneInvalid;
    if (form.method === "delivery" && !form.address.trim()) e.address = t.cart.required;
    if (!form.date) e.date = t.cart.required;
    else if (form.date < earliest) e.date = t.cart.dateTooEarly.replace("{earliest}", earliest);
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`order-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const url = orderWhatsappUrl(buildOrderMessage(lines, form));
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  const finish = () => {
    clear();
    setForm(emptyForm);
    setSentUrl(null);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button type="button" className="absolute inset-0 bg-cocoa/50 backdrop-blur-[2px]" onClick={close} aria-label={t.cart.close} tabIndex={-1} />

      <div className="relative flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <header className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 id="cart-title" className="flex items-center gap-2 font-serif text-xl font-bold">
            <BasketIcon className="h-6 w-6 text-nyonya" />
            {t.cart.title}
          </h2>
          <button ref={closeRef} type="button" onClick={close} className="-mr-2 p-2 text-bark hover:text-cocoa" aria-label={t.cart.close}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {sentUrl ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppIcon className="h-9 w-9" />
            </span>
            <h3 className="font-serif text-2xl font-bold">{t.cart.sentTitle}</h3>
            <p className="leading-relaxed text-bark">{t.cart.sentBody}</p>
            <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-nyonya-deep underline underline-offset-4">
              {t.cart.reopen}
            </a>
            <button type="button" onClick={finish} className="mt-4 rounded-full bg-cocoa px-6 py-2.5 text-sm font-medium text-paper hover:bg-bark">
              {t.cart.clear}
            </button>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <BasketIcon className="h-14 w-14 text-sand" />
            <p className="text-bark">{t.cart.empty}</p>
            <a href="#products" onClick={close} className="rounded-full bg-nyonya px-6 py-2.5 text-sm font-medium text-white hover:bg-nyonya-deep">
              {t.cart.browse}
            </a>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* 订单内容 */}
              <ul className="divide-y divide-sand">
                {lines.map((l) => {
                  const item = catalog[l.id];
                  return (
                    <li key={l.id} className="flex items-center gap-3 py-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-sand">
                        <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif font-bold">{item.name[lang]}</p>
                        <p className="text-sm text-clay">
                          {settings.currency}
                          {item.price} × {l.qty} ={" "}
                          <span className="font-medium text-cocoa">
                            {settings.currency}
                            {item.price * l.qty}
                          </span>
                        </p>
                      </div>
                      <div className="w-[112px] shrink-0">
                        <QtyStepper id={l.id} qty={l.qty} onChange={setQty} labels={t.cart} />
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* 取货资料 */}
              <h3 className="mt-6 font-serif text-lg font-bold">{t.cart.detailsTitle}</h3>
              <div className="mt-3 space-y-4">
                <Field label={t.cart.name} error={errors.name} htmlFor="order-name">
                  <input id="order-name" autoComplete="name" className={inputCls(errors.name)} value={form.name} onChange={(e) => set("name", e.target.value)} />
                </Field>
                <Field label={t.cart.phone} error={errors.phone} htmlFor="order-phone">
                  <input
                    id="order-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={t.cart.phonePlaceholder}
                    className={inputCls(errors.phone)}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </Field>

                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium text-cocoa">{t.cart.method}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(["pickup", "delivery"] as const).map((m) => (
                      <label
                        key={m}
                        className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nyonya/30 ${
                          form.method === m ? "border-nyonya bg-blush/50 text-nyonya-deep" : "border-sand bg-white text-bark"
                        }`}
                      >
                        <input type="radio" name="method" value={m} checked={form.method === m} onChange={() => set("method", m)} className="sr-only" />
                        {m === "pickup" ? t.cart.pickup : t.cart.delivery}
                      </label>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-clay">
                    {fill(form.method === "pickup" ? t.cart.pickupInfo : t.cart.deliveryInfo, lang)}
                  </p>
                </fieldset>

                {form.method === "delivery" && (
                  <Field label={t.cart.address} error={errors.address} htmlFor="order-address">
                    <textarea
                      id="order-address"
                      rows={2}
                      autoComplete="street-address"
                      className={inputCls(errors.address)}
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                    />
                  </Field>
                )}

                <Field label={t.cart.date} error={errors.date} htmlFor="order-date">
                  <input id="order-date" type="date" min={earliest} className={inputCls(errors.date)} value={form.date} onChange={(e) => set("date", e.target.value)} />
                  {!errors.date && <p className="mt-1 text-xs text-clay">{fill(t.cart.dateHint, lang).replace("{earliest}", earliest)}</p>}
                </Field>

                <Field label={t.cart.note} htmlFor="order-note">
                  <textarea
                    id="order-note"
                    rows={2}
                    placeholder={t.cart.notePlaceholder}
                    className={inputCls()}
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {/* 底部：总价 + 下单 */}
            <footer className="border-t border-sand bg-cream px-5 pb-5 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-bark">{t.cart.total}</span>
                <span className="font-display text-3xl font-semibold text-nyonya-deep">
                  {settings.currency}
                  {total}
                </span>
              </div>
              {short > 0 && (
                <p className="mt-1 text-right text-xs text-nyonya-deep">
                  {fill(t.cart.minShort, lang).replace("{short}", `${settings.currency}${short}`)}
                </p>
              )}
              <button
                type="submit"
                disabled={short > 0}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-medium text-white shadow-md transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t.cart.confirm}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Cart() {
  return (
    <>
      <CartBar />
      <CartPanel />
    </>
  );
}
