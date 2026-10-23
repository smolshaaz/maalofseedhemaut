"use client";

import { useState } from "react";
import { ArrowIcon } from "./Icons";

const TO = "orders@seedhemaut.com";
const REASONS = ["Orders / Delivery / Returns", "Fans", "Press", "Collab", "Bookings"];
const field =
  "h-12 w-full rounded-2xl border border-ink/10 bg-paper/70 px-4 text-[15px] outline-none transition-colors placeholder:text-ink/35 focus:border-ink/40 focus:bg-paper";

// No server endpoint: the form composes an email in the visitor's own mail app.
export function ContactForm() {
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim().slice(0, 2000);
    const email = get("email");
    const reason = get("reason");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("That email doesn't look right.");
    if (!REASONS.includes(reason)) return setError("Pick what this is about.");
    if (!get("comment")) return setError("Say something first.");
    setError("");
    const body = [`Name: ${get("name")}`, `Email: ${email}`, `Phone: ${get("phone")}`, "", get("comment")].join("\n");
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(`[${reason}] MAAL enquiry`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} noValidate className="glass flex flex-col gap-3 rounded-[28px] p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-ink/60">
          Name
          <input name="name" autoComplete="name" maxLength={120} className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-ink/60">
          Email *
          <input name="email" type="email" required autoComplete="email" maxLength={200} className={field} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-ink/60">
        Phone
        <input name="phone" type="tel" autoComplete="tel" maxLength={30} className={field} />
      </label>
      <fieldset>
        <legend className="mb-1.5 text-[12px] font-semibold text-ink/60">About *</legend>
        <div className="flex flex-wrap gap-1.5">
          {REASONS.map((r, i) => (
            <label key={r} className="cursor-pointer">
              <input type="radio" name="reason" value={r} defaultChecked={i === 0} className="peer sr-only" />
              <span className="block rounded-full bg-ink/[0.06] px-3.5 py-2 text-[13px] font-semibold transition-colors peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2">
                {r}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-ink/60">
        Message *
        <textarea name="comment" rows={5} maxLength={2000} required className={`${field} h-auto resize-none py-3`} />
      </label>
      <p role="alert" className="min-h-5 text-[13px] font-medium text-red">
        {error}
      </p>
      <button type="submit" className="flex h-12 items-center justify-between rounded-full bg-ink pl-5 pr-1.5 text-[15px] font-semibold text-paper transition-transform active:scale-[0.98]">
        Write to us
        <span className="grid size-9 place-items-center rounded-full bg-white/15">
          <ArrowIcon />
        </span>
      </button>
    </form>
  );
}
