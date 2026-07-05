/** Site copy kept as data, separate from the components that render it. */

export const site = {
  name: "felt.",
  email: "hello@felt.app",
  nav: [
    { label: "The problem", href: "#problem" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
  ],
  cta: "Join the waitlist",
} as const;

export const hero = {
  eyebrow: "Conversation intelligence for 1:1s",
  headline: "The feedback your people can't give you.",
  subtext:
    "felt. reads your most important 1:1s and shows you what your best people felt but couldn't say to your face.",
  secondaryCta: "See how it works",
  secondaryHref: "#how",
} as const;

export const problem = {
  heading: "Your best people form an opinion after every conversation. You only hear it when they resign.",
  body: "The power gap makes honesty unsafe. So the manager guesses, the employee holds back, and trust erodes quietly.",
  points: [
    "HR tools measure the damage after someone quits. None of them prevent the conversation that caused it.",
    "Human coaching runs $300 to $500 a month, moves slowly, and never scales to every hard 1:1.",
    "No tool gives a manager the feedback their employee could not safely say out loud.",
  ],
} as const;

export const solution = {
  heading: "Prepare before. Understand after. Improve over time.",
  phases: [
    {
      tag: "Before",
      title: "Rehearse the hard talk",
      body: "Role-play the conversation with AI, stress-test your phrasing, and get a readiness score before you walk in.",
    },
    {
      tag: "After",
      title: "See how you actually landed",
      body: "The Empathy Mirror shows what the other person likely felt, and the exact moment things shifted.",
    },
    {
      tag: "Over time",
      title: "Catch trust before it breaks",
      body: "Track your blind spots across conversations and see when a relationship is quietly starting to erode.",
    },
  ],
} as const;

export const metrics = {
  heading: "Three signals no other tool can read.",
  items: [
    {
      name: "Empathy Mirror",
      phase: "Post",
      body: "How the other person likely felt. The only metric on the market that reads the employee, not the manager.",
      featured: true,
    },
    {
      name: "Unspoken Concern Signal",
      phase: "Post",
      body: "What they did not say, but probably wanted to.",
      featured: false,
    },
    {
      name: "Risk Signals",
      phase: "Longitudinal",
      body: "Whether trust in this relationship is quietly eroding.",
      featured: false,
    },
  ],
} as const;

export const quote = {
  body: "After every important 1:1, it shows me how I really landed. Not what I think happened, but what it actually picked up.",
  name: "Marisol Vent",
  role: "VP People, Halden Robotics",
} as const;

export const differentiators = {
  heading: "Every other tool grades you. felt. reads them.",
  body: "Kona, 15Five, and Gong all tell you how you performed. felt. tells you how they felt. Different product, different category.",
  points: [
    "Reads voice, tone, and transcript together. Not just the words, but what they triggered.",
    "Built only for internal 1:1s. Not sales calls, not standups. The conversations that keep good people or lose them.",
  ],
} as const;

export const pricing = {
  heading: "Priced for the person who feels the pain.",
  tiers: [
    {
      name: "Individual",
      price: "$25",
      cadence: "/month",
      pitch: "For the manager who expenses it and tells a colleague.",
      features: ["Pre and post conversation analysis", "All 11 conversation metrics", "Personal blind-spot trends"],
      featured: false,
    },
    {
      name: "Team",
      price: "$45",
      cadence: "/seat/month",
      pitch: "For a Head of People rolling it out to managers.",
      features: ["Everything in Individual", "Anonymous team benchmarks", "Shared risk signals"],
      featured: true,
    },
    {
      name: "Executive",
      price: "$75",
      cadence: "/month",
      pitch: "For founders and C-level. Fewer conversations, higher stakes.",
      features: ["Everything in Team", "Priority relationship memory", "Guided onboarding"],
      featured: false,
    },
  ],
} as const;

export const finalCta = {
  heading: "Know how you really land.",
  body: "Join the waitlist and be among the first teams to try felt.",
} as const;
