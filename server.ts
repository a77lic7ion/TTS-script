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

// Resilient content generator wrapper with automatic retries and model fallbacks
async function generateContentWithRetry(
  ai: GoogleGenAI,
  primaryModel: string,
  contents: any,
  config: any,
  attempts = 2
): Promise<any> {
  const modelsToTry = [
    primaryModel,
    'gemini-2.5-flash',
    'gemini-1.5-flash',
  ].filter((v, i, a) => a.indexOf(v) === i); // keep unique targets

  let lastError: any = null;

  for (const currentModel of modelsToTry) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`Attempting script generation with LLM: ${currentModel} (Attempt ${attempt}/${attempts})`);
        const result = await ai.models.generateContent({
          model: currentModel,
          contents,
          config,
        });
        return result;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${currentModel} on attempt ${attempt} failed: ${err?.message || err}`);
        
        // Wait gracefully for potential transient network hiccups or rate limits
        const isTransient = err?.status === 503 || err?.code === 503 || err?.message?.includes('503') || err?.message?.includes('demand');
        if (isTransient) {
          await new Promise(resolve => setTimeout(resolve, 1200 * attempt));
        } else {
          // If not transient, try next model immediately
          break;
        }
      }
    }
  }

  throw lastError || new Error('All accessible Gemini models failed or are currently undergoing spike loads.');
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
  const { provider = 'gemini', apiKey, model, ollamaUrl } = req.body;
  const finalProvider = provider.toLowerCase();

  if (finalProvider === 'ollama') {
    const oUrl = (ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
    try {
      console.log(`Checking Ollama connection via ${oUrl}/api/tags...`);
      const tagsResponse = await fetch(`${oUrl}/api/tags`, { signal: AbortSignal.timeout(4000) });
      if (!tagsResponse.ok) {
        throw new Error(`Ollama returned status ${tagsResponse.status}`);
      }
      const data = await tagsResponse.json();
      const prefetched = (data.models || []).map((m: any) => m.name);
      
      return res.json({
        success: true,
        message: `Verified! Ollama [${oUrl}] is reachable. Found ${prefetched.length} models installed.`,
        prefetchedModels: prefetched
      });
    } catch (err: any) {
      return res.status(400).json({
        error: `Could not reach local Ollama on ${oUrl}. Is the service running locally? Error: ${err.message}`
      });
    }
  }

  if (finalProvider === 'openrouter') {
    const targetKey = apiKey || process.env.OPENROUTER_API_KEY;
    try {
      console.log('Fetching OpenRouter models...');
      const modelsResponse = await fetch('https://openrouter.ai/api/v1/models', { signal: AbortSignal.timeout(4000) });
      const mData = await modelsResponse.json();
      const allModels = (mData.data || []).map((m: any) => m.id);
      const popular = allModels.slice(0, 30);
      
      // Connection test
      const testRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${targetKey || ''}`,
          'HTTP-Referer': 'https://ai.studio/build',
          'X-Title': 'They Cant Come Down TTS'
        },
        body: JSON.stringify({
          model: model || 'meta-llama/llama-3-8b-instruct:free',
          messages: [{ role: 'user', content: 'respond with ok' }],
          max_tokens: 5
        }),
        signal: AbortSignal.timeout(5000)
      });
      
      if (!testRes.ok) {
        throw new Error(`OpenRouter answered with status ${testRes.status}`);
      }

      return res.json({
        success: true,
        message: `Verified! OpenRouter authentication successful with model [${model || 'meta-llama/llama-3-8b-instruct:free'}].`,
        prefetchedModels: popular
      });
    } catch (err: any) {
      return res.status(400).json({
        error: `OpenRouter test failed: ${err.message}. Please double-check your API Key.`
      });
    }
  }

  if (finalProvider === 'mistral') {
    const targetKey = apiKey || process.env.MISTRAL_API_KEY;
    try {
      console.log('Fetching Mistral models...');
      const modelsResponse = await fetch('https://api.mistral.ai/v1/models', {
        headers: { 'Authorization': `Bearer ${targetKey || ''}` },
        signal: AbortSignal.timeout(4000)
      });
      const mData = await modelsResponse.json();
      const prefetched = (mData.data || []).map((m: any) => m.id);

      // Simple test completion
      const testRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${targetKey || ''}`
        },
        body: JSON.stringify({
          model: model || 'mistral-tiny',
          messages: [{ role: 'user', content: 'respond with ok' }],
          max_tokens: 5
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (!testRes.ok) {
        throw new Error(`Mistral answered with status ${testRes.status}`);
      }

      return res.json({
        success: true,
        message: `Verified! Mistral authentication successful matching model [${model || 'mistral-tiny'}].`,
        prefetchedModels: prefetched
      });
    } catch (err: any) {
      return res.status(400).json({
        error: `Mistral test failed: ${err.message}. Please double-check your API Key.`
      });
    }
  }

  // Fallback to Gemini
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

    const result = await ai.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents: "Respond with the word 'Confirmed'",
    });

    return res.json({
      success: true,
      message: `Verified! Model [${model || 'gemini-3.5-flash'}] reached successfully.`,
      pingResponse: result.text ? result.text.trim() : 'Confirmed'
    });
  } catch (error: any) {
    console.error('Key test failed:', error);
    return res.status(500).json({
      error: `Key check failed: ${error?.message || 'Unknown network error'}`
    });
  }
});

// Helper function to clean and parse JSON securely from any provider
function cleanAndParseJSON(text: string): any {
  if (!text) {
    throw new Error("Response content is empty.");
  }
  
  let cleaned = text.trim();
  
  // Remove markdown code fence if present
  if (cleaned.startsWith('```')) {
    const match = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (match) {
      cleaned = match[1].trim();
    }
  }
  
  // Isolate first '{' and last '}' to strip any external explanations before/after
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return JSON.parse(cleaned);
}

// Universal assistant caller supporting Gemini, Ollama, OpenRouter, and Mistral
async function generateContentWithProvider(
  provider: string,
  apiKey: string,
  model: string,
  ollamaUrl: string,
  prompt: string,
  systemInstruction?: string,
  schemaType?: 'sections' | 'lines'
): Promise<string> {
  const finalProvider = (provider || 'gemini').toLowerCase();

  if (finalProvider === 'gemini') {
    const ai = getGeminiClient(apiKey);
    let config: any = {
      systemInstruction,
    };
    if (schemaType === 'sections') {
      config.responseMimeType = 'application/json';
      config.responseSchema = {
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
      };
    } else if (schemaType === 'lines') {
      config.responseMimeType = 'application/json';
      config.responseSchema = {
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
      };
    }

    const result = await generateContentWithRetry(ai, model || 'gemini-3.5-flash', prompt, config);
    return result.text || '';
  }

  // Non-Gemini providers: Ollama, OpenRouter, Mistral
  let url = '';
  let headers: Record<string, string> = { 'Content-Type': 'application/json' };
  let body: any = {};

  const systemPrompt = systemInstruction ? `${systemInstruction}\n\n` : '';
  const finalPrompt = `${systemPrompt}You MUST output dynamic valid JSON content matching the requested JSON structure. No description, no conversation. Just return raw JSON. If schema calls for sections: return format like \`{ "sections": [{ "title": "...", "summary": "...", "lines": [{ "text": "...", "rule": "...", "badgeText": "..." }] }] }\`. If schema calls for lines: return format like \`{ "lines": [{ "text": "...", "rule": "...", "badgeText": "..." }] }\`.\n\nUser request: ${prompt}`;

  if (finalProvider === 'ollama') {
    const oUrl = (ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
    url = `${oUrl}/api/generate`;
    body = {
      model: model || 'llama3',
      prompt: finalPrompt,
      stream: false,
      options: {
        temperature: 0.2
      }
    };
    if (schemaType) {
      body.format = 'json';
    }
  } else if (finalProvider === 'openrouter') {
    url = 'https://openrouter.ai/api/v1/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey || ''}`;
    headers['HTTP-Referer'] = 'https://ai.studio/build';
    headers['X-Title'] = 'They Cant Come Down TTS';
    
    body = {
      model: model || 'meta-llama/llama-3-8b-instruct:free',
      messages: [
        { role: 'system', content: systemInstruction || 'You are a professional assistant.' },
        { role: 'user', content: finalPrompt }
      ],
      temperature: 0.2,
    };
    if (schemaType) {
      body.response_format = { type: 'json_object' };
    }
  } else if (finalProvider === 'mistral') {
    url = 'https://api.mistral.ai/v1/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey || ''}`;
    
    body = {
      model: model || 'mistral-tiny',
      messages: [
        { role: 'system', content: systemInstruction || 'You are a professional assistant.' },
        { role: 'user', content: finalPrompt }
      ],
      temperature: 0.2,
    };
    if (schemaType) {
      body.response_format = { type: 'json_object' };
    }
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  console.log(`Sending API request to ${url} with model ${model}`);
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM provider ${provider} server returned ${response.status}: ${errText}`);
  }

  const resData = await response.json();
  if (finalProvider === 'ollama') {
    return resData.response || '';
  } else {
    if (resData.choices && resData.choices[0] && resData.choices[0].message) {
      return resData.choices[0].message.content || '';
    }
    throw new Error(`Invalid response structure from provider ${provider}: ${JSON.stringify(resData)}`);
  }
}

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
    provider = 'gemini',
    apiKey = '',
    model = 'gemini-3.5-flash',
    ollamaUrl = 'http://localhost:11434'
  } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required to perform narrative structure edits.' });
  }

  try {
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
      5. If there are any section headers, part titles (e.g. 'part 1 : title'), or numerical section labels inside the raw text blocks, REWRITE them into an elegant, seamless introductory sentence that introduces and flows directly into the next part.
      6. Maintain as much of the original script content/prose as possible, but rewrite it into flawless, natural voice-over TTS format.
      7. Replace any instance of the word 'episode' or 'episodes' with a smooth spoken phrase like 'today's episode is about.....' followed by the context of that block.
      8. For the final closing block, introduce or end it smoothly with the phrase: 'and in closing today I\\'d like to leave you with...' followed by the final takeaway message.
      9. BEEF UP the prose of each block elegantly—make it less abruptly direct, more rich, informative, and authoritative sounding. Let thoughts and sentences flow together beautifully like a premium, highly informative documentary narration, rather than brief chopped notes.
      10. CRITICAL PREPEND REQUIREMENT: Always insert an initial section/block at the very beginning of the returned "sections" array. This prepended block MUST have its "title" set exactly to "Intro" and its "summary" set to "Short synopsis preview of the episode". It must contain 2 to 4 highly direct, concise, and to-the-point narrator lines summarizing the key takeaways and core motif of the entire episode, flowing seamlessly into the next section body.
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

    const rawResult = await generateContentWithProvider(
      provider,
      apiKey,
      model,
      ollamaUrl,
      prompt,
      systemInstruction,
      'sections'
    );

    const parsedResponse = cleanAndParseJSON(rawResult);
    return res.json(parsedResponse);
  } catch (error: any) {
    console.error('Multi-provider processing error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process script with chosen LLM Provider.',
      isSecurityError: error?.message?.some?.(s => s.includes?.('KEY')) || error?.message?.includes?.('key') || error?.message?.includes?.('Key')
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
    provider = 'gemini',
    apiKey = '',
    model = 'gemini-3.5-flash',
    ollamaUrl = 'http://localhost:11434'
  } = req.body;

  if (!blockText || !instruction) {
    return res.status(400).json({ error: 'Both blockText and custom assist instruction are required.' });
  }

  try {
    const systemInstruction = `
      You are an AI Script Editor. Your job is to rewrite or reword a specific script block based on the user's instructions.
      
      CRITICAL REWRITING LAWS:
      1. ABSOLUTELY DO NOT output any comments, guidance, voice directions, or annotations in brackets [] or parentheses (). The voice-over reader or TTS engine is reading this literally – anything inside brackets or parenthesis will ruin the recording.
      2. Consistently respect any custom user guidance, global Subject context, and Style/Knowledge Base parameters.
      3. Keep the output as a valid JSON list of lines.
      4. Rewrite section titles/parts (like 'part 1: title') into a seamless introductory sentence that flows naturally into the text.
      5. Replace any occurrences of the word 'episode' with 'today\\'s episode is about.....'.
      6. If editing a closing block or segment, smoothly prefix/conclude with: 'and in closing today I\\'d like to leave you with...'.
      7. BEEF UP the prose elegantly—make it less abruptly direct, more rich, informative, and authoritative sounding. Thoughts must flow together like premium narrator content.
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

    const rawResult = await generateContentWithProvider(
      provider,
      apiKey,
      model,
      ollamaUrl,
      prompt,
      systemInstruction,
      'lines'
    );

    const parsedResponse = cleanAndParseJSON(rawResult);
    return res.json(parsedResponse);
  } catch (error: any) {
    console.error('Multi-provider Assist failed:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to modify segment with selected LLM provider.'
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
