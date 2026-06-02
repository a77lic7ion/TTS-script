/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScriptPreset {
  id: string;
  title: string;
  subtitle: string;
  rawText: string;
  summary: string;
  refactored: {
    title: string;
    summary: string;
    lines: {
      text: string;
      rule: 'dramatic' | 'contrast' | 'factual' | 'break' | 'none';
      badgeText: string;
    }[];
  }[];
}

export const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    id: "tccd-intro",
    title: "They Can't Come Down — Theme Intro",
    subtitle: "Opening Address to Parents and Children",
    summary: "A heartfelt message highlighting the systemic forces behind screen reliance, calling for mutual understanding over conflict.",
    rawText: "Welcome to They Can't Come Down. Before we begin our first episode, I want to take a moment to speak directly to both the parents and the children listening together. To the parents. Your goal is not to raise a child who fears technology, but to raise a child who masters it. You are navigating an unprecedented landscape, and the guilt you feel is a symptom of a system designed to work against you. The end goal of this series is not to confiscate devices or enforce draconian rules. It is to equip you with the knowledge to dismantle the illusion of the algorithm, and to rebuild your family's attention, connection, and autonomy. To the children and teenagers listening. Your goal is to reclaim your own mind. The frustration you feel when you cannot put your phone down is not a personal failure. It is the result of thousands of engineers working against your developing brain. Together, our shared goal is understanding. We are here to replace conflict with curiosity, and isolation with connection. Let us begin.",
    refactored: [
      {
        title: "OPENING",
        summary: "Introduction to the sequence and a direct address to parents and children.",
        lines: [
          { text: "Welcome to They Can't Come Down.", rule: "none", badgeText: "Theme Greeting" },
          { text: "Before we begin our first episode...", rule: "dramatic", badgeText: "Dramatic Pause" },
          { text: "I want to take a moment to speak directly...", rule: "break", badgeText: "Line Break" },
          { text: "to both the parents and the children listening together.", rule: "none", badgeText: "Connected Thought" }
        ]
      },
      {
        title: "To the Parents",
        summary: "Dismantling the parent guilt aspect and setting goals.",
        lines: [
          { text: "To the parents.", rule: "factual", badgeText: "Factual Period" },
          { text: "Your goal is not to raise a child who fears technology.", rule: "factual", badgeText: "Direct Statement" },
          { text: "It is to raise a child who masters it.", rule: "factual", badgeText: "Declarative Period" },
          { text: "You are navigating an unprecedented landscape...", rule: "dramatic", badgeText: "Ellipsis Action" },
          { text: "and the guilt you feel —", rule: "contrast", badgeText: "Contrast Dash" },
          { text: "is a symptom of a system designed to work against you.", rule: "none", badgeText: "Connected thought" },
          { text: "The end goal of this series is not to confiscate devices or enforce draconian rules.", rule: "factual", badgeText: "Factual Assertion" },
          { text: "It is to equip you with the knowledge to dismantle the illusion...", rule: "dramatic", badgeText: "Dramatic Pause" },
          { text: "and to rebuild your family's attention, connection, and autonomy.", rule: "none", badgeText: "Emotional Resolve" }
        ]
      },
      {
        title: "To the Children",
        summary: "Reassuring teenagers that screen frustration is a systemic outcome.",
        lines: [
          { text: "To the children and teenagers listening.", rule: "factual", badgeText: "Target Address" },
          { text: "Your goal is to reclaim your own mind.", rule: "factual", badgeText: "Clear Directive" },
          { text: "The frustration you feel when you cannot put your phone down...", rule: "dramatic", badgeText: "Vulnerability" },
          { text: "is not a personal failure.", rule: "none", badgeText: "Pacing break" },
          { text: "It is the result of thousands of engineers —", rule: "contrast", badgeText: "Delineation Dash" },
          { text: "working against your developing brain.", rule: "none", badgeText: "Paced delivery" }
        ]
      }
    ]
  },
  {
    id: "ep1-casino",
    title: "Episode 1: The Casino in Your Pocket",
    subtitle: "Dopamine & Dark Patterns",
    summary: "Exposing the slot-machine mechanics that social media uses to compromise teenage willpower.",
    rawText: "Here is a scene you probably know. It is eleven at night. A twelve-year-old is lying in bed. The phone is six inches from their face. They told themselves they would stop after this one video. That was forty minutes ago. They are not even watching anything good now. Just scrolling. Not looking for anything. Just unable to stop. And somewhere, in a glass office in California, an engineer designed that exact feeling. Not by accident. Not as a side effect. They sat in a room and figured out how to make a twelve-year-old unable to put their phone down at eleven at night. And then they shipped it. And then they measured how many kids did exactly that. And then they made it slightly worse the next quarter. That is what we are talking about today.",
    refactored: [
      {
        title: "THE SCENE",
        summary: "Sets up a relatable bedroom environment to invoke deep emotional connection.",
        lines: [
          { text: "Here is a scene you probably know.", rule: "none", badgeText: "Normal Flow" },
          { text: "It is eleven at night.", rule: "factual", badgeText: "Factual Setting" },
          { text: "A twelve-year-old is lying in bed.", rule: "factual", badgeText: "Scene Detail" },
          { text: "The phone is six inches from their face.", rule: "factual", badgeText: "Focus Detail" },
          { text: "They told themselves they would stop...", rule: "dramatic", badgeText: "Suspense Pause" },
          { text: "after this one video.", rule: "none", badgeText: "Paced Delivery" },
          { text: "That was forty minutes ago.", rule: "factual", badgeText: "Declarative Stop" },
          { text: "They are not even watching anything good now.", rule: "break", badgeText: "Line Break" },
          { text: "Just scrolling...", rule: "dramatic", badgeText: "Drifting Pause" },
          { text: "Not looking for anything.", rule: "factual", badgeText: "Void Statement" },
          { text: "Just... unable to stop.", rule: "dramatic", badgeText: "Critical realiser" }
        ]
      },
      {
        title: "THE DESIGNER'S TARGET",
        summary: "A shift in scenery from the bedroom to the corporate engineers' offices.",
        lines: [
          { text: "And somewhere —", rule: "contrast", badgeText: "Contrast Pivot" },
          { text: "in a glass office in California...", rule: "dramatic", badgeText: "Corporate Scene" },
          { text: "an engineer designed that exact feeling.", rule: "none", badgeText: "Normal Flow" },
          { text: "Not by accident.", rule: "factual", badgeText: "Forced Period" },
          { text: "Not as a side effect.", rule: "factual", badgeText: "Factual denial" },
          { text: "They sat in a room...", rule: "dramatic", badgeText: "Dramatic Suspense" },
          { text: "and figured out how to make a twelve-year-old unable to put their phone down.", rule: "none", badgeText: "Core point" },
          { text: "at eleven at night.", rule: "factual", badgeText: "Time Anchor" }
        ]
      }
    ]
  },
  {
    id: "ep2-filters",
    title: "Episode 2: The Face You See is a Lie",
    subtitle: "Filters & Snapchat Dysmorphia",
    summary: "Exposing how real-time algorithmic modifications break self-image, triggering a new medical crisis.",
    rawText: "Imagine you woke up tomorrow and everyone you saw on your phone on billboards on videos had been subtly edited smoother skin bigger eyes a slightly different jawline and you had not been. How long do you think it would take before you started feeling like your face was the problem? Now imagine you are nine years old.",
    refactored: [
      {
        title: "THE IMPOSSIBLE STANDARD",
        summary: "Invoking visual empathy to explain body dysmorphia.",
        lines: [
          { text: "Imagine you woke up tomorrow...", rule: "dramatic", badgeText: "Mental scenario" },
          { text: "and everyone you saw —", rule: "contrast", badgeText: "Contrast Dash" },
          { text: "on your phone, on billboards, on videos...", rule: "dramatic", badgeText: "Broad scene" },
          { text: "had been subtly edited.", rule: "none", badgeText: "Plain reveal" },
          { text: "Smoother skin.", rule: "factual", badgeText: "Checklist Period" },
          { text: "Bigger eyes.", rule: "factual", badgeText: "Checklist Period" },
          { text: "A slightly different jawline.", rule: "factual", badgeText: "Checklist Period" },
          { text: "And you...", rule: "dramatic", badgeText: "Suspense Gap" },
          { text: "had not been.", rule: "factual", badgeText: "Declarative Period" }
        ]
      },
      {
        title: "THE NINE-YEAR-OLD SCALE",
        summary: "Exploring emotional vulnerability of younger children.",
        lines: [
          { text: "How long do you think it would take —", rule: "contrast", badgeText: "Rhetorical Pivot" },
          { text: "before you started feeling like your face was the problem?", rule: "none", badgeText: "Staggering query" },
          { text: "Now...", rule: "dramatic", badgeText: "Key transition" },
          { text: "imagine you are nine years old.", rule: "factual", badgeText: "Heavy Period" }
        ]
      }
    ]
  },
  {
    id: "ep4-tiktok",
    title: "Episode 4: The Forty-Minute Lie",
    subtitle: "The Split App Engine",
    summary: "Contrasting the heavily regulated Chinese education app Doo-yin with the engagement-focused TikTok.",
    rawText: "What if I told you there are two versions of TikTok? One version is for kids in China. It is called Doo-yin. It caps usage at forty minutes per day for anyone under fourteen. At ten PM, it locks. And the content it shows? Science experiments. Historical facts. Educational videos that are actually interesting. The other version is for everyone else. It has no time limits. It never locks. And the algorithm is designed to do one thing. Keep you on the app for as long as possible. Same company. Same technology. Completely different products. And the difference between them tells you everything.",
    refactored: [
      {
        title: "THE DEVIATION",
        summary: "The startling bifurcation of identical software engines depending on geography.",
        lines: [
          { text: "What if I told you there are two versions of TikTok?", rule: "none", badgeText: "Opening Hook" },
          { text: "One version is for kids in China.", rule: "factual", badgeText: "Factual Premise" },
          { text: "It is called Doo-yin.", rule: "factual", badgeText: "Factual Period" },
          { text: "It caps usage at forty minutes per day...", rule: "dramatic", badgeText: "Doo-yin restriction" },
          { text: "for anyone under fourteen.", rule: "none", badgeText: "Age break" },
          { text: "At ten PM —", rule: "contrast", badgeText: "Contrast Shift" },
          { text: "it locks.", rule: "factual", badgeText: "Absolute Stop" }
        ]
      },
      {
        title: "THE CONTRAST",
        summary: "Delineating the unchecked nature of the Western export model.",
        lines: [
          { text: "The other version is for everyone else.", rule: "factual", badgeText: "Factual Split" },
          { text: "It has no time limits.", rule: "factual", badgeText: "No Limit period" },
          { text: "It never locks.", rule: "factual", badgeText: "Never Lock period" },
          { text: "And the algorithm is designed to do one thing —", rule: "contrast", badgeText: "Algorithmic target" },
          { text: "keep you on the app for as long as possible.", rule: "none", badgeText: "Bottom-line goal" },
          { text: "Same company.", rule: "factual", badgeText: "Direct Comparison" },
          { text: "Same technology.", rule: "factual", badgeText: "Direct Comparison" },
          { text: "Completely different products.", rule: "factual", badgeText: "Dramatic result" },
          { text: "And the difference between them...", rule: "dramatic", badgeText: "Suspense Build" },
          { text: "tells you everything.", rule: "none", badgeText: "Narrator resolution" }
        ]
      }
    ]
  }
];
