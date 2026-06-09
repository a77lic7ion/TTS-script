# They Can't Come Down — Clean TTS Script Normalizer & Editor

An interactive, premium, full-stack application that transforms raw prose or unstructured text into highly polished, clean narration-ready **spoken scripts**. It is designed strictly for offline production workflows where creators edit scripts, structure them into blocks, and export them seamlessly with absolute sanitization—ensuring no development or narration variables are present.

---

## 🎨 Visual Identity & Theme Choices
Features the custom corporate **Sophisticated Dark Design Theme**:
- **Backdrop Palette**: Implements deep monochromatic charcoal black backplanes (`#070708`), carbon gray panels (`#0b0b0c`), and thin ivory borders (`border-white/5`).
- **Accent Highlighting**: Rich warm amber (`#f59e0b` / `text-amber-500`) used for micro-interactions, synthesis selections, and focus points.
- **Aesthetic Pairings**: High-contrast typography pairings mixing dynamic `Inter` for system controls and the stylish narrative editor lines. All elements are supported by hardware-accelerated animations via `motion`.

---

## 🚀 Key Features

1. **Local Host API & Model Verification Engine**:
   - Supports entering a custom **Gemini API Key** and targets model pre-fetches (e.g., `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`) via on-the-fly LLM switching.
   - Includes a **Connection Verification Tool** (`/api/test-key`) to pre-fetch and validate endpoint health immediately.

2. **Style Reference Manual & Context Guides**:
   - Includes custom input fields to declare a global **Subject/Topic** and configure a comprehensive **Rule Knowledge Base**.
   - These parameters are forwarded directly to the AI models to enforce absolute style compliance (e.g., forbidding specific words, enforcing an emotional tone, and formatting constraints).

3. **Block-Level AI Assistant (`/api/assist`)**:
   - Every paragraph block contains its own independent AI Assist panel!
   - Write custom micro-instructions (e.g., *"word it poetically"*, *"make it more warning-oriented"*, *"simplify syntax"*) to have Gemini rewrite specific blocks instantly.

4. **Zero-Variable Prose Sanitization**:
   - Strictly enforces clean narratable script formatting.
   - Automatically sanitizes and strips any text inside parentheses `()` or brackets `[]`, ensuring the final script contains strictly spoken content to prevent screen readers or voice actors from reading development directions out loud.

5. **Audio Pacing Heuristics**:
   - **Dramatic Pauses (`...`)**: Appends ellipsis at suspenseful intersections to instruct 1.5–2.0 second vocal holds.
   - **Contrast & Pivots (`—`)**: Appends em dashes to mark conversational redirects.
   - **Forced Declaratives (`.`)**: Splits up run-on statistics or listings with concise stops.

6. **Narration Architecture Styles (Cinematic vs. David Attenborough Documentary)**:
   - **Cinematic Drama Mode**: Emits standard conversational dramatic narration suitable for emotional openings and dramatic, fluid show pacing.
   - **David Attenborough Documentary Mode**: Adapts high-fidelity expert TTS engineering rules to emulate a slow, deeply observant documentary narrator. Forces deliberate unhurried observation, a precise scientific vocabulary (e.g., *vast, intricate, Relentless*), punctuation-controlled natural pauses (em-dashes and frequent period markers), and spaces or mechanisms grounding beginnings.
   - **Strict Word-Ceiling Metrics & Safety Alerts**: Each narration block has a real-time word counter indicating the paragraph length. Highlighting turns red and pulses if a block exceeds the strict 410-word ceiling constraint.
   - **Markdown Horizontal-Rule Chunks**: When documentary style is chosen, the exported copy and downloads are formatted strictly, separating each block under 410 words via standard Markdown horizontal rules (`---`) with zero meta indicators or tag metrics.

7. **Interactive Narrative Sandbox**:
   - Edit section names and summarization notes on the fly.
   - Real-time line editing (clicking on any line replaces it with an inline editor).
   - Dynamically insert new lines, copy existing lines, or delete segments.

7. **Production Sanitized Exports**:
   - One-click copy or download (`.txt` / `.md`) that compile **spoken prose ONLY**.
   - Strip all timings, section headers, metadata, brackets, and voice indicators to provide a clean draft ready to paste into any voice-over model or read-aloud system.

8. **Dynamic Copy-Paste Unicode Sanitization**:
   - Integrates aggressive, real-time correction of common Windows-1252 / UTF-8 mismatched characters.
   - Instantly fixes corrupted sequences like `â€”` (to clean em-dashes `—`), `â€™` (to smart apostrophes `’`), and other web-encoding blemishes. This runs dynamically in the staging editor, during file uploads, in Gemini response parsing, and during final prose compile pipelines.

9. **Seamless Conversational TTS Formatting Controls**:
   - **Introduction Rewriter**: Instead of leaving raw technical part descriptors (like 'part 1: title', 'section headings') inside the spoken content, the AI replaces them with an natural, elegant transition sentence introducing the block.
   - **Episode Context Replacements**: Replaces literal words like 'episode' and 'episodes' with a smooth spoken phrase like `'today's episode is about.....'` followed by the context of that block.
   - **Unified Conclusion Signature**: Rewrites and introduces concluding remarks smoothly using a cozy phrase like: `'and in closing today I'd like to leave you with...'` to wrap the script beautifully.

10. **Resilient LLM Failover & Fallback Heuristics**:
    - **Self-Healing Retries**: If the primary targeted Gemini model suffers a transient error like a 503 Service Unavailable (due to spikes in model demand) or a 429 Rate Limit, the server automatically delays and retries the operation.
    - **Alternate Model Escalation**: If retry thresholds are exceeded, the server steps down dynamically through a configured model chain (from `gemini-3.5-flash` down to `gemini-2.5-flash` and `gemini-1.5-flash`), securing successful parsing no matter the traffic load.

---

## 🛠️ Tech Stack & Scripts

- **Frontend**: React 19, Tailwind CSS, Vite, Motion.
- **Backend**: Node Express, TypeScript (`tsx`).
- **Development**: `npm run dev` (Express + Vite server bounds on port 3000).
- **Production Build**: `npm run build` (bundled via `esbuild` into high-performance `dist/server.cjs` modules to bypass runtime import conflicts).

---

*Stay human out there.*
