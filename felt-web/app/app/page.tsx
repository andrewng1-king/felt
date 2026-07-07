import type { Metadata } from "next";
import { Shell } from "@/components/platform/Shell";

export const metadata: Metadata = {
  title: "felt. — workspace demo",
  description:
    "An interactive demo of the felt. platform: Andrew's 1:1 history across two relationships, with live reports, trends, and risk signals. Sample data.",
};

export default function AppPage() {
  return <Shell />;
}
