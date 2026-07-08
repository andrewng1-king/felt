import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

const base =
  "group inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium whitespace-nowrap transition duration-300 active:translate-y-px outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_12px_26px_-12px_rgba(26,23,18,0.6)]",
  ghost: "border border-line text-foreground hover:-translate-y-0.5 hover:bg-foreground/5",
};

type Props = {
  href: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

/** Link styled as a button. Build CTAs from this, not raw anchors. */
export function Button({ href, variant = "primary", className, onClick, children }: Props) {
  return (
    <Link href={href} onClick={onClick} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
