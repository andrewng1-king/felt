"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { finalCta, site } from "@/content/site";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Waitlist() {
  const reduce = useReducedMotion();
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
    <section id="waitlist" className="border-t border-line bg-accent/10 px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
          {finalCta.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          {finalCta.body}
        </p>

        {status === "success" ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-10 flex items-center justify-center gap-2 text-accent-strong"
          >
            <motion.span
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <CheckCircle size={22} weight="fill" />
            </motion.span>
            <p className="font-medium">You&apos;re on the list. We&apos;ll be in touch.</p>
          </motion.div>
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
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background outline-none transition duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_12px_26px_-12px_rgba(26,23,18,0.6)] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:opacity-60"
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
