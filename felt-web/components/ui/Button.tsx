import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition active:translate-y-px whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-emerald-700 text-white hover:bg-emerald-800",
  ghost: "border border-zinc-300 text-zinc-900 hover:bg-zinc-900/5",
};

type Props = {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

/** Link styled as a button. Build CTAs from this, not raw anchors. */
export function Button({ href, variant = "primary", className, children }: Props) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
