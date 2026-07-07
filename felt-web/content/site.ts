/** Site copy kept as data, separate from the components that render it. */

export const site = {
  name: "felt.",
  email: "hello@felt.app",
  nav: [
    { label: "The problem", href: "#problem" },
    { label: "How it works", href: "#how" },
    { label: "Live demo", href: "/demo" },
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

/**
 * The hero figure's data. An illustrative single 1:1 read second-by-second.
 * `points` are [t (0-1 through the conversation), value (0 guarded - 1 open)].
 * `moments` are the clickable inflection points; each sits on the openness line
 * and reveals what was said, how it landed, and which felt. signal caught it.
 */
export const empathyMirror = {
  label: "Empathy Mirror",
  caption: "How your last 1:1 actually landed, second by second.",
  signals: {
    openness: {
      name: "How they felt",
      points: [
        [0, 0.42],
        [0.15, 0.66],
        [0.32, 0.72],
        [0.5, 0.2],
        [0.68, 0.26],
        [0.85, 0.44],
        [1, 0.4],
      ] as [number, number][],
    },
    voice: {
      name: "Voice warmth",
      points: [
        [0, 0.5],
        [0.2, 0.68],
        [0.42, 0.66],
        [0.58, 0.5],
        [0.75, 0.4],
        [1, 0.46],
      ] as [number, number][],
    },
  },
  moments: [
    {
      t: 0.15,
      value: 0.66,
      at: "0:40 in",
      label: "They warmed up",
      signal: "Empathy Mirror",
      said: "How are you finding the new scope?",
      felt: "Read the question as genuine care. Started to open up.",
    },
    {
      t: 0.5,
      value: 0.2,
      at: "6:10 in",
      label: "The moment it shifted",
      signal: "Unspoken Concern",
      said: "That's just how the timeline works, so we'll make it happen.",
      felt: "Felt dismissed. Went quiet and stopped raising the real worry.",
      shift: true,
    },
    {
      t: 0.85,
      value: 0.44,
      at: "11:30 in",
      label: "Guarded to the end",
      signal: "Risk Signal",
      said: "Anyway, you've got this.",
      felt: "Reassurance landed as a close-off. They left holding back.",
    },
  ],
  read: "They left more guarded than they arrived. You never heard it out loud.",
} as const;

/**
 * Static chrome for the hero's platform preview. Illustrative product UI shown
 * around the interactive Empathy Mirror chart — none of it is clickable except
 * the chart itself. Marked "Example" so it reads as a figure, not a live app.
 */
export const platform = {
  conversation: "1:1 with Daniel K.",
  meta: "Post-conversation · 14 min · voice + transcript",
  nav: ["Conversations", "Empathy Mirror", "Trends", "Risk Signals"],
  stats: [
    { label: "Empathy Mirror", value: "62", trend: "down", note: "vs. your baseline 74" },
    { label: "Unspoken Concern", value: "High", trend: "flag", note: "1 concern held back" },
    { label: "Risk Signal", value: "Rising", trend: "up", note: "trust trending down" },
  ],
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

/**
 * Design-partner offer only. This audience is joining a paid pilot, not buying a
 * subscription — the primary CTA is the Proof of Signal pilot. The post-pilot
 * range is an estimate tied to what we learn together, never a live price.
 */
export const pilot = {
  eyebrow: "For design partners",
  heading: "Proof of Signal Pilot",
  subhead: "A 2-week paid pilot. One agreed success metric. No long-term commitment.",
  detail:
    "$200–300 flat fee. We analyze your real conversations and show you what actually changed.",
  cta: "Apply for a pilot slot",
  after: {
    heading: "What to expect after the pilot",
    body: "If it's valuable, continued access is estimated at $25–45/seat/month, depending on team size. Final pricing will be set based on what we learn together during the pilot. Your pilot fee is credited toward your first month if you continue.",
  },
} as const;

export const finalCta = {
  heading: "Know how you really land.",
  body: "Join the waitlist and be among the first teams to try felt.",
} as const;
