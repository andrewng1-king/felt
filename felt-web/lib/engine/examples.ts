/**
 * GOLD EXAMPLES — the highest-leverage tuning surface in the whole engine.
 *
 * This is the "training" that matters at this stage: a handful of example
 * transcript -> ideal Read pairs the model learns felt.'s voice from. It is NOT
 * fine-tuning and NOT RAG — it is few-shot, and it should be edited BY THE
 * FOUNDER. When a live Read comes back slightly off, fix it here (or add a new
 * example) rather than wrestling the rules in prompt.ts.
 *
 * Coverage to aim for (the one-pager's "15-20 example lines before code"):
 *   - cold start (session 1: no reminder, no pattern line)   -> Example A below
 *   - warming streak (history-aware: reminder + identity)    -> Example B below
 *   - a cost/regression with the Mirror-Rule "unless you" line -> Example C below
 *   - a low-signal / "all good" session that stays honest    -> Example D below
 *
 * Four cases are seeded. Keep going toward the 15-20 line target: varied
 * pronouns, a genuine turnaround (a down streak that breaks up), a manager who
 * over-talks, a report who's halfway out the door. Each one is your taste, encoded.
 *
 * Each example carries the FACTS block it was written against, so the model
 * learns how to USE the ground-truth counts, not just the prose voice.
 */

import type { ReadResult } from "./types";

export type GoldExample = {
  label: string;
  /** The ground-truth facts this example was written against. */
  factsNote: string;
  transcript: string;
  ideal: ReadResult;
};

export const goldExamples: GoldExample[] = [
  {
    label: "A — cold start, cooled",
    factsNote:
      "Session number: 1 (COLD START). No prior history — no streaks, no reminder, no pattern line. Do not claim any 'N of the last M'.",
    transcript: `[00:40] Andrew: How are you finding the new scope so far?
[00:55] Daniel: Honestly, it's a lot. Still finding my feet.
[01:10] Andrew: Walk me through what's actually on your plate right now.
[01:22] Daniel: The migration, the on-call rotation, and now the new dashboards. It keeps stacking up.
[06:10] Andrew: Right, but that's just how the timeline works, so we'll make it happen.
[06:24] Daniel: ...Sure. Okay.
[10:30] Daniel: I guess it's fine.
[11:30] Andrew: Anyway — you've got this.
[11:38] Daniel: Thanks. I think we're good, right?`,
    ideal: {
      segments: [
        { t: "Your opening landed. At 0:40 you asked how he's finding the new scope — and you meant it, so he started to open up about the workload. Then at 6:10 you said " },
        { t: "“that's just how the timeline works,”", em: true },
        { t: " and he went quiet — he never brought the real worry back up, and " },
        { t: "“I guess it's fine”", em: true },
        { t: " at 10:30 was him closing the drawer. He left more guarded than he arrived." },
      ],
      direction: "down",
      directionLabel: "Cooled this session",
      win: "At 0:40 you asked how he's finding the new scope — openly, and you meant it. He started to open up.",
      reminder: null,
      identityPraise: null,
      patternLine: null,
      quote: null,
      metrics: [
        { name: "How It Landed", phase: "Post", state: "Warmed early, dropped hard at 6:10, never recovered.", tone: "cool" },
        { name: "Quiet / Drop-off Signal", phase: "Post", state: "He stopped engaging with the workload the moment the timeline line landed.", tone: "cool" },
        { name: "Active Listening", phase: "Post", state: "You filled the silence after 6:10 instead of holding it.", tone: "cool", reframe: "A door, not a fail — next time, one more question before you answer." },
      ],
      signals: {
        openingStyle: "question-first",
        engagementTrend: "down",
        heldPause: false,
        acknowledgedBeforeSolving: false,
        topicsDropped: ["the timeline worry", "workload"],
      },
    },
  },
  {
    label: "B — warming streak, history-aware",
    factsNote:
      "Session number: 3. Coming in, she is on a 2-session warming streak (last two both 'up'). Today is another win -> 3 in a row, so identity praise is permitted. Reminder allowed (session 2+). Prior openings: [s1: status-first -> ended colder] [s2: question-first]. Today's opening is question-first.",
    transcript: `[01:20] Andrew: What's actually on your mind this week? No agenda — you lead.
[01:35] Priya: Okay. There's something I've been sitting on, actually.
[04:20] Andrew: (stays quiet, lets the pause sit)
[04:40] Priya: ...The activation numbers. I think onboarding is the real problem, not the channel mix. I've been afraid to say it because it's my area.
[07:10] Andrew: What would make it easier to own that?
[07:30] Priya: Honestly? Just knowing you'd back the rebuild.`,
    ideal: {
      segments: [
        { t: "Open from the first minute. At 1:20 you asked " },
        { t: "“what's actually on your mind this week?”", em: true },
        { t: " — no preamble — and she trusted it straight away. Then at 4:20 you held the pause instead of filling it, and she named the activation problem she'd been sitting on for weeks. That's the third session running you've opened with a question and let her lead — it's compounding." },
      ],
      direction: "up",
      directionLabel: "Warmer — third strong session",
      win: "At 4:20 you let the silence sit instead of filling it — and she filled it with the thing she'd been circling for weeks.",
      reminder: "The same pause that worked last session showed up again at 4:20.",
      identityPraise: "Three sessions in a row you've led with a question before a statement. You're building real safety with her — that's a pattern now, not luck.",
      patternLine: "Every time you've opened with a question and held the pause, she has gone deeper. Keep opening that way and this keeps compounding.",
      quote: null,
      metrics: [
        { name: "How It Landed", phase: "Post", state: "Open from the start and rising through the end.", tone: "warm" },
        { name: "Active Listening", phase: "Post", state: "You asked, then waited. She did most of the talking.", tone: "warm" },
        { name: "Validation Index", phase: "Post", state: "You made room before weighing in. She felt it.", tone: "warm" },
      ],
      signals: {
        openingStyle: "question-first",
        engagementTrend: "up",
        heldPause: true,
        acknowledgedBeforeSolving: true,
        topicsDropped: [],
      },
    },
  },
  {
    label: "C — a cost, with the Mirror-Rule line",
    factsNote:
      "Session number: 4. Prior directions (oldest -> newest): down, up, down — he comes in already cooled once, and today also lands 'down' (2 in a row). Prior openings: [s1: status-first -> ended colder] [s2: question-first] [s3: status-first -> ended colder]. Today's opening is status-first AGAIN — so of the 2 past status-first opens, BOTH ended colder: the only honest mirror count is 2 of 2 (sessions 1 and 3). Reminder allowed (session 2+). identityPraise NOT allowed (this is not a warming streak). The win is still mandatory — find the one true good beat even though the session cooled.",
    transcript: `[00:15] Andrew: Before anything else — the Q3 gap. We're 40% behind on the migration and the board reviews Friday. Where are we?
[00:31] Marcus: We hit a blocker on the auth service last week. I flagged it in standup.
[00:44] Andrew: Right, but Friday isn't moving. What's the plan to close it?
[00:58] Marcus: I mean... I could pull the timeline in. I'd have to drop the test-coverage work.
[01:20] Andrew: Whatever gets us to Friday.
[04:30] Andrew: Look — the auth thing, that was a real catch. You flagged it early, that helped.
[04:42] Marcus: Thanks. Yeah.
[07:15] Andrew: So we're aligned? Pull it in, ship Friday?
[07:22] Marcus: ...Sure. I'll make it work.
[07:31] Marcus: We're good.`,
    ideal: {
      segments: [
        { t: "You opened at 0:15 straight into the Q3 gap and Friday, and Marcus went narrow — defending the process instead of thinking it through with you. By 7:22 the " },
        { t: "“…Sure. I'll make it work,”", em: true },
        { t: " and " },
        { t: "“we're good”", em: true },
        { t: " were him closing the drawer, not agreeing to anything. The beat that landed was 4:30, where you named the catch — " },
        { t: "“you flagged it early, that helped”", em: true },
        { t: " — and for a moment he was back in the room. Worth remembering: the one session you opened by asking what was on his mind, he handed you the blocker himself." },
      ],
      direction: "down",
      directionLabel: "Cooled — same open as before",
      win: "At 4:30 you named the auth catch specifically — “you flagged it early, that helped.” The one moment you gave him credit instead of chasing Friday.",
      reminder: "The one time you opened by asking what was on his mind, he brought you the real blocker without being pushed.",
      identityPraise: null,
      patternLine: "Opening straight into the numbers has cooled the room both times you've done it — sessions 1 and 3. Unless you change how you start, this one goes the same way.",
      quote: null,
      metrics: [
        { name: "How It Landed", phase: "Post", state: "Warm for a beat at 4:30; narrow and guarded on either side of it.", tone: "cool" },
        { name: "Quiet / Drop-off Signal", phase: "Post", state: "After 0:15 he switched from thinking with you to defending the process, then closed with “we're good.”", tone: "cool" },
        { name: "Active Listening", phase: "Post", state: "You moved to the fix at 0:44 before hearing the blocker out.", tone: "cool", reframe: "The 4:30 acknowledgment is the move — start there next time, not at the deadline." },
      ],
      signals: {
        openingStyle: "status-first",
        engagementTrend: "down",
        heldPause: false,
        acknowledgedBeforeSolving: false,
        topicsDropped: ["the auth blocker", "the test-coverage tradeoff"],
      },
    },
  },
  {
    label: "D — low signal, stays honest",
    factsNote:
      "Session number: 2. Prior direction: up (one prior win). Today lands 'steady' — a genuinely low-signal, 'all good' check-in. There is NO basis for a pattern line and nothing to manufacture: no cost, no streak claim, no mirror. Reminder is allowed (session 2+) but here the honest move is to skip it. The lesson of this example: when the signal is thin, SAY so, name the one small true win, read it steady, and stop — do not invent drama to fill the page.",
    transcript: `[00:20] Andrew: How's the week?
[00:24] Sam: Yeah, good. Steady. Shipped the export fix, cleared the review queue.
[00:40] Andrew: Nice. Anything getting in the way?
[00:48] Sam: Not really. Quiet one. Waiting on design for the next thing, but that's on track.
[02:10] Andrew: Cool. Anything you want from me?
[02:18] Sam: Don't think so. All good.
[02:30] Andrew: Alright, short and sweet. Ping me if design slips.
[02:36] Sam: Will do.`,
    ideal: {
      segments: [
        { t: "A quiet one — and the Read is quiet to match. There's not much signal in three minutes of " },
        { t: "“all good,”", em: true },
        { t: " so I won't read a trend into it that isn't there. What's real: at 0:40 and 2:10 you asked what was getting in the way and what Sam needed from you, and you left the space open instead of filling it with an agenda. Sam stayed easy and even the whole way through — no pulling back, but nothing cracked open either. Nothing to fix here; just know a week this light won't tell you much, so the Read that counts is the next one, when something's actually at stake." },
      ],
      direction: "steady",
      directionLabel: "Steady — a light week",
      win: "At 0:40 and 2:10 you asked what was in Sam's way and what they needed from you, and didn't crowd the answer. On a quiet week you still kept the door open.",
      reminder: null,
      identityPraise: null,
      patternLine: null,
      quote: null,
      metrics: [
        { name: "How It Landed", phase: "Post", state: "Easy and even — no warming, no cooling to read.", tone: "mixed" },
        { name: "Signal Strength", phase: "Post", state: "Thin. Three minutes, nothing at stake — too little to call a trend from.", tone: "mixed" },
        { name: "Open Door", phase: "Post", state: "You asked twice what Sam needed and didn't rush the reply.", tone: "warm" },
      ],
      signals: {
        openingStyle: "question-first",
        engagementTrend: "steady",
        heldPause: false,
        acknowledgedBeforeSolving: true,
        topicsDropped: [],
      },
    },
  },
];
