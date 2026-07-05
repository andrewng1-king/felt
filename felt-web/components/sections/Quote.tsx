import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { quote } from "@/content/site";

export function Quote() {
  return (
    <section className="border-t border-zinc-200 px-6 py-24 lg:py-32">
      <Reveal className="mx-auto max-w-4xl">
        <blockquote className="text-2xl font-medium leading-snug tracking-tight text-zinc-900 sm:text-3xl">
          &ldquo;{quote.body}&rdquo;
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-zinc-200">
            <Image
              src="https://picsum.photos/seed/felt-marisol/120/120"
              alt={quote.name}
              fill
              sizes="48px"
              className="img-editorial object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-zinc-900">{quote.name}</p>
            <p className="text-zinc-500">{quote.role}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
