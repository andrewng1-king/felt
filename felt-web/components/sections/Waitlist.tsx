"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { finalCta, site } from "@/content/site";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    // Front-end only for now. Wire this to your backend or a form service.
    await new Promise((r) => setTimeout(r, 700));
    setStatus("success");
  }

  return (
    <section id="waitlist" className="border-t border-stone-200/70 bg-accent/10 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-stone-900 sm:text-4xl lg:text-[2.75rem]">
          {finalCta.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-stone-600">
          {finalCta.body}
        </p>

        {status === "success" ? (
          <div className="mx-auto mt-10 flex items-center justify-center gap-2 text-accent-strong">
            <CheckCircle size={22} weight="fill" />
            <p className="font-medium">You&apos;re on the list. We&apos;ll be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="email" className="sr-only">
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 active:translate-y-px disabled:opacity-60"
              >
                {status === "loading" ? "Joining..." : site.cta}
              </button>
            </div>
            {status === "error" && (
              <p className="mt-3 text-left text-sm text-red-600">
                Please enter a valid email address.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
