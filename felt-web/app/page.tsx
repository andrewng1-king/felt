import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { Metrics } from "@/components/sections/Metrics";
import { Quote } from "@/components/sections/Quote";
import { Differentiators } from "@/components/sections/Differentiators";
import { Pricing } from "@/components/sections/Pricing";
import { Waitlist } from "@/components/sections/Waitlist";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Solution />
        <Metrics />
        <Quote />
        <Differentiators />
        <Pricing />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
