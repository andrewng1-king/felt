import type { Metadata } from "next";
import { Console } from "@/components/console/Console";

export const metadata: Metadata = {
  title: "felt. — Console",
  description:
    "Concierge console: turn a real 1:1 transcript into The Read. The tool that powers the hand-run Reads.",
};

export default function ConsolePage() {
  return <Console />;
}
