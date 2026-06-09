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
    title: "They Can't Come Down — Episode 1 (Full Show)",
    subtitle: "The Casino in Your Pocket & The Digital Capture",
    summary: "A comprehensive, seamless narrative covering the emotional opening address, dopamine pathways, casino designs, and family-first boundaries.",
    rawText: `Welcome to They Can't Come Down. Before we begin our first episode, I want to take a moment to speak directly to both the parents and the children listening together. To the parents. Your goal is not to raise a child who fears technology — but to raise a child who masters it. And the guilt you feel... is a symptom of a system designed to work against you. The end goal of this series is not to confiscate devices or enforce draconian rules. It is to equip you with the knowledge to dismantle the illusion of the algorithm — and to rebuild your family's attention, connection, and autonomy. To the children and teenagers listening. Your goal is to reclaim your own mind. The frustration you feel when you cannot put your phone down is not a personal failure. It is the result of thousands of engineers... working against your developing brain. The end goal of this series is to show you the strings attached to your screen — so that you can finally choose whether you want to dance.

Episode One. The Casino in Your Pocket. Your brain is under construction. They know exactly how it works. Here is a scene you probably know... It is eleven at night. A twelve-year-old is lying in bed. The phone is six inches from their face. They told themselves they would stop after this one video — that was forty minutes ago. They are not even watching anything good now... Just scrolling. Not looking for anything. Just unable to stop. And somewhere, in a glass office in California — an engineer designed that exact feeling. Not by accident. Not as a side effect. They sat in a room and figured out how to make a twelve-year-old unable to put their phone down at eleven at night. And then they shipped it. And then they measured how many kids did exactly that. And then they made it slightly worse the next quarter. That is what we are talking about today.

Part One. It starts with a feeling. You know that feeling when you pick up your phone and just cannot put it down? We need to talk about what that actually is. That feeling has a name. It is not laziness. It is not a lack of willpower. It is not a you problem. It is dopamine. Dopamine is a chemical your brain makes. And it does a very specific thing. It makes you want something. Not enjoy it, want it. There is a difference. Enjoyment is eating the crisps. Wanting is reaching for another one before you have finished the first. Here is the thing most people get wrong about dopamine. It does not fire when you get a reward. It fires when you anticipate a reward. When you think something good might be coming. That is what makes you reach for the phone. Not because every notification is amazing, but because the next one might be. That is the hook. That is the whole game.

Part Two. The slot machine in your hand. There is a reason social media feels like gambling. Because it literally uses the same mechanics. Casinos hire mathematicians to figure out the exact moment a person is about to leave, and then they engineer something to keep them at the table. A free drink. A small win at just the right time. The layout of the floor so you walk past three more machines on the way to the exit. Social media platforms do the same thing. Every like, every comment, every notification. Those are the small wins. The variable reward. You do not know when the next one is coming or how big it will be, so you keep checking. That is not a design flaw. That is the product working exactly as intended. The like button alone, that single feature, was designed by people who studied operant conditioning. That is the same science behind training pigeons to press levers for food pellets. They applied it to human children. And it worked. Sean Parker, one of the people who helped build Facebook, said it out loud in 2017. He said the platform was designed to exploit a vulnerability in human psychology. He used the word exploit. Not serve. Not connect. Exploit. He said the like button gives users a little dopamine hit on a schedule that keeps them coming back. He was proud of it. At the time.

Part Three. Your brain is not finished yet. Here is where it gets important. Especially if you are under twenty-five. Your brain is still building itself. The part that handles impulse control, the part that says maybe I should stop scrolling and go to sleep, that is the prefrontal cortex. And it does not finish developing until you are about twenty-five years old. Twenty-five. So a fifteen-year-old trying to resist a slot machine that was designed by a thousand engineers is not a fair fight. It is not even close. It is like sending someone into a boxing ring with their hands tied and being surprised when they lose. And these are not just any engineers. These are some of the best-paid, most talented behavioral scientists and designers on the planet. People who spent years studying exactly how a fourteen-year-old's brain responds to social validation. They know the exact shade of the notification badge that gets the most taps. They know that pull-to-refresh feels like opening a present. They know that three seconds of loading time makes people tap more when the content appears. They know everything. And they built everything around that knowledge.

Part Four. What does not help. Let us talk about what does not work. It is just willpower. No, it is not. Willpower is like a muscle. You can exhaust it. And it is still growing until you are twenty-five. Telling a kid to just have more willpower is like telling a kid to just be taller. It is not how it works. I turned out fine. You did. But you also got your first phone when you were, what, sixteen? Seventeen? The average age for a first smartphone in America right now is ten. Ten years old. That is primary school. The stuff hitting a ten-year-old's brain today is more sophisticated than anything you encountered as a kid. It is not the same world. It is just how kids are now. It is. And that should worry us, not comfort us. Because how kids are now is anxious, distracted, sleep-deprived, and spending an average of seven hours a day on screens. That is not a personality type. That is a design outcome.

Part Five. What actually helps. Here is what the research shows actually makes a difference. Name the thing. Just being able to say I am doing the dopamine thing right now takes away some of its power. The algorithm works best when you do not notice it working. The moment you notice, it gets harder to keep pulling you. Change the environment, not the person. Do not rely on willpower. Make the phone harder to reach. Charge it in the kitchen, not the bedroom. Turn off notifications. Not some of them, all of them. You do not need a buzz every time someone likes your photo. You just do not. Do it together. This is the big one. If a kid's parents are on their phones at dinner, telling the kid to get off theirs is not going to land. It just will not. But if the whole family does a phone stack, everyone puts their phone in the middle of the table, first one to grab it does the dishes, that is different. That is fair. That is a family, not a set of rules. Know that the first week is hard. If you have been getting constant dopamine hits from a screen for years and you suddenly stop, your brain is going to protest. You will feel restless. Bored. Kind of awful. That is not you being weak. That is withdrawal. It is real. And it passes. Usually within two weeks, the brain starts to recalibrate. But you have to get through the ugly bit first.

Closing. Here is what I want you to take from this. That feeling. The cannot-put-it-down, the just-one-more-scroll, the where-did-the-last-hour-go. That is not a personal failing. That is a product working as designed. You were never supposed to be able to resist it. The whole point is that you cannot. But now you know what it is. And that changes things. Not completely. Not overnight. But knowing is the first step. Because you cannot fight something you cannot see. And now you can see it. Detailed show notes and sources are provided in the accompanying guide. If this episode meant something to you, do not share it on social media. Play it for someone. In the car. At dinner. With your phones face down on the table. That is it from us. See you next time. Stay human out there.`,
    refactored: [
      {
        title: "Introduction",
        summary: "Opening remarks addressing both parents and children with informative conversational framing.",
        lines: [
          { text: "Welcome to They Can't Come Down.", rule: "none", badgeText: "Series Hook" },
          { text: "Before we begin our first journey together, today's episode is about..... the systemic machinery that captures our family attention and shapes our everyday behaviors.", rule: "none", badgeText: "Conversational Fronting" },
          { text: "I want to take a moment to speak directly...", rule: "dramatic", badgeText: "Dramatic Pause" },
          { text: "to both the parents and the children listening together.", rule: "none", badgeText: "Shared Perspective" }
        ]
      },
      {
        title: "Addressing the Parents",
        summary: "Providing reassuring data & framing for the modern parenting challenge.",
        lines: [
          { text: "To the parents listening.", rule: "factual", badgeText: "Direct Focus" },
          { text: "Your goal is not to raise a child who fears technology —", rule: "contrast", badgeText: "Contrast Pivot" },
          { text: "it is to raise a child who masters it.", rule: "factual", badgeText: "Empowerment Standard" },
          { text: "You are navigating an unprecedented digital landscape...", rule: "dramatic", badgeText: "Era Setting" },
          { text: "and the guilt you carry is a natural symptom of a system designed to work active against you.", rule: "none", badgeText: "Reassuring Fact" },
          { text: "The end goal of this series is not to confiscate devices or enforce draconian rules.", rule: "factual", badgeText: "Clear Policy" },
          { text: "It is to equip you with the knowledge to dismantle the illusion of the algorithm —", rule: "contrast", badgeText: "Strategic Contrast" },
          { text: "and to rebuild your family's attention, connection, and autonomy.", rule: "none", badgeText: "Ultimate Objective" }
        ]
      },
      {
        title: "Addressing the Youth",
        summary: "De-marginalizing the frustration and pointing out the systemic leverage.",
        lines: [
          { text: "To the children and teenagers listening.", rule: "factual", badgeText: "Direct Address" },
          { text: "Your goal is to reclaim your own mind.", rule: "factual", badgeText: "Aspirational Target" },
          { text: "The frustration you feel when you cannot put your phone down...", rule: "dramatic", badgeText: "Shared Vulnerability" },
          { text: "is not a personal failure.", rule: "factual", badgeText: "Direct Absolution" },
          { text: "It is the result of thousands of engineers —", rule: "contrast", badgeText: "Opposing Force" },
          { text: "working on the other side of the screen, against your developing brain.", rule: "none", badgeText: "Narrator Flow" },
          { text: "The end goal of this series is to show you the strings attached to your screen —", rule: "contrast", badgeText: "Dismantling Illusion" },
          { text: "so that you can finally choose whether you want to dance.", rule: "none", badgeText: "Prose Resolution" }
        ]
      },
      {
        title: "The Pocket Casino",
        summary: "Revealing the late-night bedroom scene and the intentional corporate systems.",
        lines: [
          { text: "This brings us directly into our primary thematic core. Today's episode is about..... the casino in your pocket, exploring how your brain is currently under construction, and how they know exactly how it works.", rule: "none", badgeText: "Seamless Transition" },
          { text: "Here is a scene you probably know...", rule: "dramatic", badgeText: "Relatable Hook" },
          { text: "It is eleven at night.", rule: "factual", badgeText: "Factual Anchor" },
          { text: "A twelve-year-old is lying in bed.", rule: "factual", badgeText: "Subject Placement" },
          { text: "The phone is six inches from their face.", rule: "factual", badgeText: "Stark Detail" },
          { text: "They told themselves they would stop after this one video —", rule: "contrast", badgeText: "Broken Intention" },
          { text: "yet that was forty minutes ago.", rule: "factual", badgeText: "Time Impact" },
          { text: "They are not even watching anything good now...", rule: "dramatic", badgeText: "Aimless Routine" },
          { text: "Just scrolling.", rule: "factual", badgeText: "Dull Motion" },
          { text: "Not looking for anything.", rule: "factual", badgeText: "Void Statement" },
          { text: "Just... unable to stop.", rule: "dramatic", badgeText: "The Trap" },
          { text: "And somewhere, in a glass office in California —", rule: "contrast", badgeText: "Space Shift" },
          { text: "an engineer designed that exact feeling.", rule: "factual", badgeText: "Design Intent" },
          { text: "Not by accident.", rule: "factual", badgeText: "Direct Period" },
          { text: "Not as a side effect.", rule: "factual", badgeText: "Direct Period" },
          { text: "They sat in a room and figured out how to make a twelve-year-old unable to put their phone down.", rule: "none", badgeText: "Systemic Core" },
          { text: "At eleven at night.", rule: "factual", badgeText: "Refined Period" },
          { text: "And then they shipped it.", rule: "factual", badgeText: "Action Cycle" },
          { text: "And then they measured how many kids did exactly that.", rule: "factual", badgeText: "Data Tracking" },
          { text: "And then they made it slightly worse the next quarter.", rule: "none", badgeText: "Quarterly Target" },
          { text: "That is what we are talkin' about today.", rule: "none", badgeText: "Informed Narrative" }
        ]
      },
      {
        title: "Part One: It Starts with a Feeling",
        summary: "Differentiating enjoy versus want, and explaining the cycle of anticipation.",
        lines: [
          { text: "Let's examine how this process begins, starting with a feeling. You know that feeling when you pick up your phone and just cannot put it down? We need to talk about what that actually is.", rule: "none", badgeText: "Introductory transition" },
          { text: "That feeling has a name.", rule: "factual", badgeText: "Informative setup" },
          { text: "It is not laziness —", rule: "contrast", badgeText: "Debunking Contrast" },
          { text: "it is not a lack of willpower, and it is certainly not a you problem.", rule: "none", badgeText: "Narrator flow" },
          { text: "It is dopamine.", rule: "factual", badgeText: "Chemical Reveal" },
          { text: "Dopamine is a chemical your brain makes.", rule: "factual", badgeText: "Factual definition" },
          { text: "And it does a very specific thing.", rule: "factual", badgeText: "Specific action" },
          { text: "It makes you want something.", rule: "factual", badgeText: "Desire trigger" },
          { text: "Not enjoy it... want it.", rule: "dramatic", badgeText: "Critical distinction" },
          { text: "There is a fundamental difference.", rule: "factual", badgeText: "Structural distinction" },
          { text: "Enjoyment is eating the crisps.", rule: "factual", badgeText: "Visual analogy" },
          { text: "Wanting is reaching for another one before you have finished the first.", rule: "none", badgeText: "Flow analogy" },
          { text: "Here is the thing most people get wrong about dopamine.", rule: "factual", badgeText: "Correction info" },
          { text: "It does not fire when you get a reward.", rule: "factual", badgeText: "Factual clarification" },
          { text: "It fires when you anticipate a reward...", rule: "dramatic", badgeText: "Anticipation build" },
          { text: "when you think something good might be coming.", rule: "none", badgeText: "Paced meaning" },
          { text: "That is what makes you reach for the phone.", rule: "factual", badgeText: "Reactivity core" },
          { text: "Not because every notification is amazing, but because the next one might be.", rule: "none", badgeText: "The Hook" },
          { text: "That is the hook.", rule: "factual", badgeText: "Final summary" },
          { text: "That is the whole game.", rule: "factual", badgeText: "Definitive snap" }
        ]
      },
      {
        title: "Part Two: The Pocket Slot Machine",
        summary: "Highlighting gambling mechanics, variable rewards, and intentional commercial exploitation.",
        lines: [
          { text: "This flows naturally into our next dynamic, focusing on the slot machine in your hand.", rule: "none", badgeText: "Seamless transition" },
          { text: "There is a reason social media feels like gambling —", rule: "contrast", badgeText: "Contrast connection" },
          { text: "because it literally uses the same gamified mechanics.", rule: "none", badgeText: "Clear explanation" },
          { text: "Casinos hire mathematicians to figure out the exact moment a person is about to leave...", rule: "dramatic", badgeText: "Psychology focus" },
          { text: "and then they engineer something to keep them at the table.", rule: "none", badgeText: "Action loop" },
          { text: "A free drink.", rule: "factual", badgeText: "Factual trigger" },
          { text: "A small win at just the right time.", rule: "factual", badgeText: "Factual trigger" },
          { text: "The layout of the floor so you walk past three more machines on the way to the exit.", rule: "none", badgeText: "Analogous layout" },
          { text: "Social media platforms do the exact same thing.", rule: "factual", badgeText: "Direct alignment" },
          { text: "Every like, every comment, every notification.", rule: "factual", badgeText: "Trigger stack" },
          { text: "Those are the small wins.", rule: "factual", badgeText: "Clarification" },
          { text: "The variable reward.", rule: "factual", badgeText: "System term" },
          { text: "You do not know when the next one is coming or how big it will be...", rule: "dramatic", badgeText: "Variable hook" },
          { text: "so you keep checking.", rule: "none", badgeText: "Resulting behavior" },
          { text: "That is not a design flaw.", rule: "factual", badgeText: "Assertive period" },
          { text: "That is the product working exactly as intended.", rule: "factual", badgeText: "Assertive period" },
          { text: "The like button alone was designed by people who studied operant conditioning.", rule: "none", badgeText: "Scientific context" },
          { text: "That is the same science behind training pigeons to press levers for food pellets.", rule: "factual", badgeText: "Historical analog" },
          { text: "They applied it directly to human children —", rule: "contrast", badgeText: "Ethical pivot" },
          { text: "and it worked.", rule: "factual", badgeText: "Simple verdict" },
          { text: "Sean Parker, one of the founders who helped build Facebook, admitted it in 2017.", rule: "none", badgeText: "Elite insider" },
          { text: "He said the platform was designed specifically to exploit a vulnerability in human psychology.", rule: "factual", badgeText: "Exploit admission" },
          { text: "He used the word exploit.", rule: "factual", badgeText: "Word audit" },
          { text: "Not serve... not connect... exploit.", rule: "dramatic", badgeText: "Heavy realization" },
          { text: "He explained the like button gives users a little dopamine hit on a schedule that keeps them coming back.", rule: "none", badgeText: "Hit schedule" },
          { text: "He was proud of it...", rule: "dramatic", badgeText: "Repentant break" },
          { text: "at the time.", rule: "factual", badgeText: "Past marker" }
        ]
      },
      {
        title: "Part Three: An Unfinished Brain",
        summary: "Navigating the anatomy of a growing brain under twenty-five.",
        lines: [
          { text: "Now we must address a critical component, mapping the truth that your brain is not finished yet.", rule: "none", badgeText: "Introductory transition" },
          { text: "Here is where it gets incredibly important.", rule: "factual", badgeText: "Warning sign" },
          { text: "Especially if you are under twenty-five years old.", rule: "factual", badgeText: "Target demographic" },
          { text: "Your brain is still actively building itself.", rule: "factual", badgeText: "Biological fact" },
          { text: "The part that handles impulse control...", rule: "dramatic", badgeText: "Anatomical function" },
          { text: "the part that says maybe I should stop scrolling and go to sleep —", rule: "contrast", badgeText: "Impulse contrast" },
          { text: "that is the prefrontal cortex.", rule: "factual", badgeText: "Scientific name" },
          { text: "And it does not finish developing until you are about twenty-five years old.", rule: "factual", badgeText: "Age ceiling" },
          { text: "Twenty-five.", rule: "factual", badgeText: "Isolated count" },
          { text: "So a fifteen-year-old trying to resist a slot machine that was designed by a thousand engineers is not a fair fight.", rule: "none", badgeText: "Asymmetrical balance" },
          { text: "It is not even close.", rule: "factual", badgeText: "Direct verdict" },
          { text: "It is like sending someone into a boxing ring with their hands tied...", rule: "dramatic", badgeText: "Fighter analogy" },
          { text: "and being surprised when they lose.", rule: "none", badgeText: "Analogy resolution" },
          { text: "And these are not just any engineers.", rule: "factual", badgeText: "Elite threat" },
          { text: "These are some of the best-paid, most talented behavioral scientists on the planet.", rule: "none", badgeText: "The Adversaries" },
          { text: "People who spent years studying exactly how a fourteen-year-old's brain responds to social validation.", rule: "factual", badgeText: "Commercial studies" },
          { text: "They know the exact shade of red for the notification badge that gets the most taps.", rule: "none", badgeText: "Psychological design" },
          { text: "They know that pull-to-refresh feels like opening a present.", rule: "factual", badgeText: "Gamble flow" },
          { text: "They know that three seconds of loading time makes people tap more when the content finally appears.", rule: "none", badgeText: "Calculated friction" },
          { text: "They know everything...", rule: "dramatic", badgeText: "Ominous fact" },
          { text: "and they built everything around that knowledge.", rule: "none", badgeText: "Complete cage" }
        ]
      },
      {
        title: "Part Four: The Willpower Illusion",
        summary: "Analyzing why willpower exhaustion exists and historical technology gaps.",
        lines: [
          { text: "This shifts our attention to what does not help.", rule: "none", badgeText: "Introductory transition" },
          { text: "Let us talk honestly about what does not work.", rule: "factual", badgeText: "Direct assessment" },
          { text: "It is just willpower.", rule: "factual", badgeText: "The Myth" },
          { text: "No...", rule: "dramatic", badgeText: "The Refusal" },
          { text: "it is not.", rule: "factual", badgeText: "Direct Stop" },
          { text: "Willpower is like a muscle.", rule: "factual", badgeText: "Muscle analogy" },
          { text: "You can exhaust it.", rule: "factual", badgeText: "Exhaustion point" },
          { text: "And it is still actively growing until you are twenty-five.", rule: "none", badgeText: "Growth period" },
          { text: "Telling a kid to just have more willpower is like telling a kid to just be taller.", rule: "factual", badgeText: "Genetic analogy" },
          { text: "It is simply not how it works.", rule: "factual", badgeText: "Closing myth" },
          { text: "I turned out fine.", rule: "factual", badgeText: "Historical excuse" },
          { text: "You did.", rule: "factual", badgeText: "Acknowledgement" },
          { text: "But you also got your first phone when you were, what, sixteen? Seventeen?", rule: "factual", badgeText: "Generational scale" },
          { text: "The average age for a first smartphone in America right now is ten.", rule: "factual", badgeText: "Statistical data" },
          { text: "Ten years old.", rule: "factual", badgeText: "Staggering weight" },
          { text: "That is primary school.", rule: "factual", badgeText: "School setting" },
          { text: "The stuff hitting a ten-year-old's brain today is far more sophisticated than anything you encountered.", rule: "none", badgeText: "Sophisticated stress" },
          { text: "It is not the same world.", rule: "factual", badgeText: "World change" },
          { text: "It is just how kids are now.", rule: "factual", badgeText: "Apathy defense" },
          { text: "It is...", rule: "dramatic", badgeText: "Pacing hesitation" },
          { text: "and that should worry us, not comfort us.", rule: "factual", badgeText: "Ethical alarm" },
          { text: "Because how kids are now is anxious, distracted, sleep-deprived —", rule: "contrast", badgeText: "Anxious list" },
          { text: "and spending an average of seven hours a day on screens.", rule: "none", badgeText: "Heavy statistic" },
          { text: "That is not a personality type.", rule: "factual", badgeText: "Factual refusal" },
          { text: "That is a design outcome.", rule: "factual", badgeText: "Outcome definition" }
        ]
      },
      {
        title: "Part Five: Concrete Solutions",
        summary: "Navigating naming the beast, spatial isolation of phones, and unified agreements.",
        lines: [
          { text: "Let's turn wearily but hopefully to our next major theme, exploring what actually helps.", rule: "none", badgeText: "Introductory transition" },
          { text: "Here is what the clinical research shows actually makes a tangible difference.", rule: "factual", badgeText: "Scientific proof" },
          { text: "Name the thing.", rule: "factual", badgeText: "Primary Action" },
          { text: "Just being able to say... 'I am doing the dopamine thing right now' takes away some of its power.", rule: "dramatic", badgeText: "Self-awareness pause" },
          { text: "The algorithm works best when you do not notice it working.", rule: "factual", badgeText: "Covert mechanism" },
          { text: "The moment you notice —", rule: "contrast", badgeText: "Cognitive split" },
          { text: "it gets harder to keep pulling your focus.", rule: "none", badgeText: "Reclaiming control" },
          { text: "Change the environment, not the person.", rule: "factual", badgeText: "Spatial rule" },
          { text: "Do not rely on fragile willpower.", rule: "factual", badgeText: "Avoid myth" },
          { text: "Make the phone physically harder to reach.", rule: "none", badgeText: "Physical wall" },
          { text: "Charge it in the kitchen...", rule: "dramatic", badgeText: "Kitchen location" },
          { text: "not the bedroom.", rule: "factual", badgeText: "Restricted zone" },
          { text: "Turn off notifications.", rule: "factual", badgeText: "Silent device" },
          { text: "Not some of them... all of them.", rule: "dramatic", badgeText: "Strict clean" },
          { text: "You do not need a buzz every time someone likes your photo.", rule: "none", badgeText: "Attention drain" },
          { text: "You just do not.", rule: "factual", badgeText: "Final boundary" },
          { text: "Do it together.", rule: "factual", badgeText: "Unified team" },
          { text: "This is the big one.", rule: "factual", badgeText: "Crucial weight" },
          { text: "If a kid's parents are glued to their phones at dinner, telling the kid to get off theirs is not going to land.", rule: "none", badgeText: "Cognitive dissonance" },
          { text: "It simply will not.", rule: "factual", badgeText: "Direct refusal" },
          { text: "But if the whole family does a phone stack...", rule: "dramatic", badgeText: "Family device game" },
          { text: "everyone puts their phone in the middle of the table —", rule: "contrast", badgeText: "Collective center" },
          { text: "and the first one to grab it does the dishes...", rule: "dramatic", badgeText: "Playful risk" },
          { text: "that is different.", rule: "factual", badgeText: "Functional split" },
          { text: "That is fair.", rule: "factual", badgeText: "Moral anchor" },
          { text: "That is a family...", rule: "dramatic", badgeText: "Emotional link" },
          { text: "not a set of rules.", rule: "factual", badgeText: "Dignity line" },
          { text: "Know that the first week is hard.", rule: "factual", badgeText: "True expectation" },
          { text: "If you have been getting constant dopamine hits from a screen for years and you suddenly stop, your brain is going to protest.", rule: "none", badgeText: "Dopamine protest" },
          { text: "You will feel restless.", rule: "factual", badgeText: "Restless condition" },
          { text: "Bored.", rule: "factual", badgeText: "Bored condition" },
          { text: "Kind of awful.", rule: "factual", badgeText: "Awful condition" },
          { text: "That is not you being weak.", rule: "factual", badgeText: "No blame" },
          { text: "That is withdrawal.", rule: "factual", badgeText: "Medical realities" },
          { text: "It is real.", rule: "factual", badgeText: "Stark period" },
          { text: "And it passes.", rule: "factual", badgeText: "Hopeful word" },
          { text: "Usually within two weeks, the brain starts to recalibrate.", rule: "none", badgeText: "Two-week window" },
          { text: "But you have to get through the ugly bit first.", rule: "factual", badgeText: "Honest conclusion" }
        ]
      },
      {
        title: "Concluding Perspectives",
        summary: "Summary signature wrapping up the digital capture with clean human presence.",
        lines: [
          { text: "and in closing today I'd like to leave you with...", rule: "dramatic", badgeText: "Closing transitions" },
          { text: "That exact feeling.", rule: "factual", badgeText: "Re-capture hook" },
          { text: "The cannot-put-it-down, the just-one-more-scroll, the where-did-the-last-hour-go.", rule: "none", badgeText: "Mental loop" },
          { text: "That is not a personal failing.", rule: "factual", badgeText: "Absolution again" },
          { text: "That is a product working exactly as designed.", rule: "factual", badgeText: "Intentional trap" },
          { text: "You were never supposed to be able to resist it.", rule: "factual", badgeText: "No resist" },
          { text: "The whole point is that you cannot.", rule: "factual", badgeText: "The system point" },
          { text: "But now you know what it is.", rule: "factual", badgeText: "Knowledge threshold" },
          { text: "And that changes things.", rule: "factual", badgeText: "Strategic switch" },
          { text: "Not completely.", rule: "factual", badgeText: "Incremental progress" },
          { text: "Not overnight.", rule: "factual", badgeText: "Incremental progress" },
          { text: "But knowing is the first step.", rule: "factual", badgeText: "Epistemic core" },
          { text: "Because you cannot fight something you cannot see.", rule: "none", badgeText: "Insight cue" },
          { text: "And now...", rule: "dramatic", badgeText: "Suspense split" },
          { text: "you can see it.", rule: "factual", badgeText: "Reclaimed vision" },
          { text: "Detailed show notes and sources are provided in the accompanying guide.", rule: "factual", badgeText: "Show note cue" },
          { text: "If today's episode is about..... digital capture meant something to you, please do not share it on social media.", rule: "none", badgeText: "Ironic twist" },
          { text: "Play it for someone.", rule: "factual", badgeText: "Active sharing" },
          { text: "In the car.", rule: "factual", badgeText: "Spatial setting" },
          { text: "At dinner.", rule: "factual", badgeText: "Spatial setting" },
          { text: "With your phones face down on the table.", rule: "none", badgeText: "Final stance" },
          { text: "That is it from us.", rule: "factual", badgeText: "Final signoff" },
          { text: "See you next time.", rule: "factual", badgeText: "Final signoff" },
          { text: "Stay human out there.", rule: "none", badgeText: "Profound resolve" }
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
        title: "The Standard Standard",
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
        title: "The Nine-Year-Old Scale",
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
        title: "The Divided Engine",
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
        title: "The Contrast",
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
  },
  {
    id: "attenborough-cybernetic",
    title: "David Attenborough Documentary Mode (Preset Seed)",
    subtitle: "The Cybernetic Captives & Biological Feedbacks",
    summary: "An ultra-premium, deeply clinical psychological seed for generating complex documentary essays focused on user retention mechanics, feedback loops, and neurological decay.",
    rawText: `Movement I: The Symptom.
A glowing device sits in an unlit room. Wavelengths of blue light reflect off a pair of dilated pupils. This is the modern capture. It is a biological organism caught in a cybernetic loop.

Movement II: The Infrastructure.
Silicon Valley behavior labs engineered this behavior. They utilized operant conditioning and variable rewards. The feed never ends. Every swipe is another pull of the virtual lever.

Movement III: The Biological Vulnerability.
A teenager's prefrontal cortex is still under construction. The dopamine pathway fires on anticipation. It is a developmental asymmetry.

Movement IV: The Macro Consequence.
Attention spans are decaying. Society is breaking down into polarized feedback bubbles. Personal sovereignty is replaced by algorithmic choice.

Movement V: The Sovereignty Blueprint.
Dismantle the loop. Reclaim focus through environmental design. Rebuild family connection. Reclaim sovereignty.`,
    refactored: [
      {
        title: "Movement I: The Symptom",
        summary: "The immediate visual and neurological state of digital capture.",
        lines: [
          { text: "A glowing device sits in an unlit room.", rule: "factual", badgeText: "Scene Setting" },
          { text: "Wavelengths of blue light reflect off a pair of dilated pupils.", rule: "factual", badgeText: "Clinical Observation" },
          { text: "This is the modern capture...", rule: "dramatic", badgeText: "Dramatic Core" },
          { text: "a biological organism caught in a cybernetic loop.", rule: "none", badgeText: "Systemic Definition" }
        ]
      }
    ]
  }
];
