/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini SDK
function getGeminiClient(customKey?: string): GoogleGenAI {
  const key = customKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not defined. Please configure it in your Settings, environment, or entering a key.');
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Full Reference Template 
const fallbacks = {
  "original": `Welcome to They Can't Come Down. Your goal is not to raise a child who fears technology, but to raise a child who masters it. You are navigating an unprecedented landscape, and the guilt you feel is a symptom of a system designed to work against you.`,
  "refactored": {
    "sections": [
      {
        "title": "Welcome & Intent",
        "summary": "Setting the theme for the script series",
        "lines": [
          { "text": "Welcome to They Can't Come Down.", "rule": "none", "badgeText": "Opening" },
          { "text": "Your goal is not to raise a child who fears technology.", "rule": "factual", "badgeText": "Core Theme" },
          { "text": "It is to raise a child...", "rule": "dramatic", "badgeText": "Dramatic Pause" },
          { "text": "who masters it.", "rule": "none", "badgeText": "Resolve" }
        ]
      }
    ]
  }
};

// POST Endpoint for testing and prefetching API Key/Model
app.post('/api/test-key', async (req, res) => {
  const { apiKey, model = 'gemini-3.5-flash' } = req.body;
  const targetKey = apiKey || process.env.GEMINI_API_KEY;

  if (!targetKey) {
    return res.status(400).json({ error: 'No API Key was found in the environment or request payload.' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: targetKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Generate a miniature completion
    const result = await ai.models.generateContent({
      model: model,
      contents: "Respond with the word 'Confirmed'",
    });

    return res.json({
      success: true,
      message: `Verified! Model [${model}] reached successfully.`,
      pingResponse: result.text ? result.text.trim() : 'Confirmed'
    });
  } catch (error: any) {
    console.error('Key test failed:', error);
    return res.status(500).json({
      error: `Key check failed: ${error?.message || 'Unknown network error'}`
    });
  }
});

// POST Endpoint for refactoring text blocks (with Subject & KnowledgeBase)
app.post('/api/refactor', async (req, res) => {
  const {
    text,
    strictness = 'moderate',
    allowDramaticPause = true,
    allowContrasts = true,
    allowFactualPeriods = true,
    allowLineBreaks = true,
    subject = '',
    knowledgeBase = '',
    model = 'gemini-3.5-flash',
    apiKey = ''
  } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required to perform narrative structure edits.' });
  }

  try {
    const ai = getGeminiClient(apiKey);

    const pacingInstructions = `
      Pacing Parameters:
      - STRICTNESS DEGREE: ${strictness}
      - DRAMATIC PAUSES (ellipsis "..."): ${allowDramaticPause ? 'Allow for dramatic anticipation/emotional gaps.' : 'Disable ellipsis.'}
      - CONTRASTS/PIVOTS (dashes "—"): ${allowContrasts ? 'Allow dashes to introduce shifts/contradictions.' : 'Disable dashes.'}
      - FACTUAL STATEMENTS (forced short periods "."): ${allowFactualPeriods ? 'Force short declarative periods to split run-on lists/facts.' : 'Do not force period breaks.'}
      - LINE BREAKS: ${allowLineBreaks ? 'Separate clauses into single-narration-line statements.' : 'Keep lines flowing.'}

      Emotional Pacing Rules Details:
      - Dramatic Pause: Suspense or suspenseful realization -> add ellipsis (...) (Example: 'And you... had not been').
      - Factual Statement: Small declarative lists or punchy claims -> insert period (.) (Example: 'Smoother skin. Bigger eyes.').
      - Contrast/Pivot: Opposing thoughts or sudden redirects -> insert em dash (—) (Example: 'This is not vanity — this is harm').
      - Break: Break up long flowy clauses into bite-size pieces. Must keep sentences clean!
    `;

    const systemInstruction = `
      You are a highly skilled Audio Script Writer and TTS Refactoring Specialist. Your goal is to transform paragraphs into highly polished, dramatic, and emotionally resonant narration-ready scripts.
      
      CRITICAL INSTRUCTIONS:
      1. Partition the input text STRICTLY into distinct blocks based EXACTLY on the natural paragraph divisions or paragraphs uploaded/pasted. The number of blocks should correspond to the logical divisions of the text you paste.
      2. Keep the script lines clean.
      3. ABSOLUTELY NEVER generate or include any narrative cues, comments, directions, or explanations inside parenthesis () or brackets []. The text lines must consist ONLY of the literal prose wordings meant to be voiced! Timestamps, vocal guidelines, or meta descriptions are STRICTLY forbidden.
      4. Ensure there is zero code or JSON structure inside the output lines themselves.
    `;

    const prompt = `
      Subject of this script: "${subject}"
      Knowledge Base / Style Rules to refer to for edits:
      ---
      ${knowledgeBase}
      ---

      Please analyze and refactor the following raw text block into narration blocks according to these style guidelines:
      
      ${pacingInstructions}

      Provide your refactoring results in the JSON outline format. Break each block down into narration lines. Specify for each text item which rule was primarily applied, and a corresponding diagnostic badgeText explaining the pacing decision (e.g. "Suspense Pause", "Dynamic Contrast", "Paced Declaration", "Idea Split", "Normal Flow").

      TEXT TO REFACTOR:
      """
      ${text}
      """
    `;

    const result = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              description: 'List of detected blocks matching the narrative paragraphs submitted',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Title of the script block/section' },
                  summary: { type: Type.STRING, description: 'Brief context or summary cue for this section' },
                  lines: {
                    type: Type.ARRAY,
                    description: 'Sequential lines with applied punctuation, strictly excluding any parenthesized or bracketed comments',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING, description: 'Refactored text line with emotional pacing punctuation' },
                        rule: {
                          type: Type.STRING,
                          description: 'The pacing rule applied: "dramatic" | "contrast" | "factual" | "break" | "none"'
                        },
                        badgeText: { type: Type.STRING, description: 'Brief reason for this pacing application' }
                      },
                      required: ['text', 'rule', 'badgeText']
                    }
                  }
                },
                required: ['title', 'summary', 'lines']
              }
            }
          },
          required: ['sections']
        }
      }
    });

    const parsedResponse = JSON.parse(result.text || '{}');
    return res.json(parsedResponse);
  } catch (error: any) {
    console.error('Gemini processing error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process script with Gemini API.',
      isSecurityError: error?.message?.includes('GEMINI_API_KEY')
    });
  }
});

// POST Endpoint for Single Block AI Assist Writing / Adjustments
app.post('/api/assist', async (req, res) => {
  const {
    blockText,
    instruction,
    subject = '',
    knowledgeBase = '',
    model = 'gemini-3.5-flash',
    apiKey = ''
  } = req.body;

  if (!blockText || !instruction) {
    return res.status(400).json({ error: 'Both blockText and custom assist instruction are required.' });
  }

  try {
    const ai = getGeminiClient(apiKey);

    const systemInstruction = `
      You are an AI Script Editor. Your job is to rewrite or reword a specific script block based on the user's instructions.
      
      CRITICAL REWRITING LAWS:
      1. ABSOLUTELY DO NOT output any comments, guidance, voice directions, or annotations in brackets [] or parentheses (). The voice-over reader or TTS engine is reading this literally – anything inside brackets or parenthesis will ruin the recording.
      2. Consistently respect the global Subject context and Knowledge Base constraints if provided.
      3. Keep the output as a valid JSON list of lines.
    `;

    const prompt = `
      The Script Subject is: "${subject}"
      The Style Knowledge Base is:
      ---
      ${knowledgeBase}
      ---

      The script parts to edit:
      """
      ${blockText}
      """

      User instruction for re-writing this specific part:
      "${instruction}"

      Please execute this rewriting request, re-aligning the pacing rules accordingly. Output the modified block lines in the requested JSON structure. Do NOT add any surrounding text or remarks.
    `;

    const result = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lines: {
              type: Type.ARRAY,
              description: 'The updated narrative lines representing this script block, strictly containing no parenthesis or brackets',
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: 'Reworded script sentence/clause' },
                  rule: {
                    type: Type.STRING,
                    description: 'Primary rule applied: "dramatic" | "contrast" | "factual" | "break" | "none"'
                  },
                  badgeText: { type: Type.STRING, description: 'Short pacing badge text' }
                },
                required: ['text', 'rule', 'badgeText']
              }
            }
          },
          required: ['lines']
        }
      }
    });

    const parsedResponse = JSON.parse(result.text || '{}');
    return res.json(parsedResponse);
  } catch (error: any) {
    console.error('Gemini Assist failed:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to modify segment with Gemini AI.'
    });
  }
});

// Serve frontend assets in production or mount Vite server in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TTS Script Refactoring Server running on http://localhost:${PORT}`);
  });
}

startServer();
