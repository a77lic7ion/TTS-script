/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * They Can't Come Down — Script Editor & Pacing Guide
 * Optimized for local hosting, clean narrative prose, and custom AI editing.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash, 
  Download, 
  Copy, 
  Settings, 
  Check, 
  RotateCcw, 
  Upload, 
  Edit2, 
  Save, 
  FileDown,
  BookOpen, 
  BookMarked,
  Activity, 
  Info, 
  Sliders,
  AlertTriangle,
  ChevronDown,
  Clock,
  AudioLines,
  RefreshCw,
  Cpu,
  KeyRound,
  FileText,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScriptLine, ScriptSection, RefactoringSettings, RefactorStrictness } from './types';
import { SCRIPT_PRESETS } from './templates';
import PacingHelp from './components/PacingHelp';

export function cleanEncodingGlitches(text: string): string {
  if (!text) return "";
  return text
    .replace(/â€”/g, ' — ')
    .replace(/â€“/g, ' – ')
    .replace(/â€™/g, "’")
    .replace(/â€˜/g, "‘")
    .replace(/â€œ/g, '“')
    .replace(/â€/g, '”')
    .replace(/â€/g, '”')
    .replace(/â€¦/g, '...')
    .replace(/â€¢/g, '•')
    .replace(/Â/g, '')
    .replace(/[ \t]+/g, ' ');
}

export default function App() {
  // Preset loading state
  const [selectedPresetId, setSelectedPresetId] = useState<string>("tccd-intro");
  
  // Script Core State
  const defaultPreset = SCRIPT_PRESETS.find(p => p.id === "tccd-intro")!;
  const [rawText, setRawText] = useState<string>(defaultPreset.rawText);
  const [sections, setSections] = useState<ScriptSection[]>(() => 
    defaultPreset.refactored.map((s, sIdx) => ({
      id: `sec-init-${sIdx}-${Date.now()}`,
      title: s.title,
      summary: s.summary,
      lines: s.lines.map((l, lIdx) => ({
        id: `line-init-${sIdx}-${lIdx}-${Date.now()}`,
        text: l.text.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, ''), // Strip brackets & parenthesis on load
        rule: l.rule,
        badgeText: l.badgeText
      }))
    }))
  );

  // Subject & Style Knowledge Base States
  const [subject, setSubject] = useState<string>(() => {
    return localStorage.getItem('tccd_subject') || "Digital design loops keeping kids hooked late at night";
  });
  const [knowledgeBase, setKnowledgeBase] = useState<string>(() => {
    return localStorage.getItem('tccd_kb') || 
      "1. Rewrite section titles/parts (like 'part 1: title') into a seamless introductory sentence that flows naturally into the next part of the script, rather than a raw header.\n" +
      "2. Replace literal words like 'episode' with 'today's episode is about.....' to establish clean conversational audio framing.\n" +
      "3. For the ending, introduce it smoothly with: 'and in closing today I'd like to leave you with...' followed by the final takeaway thoughts.\n" +
      "4. Maintain as much of the original raw script phrasing/intent as possible, but shaped elegantly for voice-over read-alouds.\n" +
      "5. Absolutely never output any guidance or cues inside parentheses () or brackets [] – keep it entirely clean prose meant only for TTS vocals.\n" +
      "6. Automatically prepend a concise, short, and to-the-point introductory synopsis section at the very beginning with the title 'Intro'.";
  });

  // Local Host API Settings
  const [provider, setProvider] = useState<'gemini' | 'ollama' | 'openrouter' | 'mistral'>(() => {
    return (localStorage.getItem('tccd_provider') as any) || 'gemini';
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('tccd_api_key') || "";
  });
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('tccd_model') || "gemini-3.5-flash";
  });
  const [ollamaUrl, setOllamaUrl] = useState<string>(() => {
    return localStorage.getItem('tccd_ollama_url') || "http://localhost:11434";
  });
  const [ollamaModel, setOllamaModel] = useState<string>(() => {
    return localStorage.getItem('tccd_ollama_model') || "llama3";
  });
  const [openRouterKey, setOpenRouterKey] = useState<string>(() => {
    return localStorage.getItem('tccd_openrouter_key') || "";
  });
  const [openRouterModel, setOpenRouterModel] = useState<string>(() => {
    return localStorage.getItem('tccd_openrouter_model') || "meta-llama/llama-3-8b-instruct:free";
  });
  const [mistralKey, setMistralKey] = useState<string>(() => {
    return localStorage.getItem('tccd_mistral_key') || "";
  });
  const [mistralModel, setMistralModel] = useState<string>(() => {
    return localStorage.getItem('tccd_mistral_model') || "mistral-tiny";
  });
  const [prefetchedModels, setPrefetchedModels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tccd_prefetched_models');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Key Testing States
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Form & Settings State
  const [settings, setSettings] = useState<RefactoringSettings>(() => {
    try {
      const saved = localStorage.getItem('tccd_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          strictness: parsed.strictness || 'moderate',
          allowDramaticPause: parsed.allowDramaticPause !== false,
          allowContrasts: parsed.allowContrasts !== false,
          allowFactualPeriods: parsed.allowFactualPeriods !== false,
          allowLineBreaks: parsed.allowLineBreaks !== false,
          narrationStyle: parsed.narrationStyle || 'cinematic'
        };
      }
    } catch {}
    return {
      strictness: 'moderate',
      allowDramaticPause: true,
      allowContrasts: true,
      allowFactualPeriods: true,
      allowLineBreaks: true,
      narrationStyle: 'cinematic'
    };
  });

  useEffect(() => {
    localStorage.setItem('tccd_settings', JSON.stringify(settings));
  }, [settings]);

  // Block Assist States (Mapping of sectionId -> prompt input)
  const [assistInstructions, setAssistInstructions] = useState<{ [secId: string]: string }>({});
  const [activeAssistSecId, setActiveAssistSecId] = useState<string | null>(null);
  const [isApplyingAssist, setIsApplyingAssist] = useState<boolean>(false);

  // UI Support States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'warn' | 'success' | 'danger'; text: string } | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Inline editing state: stores active line ID when text editing is active
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editingLineText, setEditingLineText] = useState<string>('');

  // References
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save changes to localStorage for local hosting persistence
  useEffect(() => {
    localStorage.setItem('tccd_subject', subject);
  }, [subject]);

  useEffect(() => {
    localStorage.setItem('tccd_kb', knowledgeBase);
  }, [knowledgeBase]);

  useEffect(() => {
    localStorage.setItem('tccd_provider', provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem('tccd_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('tccd_model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('tccd_ollama_url', ollamaUrl);
  }, [ollamaUrl]);

  useEffect(() => {
    localStorage.setItem('tccd_ollama_model', ollamaModel);
  }, [ollamaModel]);

  useEffect(() => {
    localStorage.setItem('tccd_openrouter_key', openRouterKey);
  }, [openRouterKey]);

  useEffect(() => {
    localStorage.setItem('tccd_openrouter_model', openRouterModel);
  }, [openRouterModel]);

  useEffect(() => {
    localStorage.setItem('tccd_mistral_key', mistralKey);
  }, [mistralKey]);

  useEffect(() => {
    localStorage.setItem('tccd_mistral_model', mistralModel);
  }, [mistralModel]);

  useEffect(() => {
    localStorage.setItem('tccd_prefetched_models', JSON.stringify(prefetchedModels));
  }, [prefetchedModels]);

  // Handle Preset Loading
  const handleLoadPreset = (id: string) => {
    const preset = SCRIPT_PRESETS.find(p => p.id === id);
    if (!preset) return;
    setSelectedPresetId(id);
    setRawText(preset.rawText);
    
    // Clear brackets & parenthesis instantly
    const cleanedSections = preset.refactored.map((s, sIdx) => ({
      id: `sec-preset-${sIdx}-${Date.now()}`,
      title: s.title,
      summary: s.summary,
      lines: s.lines.map((l, lIdx) => ({
        id: `line-preset-${sIdx}-${lIdx}-${Date.now()}`,
        text: l.text.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, ''),
        rule: l.rule,
        badgeText: l.badgeText
      }))
    }));
    
    setSections(cleanedSections);
    setAlertMessage({ type: 'success', text: `Loaded preset references for: "${preset.title}" successfully!` });
  };

  // Drag and Drop files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setAlertMessage({ type: 'warn', text: 'Please upload raw plain text (.txt) files for optimal refactoring.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setRawText(cleanEncodingGlitches(text));
        setAlertMessage({ type: 'success', text: `Pasted uploaded file: "${file.name}" into raw staging panel.` });
      }
    };
    reader.readAsText(file);
  };

  // Local static smart editor fallback that strips all [] and ()
  const localSmartRefactor = (inputText: string): ScriptSection[] => {
    const cleanedInput = cleanEncodingGlitches(inputText);
    const paragraphs = cleanedInput.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const resultSections: ScriptSection[] = [];

    paragraphs.forEach((paragraph, index) => {
      // Split paragraph into distinct pacing sentence clauses
      const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
      const linesArray: ScriptLine[] = [];

      sentences.forEach((sentence, sIdx) => {
        // Strip out brackets & parenthesis entirely
        let textLine = sentence.trim().replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
        if (!textLine) return;

        let rule: ScriptLine['rule'] = 'none';
        let badgeText = 'Connected Thought';

        if (settings.allowDramaticPause && (textLine.toLowerCase().includes('imagine') || textLine.toLowerCase().includes('before') || textLine.length > 70)) {
          if (textLine.includes(',')) {
            const parts = textLine.split(',');
            textLine = `${parts[0].trim()}... ${parts[1]?.trim() || ''}`;
          } else {
            textLine = textLine.replace(/\s(?=\w+$)/, '... ');
          }
          rule = 'dramatic';
          badgeText = 'Suspense Pause';
        } else if (settings.allowContrasts && (textLine.toLowerCase().includes('but') || textLine.toLowerCase().includes('not') || textLine.toLowerCase().includes('system'))) {
          if (textLine.includes('and')) {
            textLine = textLine.replace(/\sand\s/i, ' — ');
          } else {
            textLine = textLine.replace(/\s(?=\w+\s\w+$)/, ' — ');
          }
          rule = 'contrast';
          badgeText = 'Contrast Pivot';
        } else if (settings.allowFactualPeriods && (textLine.includes('tripled') || textLine.includes('percent') || textLine.includes('years'))) {
          rule = 'factual';
          badgeText = 'Factual Statement';
        } else if (settings.allowLineBreaks) {
          rule = 'break';
          badgeText = 'Syllable Break';
        }

        // Final sanity sanitization
        textLine = textLine.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();

        linesArray.push({
          id: `line-offline-${index}-${sIdx}-${Date.now()}`,
          text: textLine,
          rule,
          badgeText
        });
      });

      if (linesArray.length > 0) {
        resultSections.push({
          id: `sec-offline-${index}-${Date.now()}`,
          title: `Block ${index + 1}`,
          summary: `Section segment covering details.`,
          lines: linesArray
        });
      }
    });

    if (resultSections.length > 0) {
      // Prepend an Intro synopsis section in local fallback matching the user's automated demand
      resultSections.unshift({
        id: `sec-offline-intro-${Date.now()}`,
        title: "Intro",
        summary: "Short synopsis preview of the episode.",
        lines: [
          {
            id: `line-offline-intro-1-${Date.now()}`,
            text: "In this episode, we embark on an inquiry into the digital forces shaping modern behaviors, exploring personal connection, systemic capture, and tactical recovery methods.",
            rule: "factual",
            badgeText: "Intro Synopsis"
          }
        ]
      });
    }

    return resultSections;
  };

  // Test custom API connections on the fly
  const handleTestAPIKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    try {
      const targetApiKey = provider === 'gemini' ? apiKey : (provider === 'openrouter' ? openRouterKey : (provider === 'mistral' ? mistralKey : ''));
      const targetModel = provider === 'gemini' ? selectedModel : (provider === 'openrouter' ? openRouterModel : (provider === 'mistral' ? mistralModel : ollamaModel));

      const response = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: targetApiKey,
          model: targetModel,
          ollamaUrl
        })
      });

      const data = await response.json();
      if (response.ok) {
        setTestResult({
          success: true,
          message: data.message || `Successfully prefetched and connected model!`
        });
        if (data.prefetchedModels && Array.isArray(data.prefetchedModels)) {
          setPrefetchedModels(data.prefetchedModels);
        }
        setAlertMessage({ type: 'success', text: `API connection tested & active: ${targetModel}` });
      } else {
        throw new Error(data.error || 'Server rejected key check.');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test timed out.'
      });
      setAlertMessage({ type: 'danger', text: `Key verification failed: ${err.message}` });
    } finally {
      setIsTestingKey(false);
    }
  };

  // MAIN DIALOGUE BLOCK REFACTORING TRIGGER
  const handleRefactorWithGemini = async () => {
    if (!rawText.trim()) {
      setAlertMessage({ type: 'warn', text: 'Input staging pane is currently empty.' });
      return;
    }

    setIsProcessing(true);
    setAlertMessage(null);

    try {
      const targetApiKey = provider === 'gemini' ? apiKey : (provider === 'openrouter' ? openRouterKey : (provider === 'mistral' ? mistralKey : ''));
      const targetModel = provider === 'gemini' ? selectedModel : (provider === 'openrouter' ? openRouterModel : (provider === 'mistral' ? mistralModel : ollamaModel));

      const response = await fetch('/api/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          strictness: settings.strictness,
          allowDramaticPause: settings.allowDramaticPause,
          allowContrasts: settings.allowContrasts,
          allowFactualPeriods: settings.allowFactualPeriods,
          allowLineBreaks: settings.allowLineBreaks,
          subject,
          knowledgeBase,
          provider,
          apiKey: targetApiKey,
          model: targetModel,
          ollamaUrl,
          narrationStyle: settings.narrationStyle || 'cinematic'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'High api congestion');
      }

      const result = await response.json();
      
      if (result.sections && result.sections.length > 0) {
        const mappedSections: ScriptSection[] = result.sections.map((sec: any, secIdx: number) => ({
          id: `sec-ai-${secIdx}-${Date.now()}`,
          title: sec.title || `Block ${secIdx + 1}`,
          summary: sec.summary || `Part ${secIdx + 1}`,
          lines: (sec.lines || []).map((line: any, lineIdx: number) => ({
            id: `line-ai-${secIdx}-${lineIdx}-${Date.now()}`,
            // Thoroughly filter any unrequested cues
            text: cleanEncodingGlitches((line.text || '').replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '')).trim(),
            rule: line.rule || 'none',
            badgeText: line.badgeText || 'Paced Expression'
          }))
        }));

        setSections(mappedSections);
        setAlertMessage({ type: 'success', text: `LLM successfully completed script refactoring. Blocks map paragraph format using ${provider}.` });
      } else {
        throw new Error('Malformed segment structure returned.');
      }
    } catch (err: any) {
      console.warn("Utilizing robust offline fallback script processing:", err);
      const offlineScript = localSmartRefactor(rawText);
      setSections(offlineScript);

      const warningText = err.message?.includes('GEMINI_API_KEY') || err.message?.includes('defined') || err.message?.includes('API key')
        ? `No API key defined for ${provider}. Successfully completed formatting offline on your PC using local pacing engines.`
        : `Connected model busy. Staged paragraphs formatted using offline heuristics. Error: ${err.message}`;
      
      setAlertMessage({ type: 'warn', text: warningText });
    } finally {
      setIsProcessing(false);
    }
  };

  // BLOCK LEVEL AI ASSIST SERVICE
  const handleApplyBlockAssist = async (sectionId: string) => {
    const instruction = assistInstructions[sectionId];
    if (!instruction || !instruction.trim()) {
      setAlertMessage({ type: 'warn', text: 'Please write a custom instruction first.' });
      return;
    }

    const targetSection = sections.find(s => s.id === sectionId);
    if (!targetSection) return;

    // Join all current lines of this section to re-pitch it to the AI editor
    const blockText = targetSection.lines.map(l => l.text).join(' ');

    setActiveAssistSecId(sectionId);
    setIsApplyingAssist(true);
    setAlertMessage(null);

    const targetApiKey = provider === 'gemini' ? apiKey : (provider === 'openrouter' ? openRouterKey : (provider === 'mistral' ? mistralKey : ''));
    const targetModel = provider === 'gemini' ? selectedModel : (provider === 'openrouter' ? openRouterModel : (provider === 'mistral' ? mistralModel : ollamaModel));

    try {
      const response = await fetch('/api/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockText,
          instruction,
          subject,
          knowledgeBase,
          provider,
          apiKey: targetApiKey,
          model: targetModel,
          ollamaUrl,
          narrationStyle: settings.narrationStyle || 'cinematic'
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Assist endpoint errored.');
      }

      const data = await response.json();
      if (data.lines && data.lines.length > 0) {
        setSections(prev => prev.map(s => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            lines: data.lines.map((l: any, lIdx: number) => ({
              id: `line-assist-${sectionId}-${lIdx}-${Date.now()}`,
              text: cleanEncodingGlitches((l.text || '').replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '')).trim(),
              rule: l.rule || 'none',
              badgeText: l.badgeText || 'AI Assist Pacing'
            }))
          };
        }));
        
        // Clear input instruction on success
        setAssistInstructions(prev => ({ ...prev, [sectionId]: '' }));
        setAlertMessage({ type: 'success', text: `Block rewritten successfully matching: "${instruction.substring(0, 20)}..." using ${provider}` });
      } else {
        throw new Error('AI returned empty response lines.');
      }
    } catch (err: any) {
      setAlertMessage({ type: 'warn', text: `AI Assist edit failed: ${err.message || 'Offline fallback only edits layout.'}` });
    } finally {
      setIsApplyingAssist(false);
      setActiveAssistSecId(null);
    }
  };

  // EDIT SEGMENTS DYNAMIC HANDLERS
  const handleStartEditLine = (lineId: string, currentText: string) => {
    setEditingLineId(lineId);
    setEditingLineText(currentText);
  };

  const handleSaveEditLine = (sectionId: string, lineId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        lines: s.lines.map(l => {
          if (l.id !== lineId) return l;
          return { 
            ...l, 
            text: cleanEncodingGlitches(editingLineText.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '')).trim() 
          };
        })
      };
    }));
    setEditingLineId(null);
  };

  const handleRemoveLine = (sectionId: string, lineId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        lines: s.lines.filter(l => l.id !== lineId)
      };
    }).filter(s => s.lines.length > 0));
  };

  const handleAddLine = (sectionId: string, afterLineId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const index = s.lines.findIndex(l => l.id === afterLineId);
      const newLines = [...s.lines];
      const newLine: ScriptLine = {
        id: `line-manual-${Date.now()}-${Math.random()}`,
        text: 'Type new narrated words here...',
        rule: 'none',
        badgeText: 'Manual Line'
      };
      newLines.splice(index + 1, 0, newLine);
      return { ...s, lines: newLines };
    }));
  };

  const handleAddSection = () => {
    const newSec: ScriptSection = {
      id: `sec-manual-${Date.now()}`,
      title: `Block ${sections.length + 1}`,
      summary: 'New paragraph segment details.',
      lines: [
        {
          id: `line-sec-man-${Date.now()}`,
          text: 'Pace your statement here.',
          rule: 'none',
          badgeText: 'Manual Line'
        }
      ]
    };
    setSections(prev => [...prev, newSec]);
  };

  const handleUpdateSectionHeader = (secId: string, nextTitle: string, nextSummary: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== secId) return s;
      return { ...s, title: nextTitle, summary: nextSummary };
    }));
  };

  // CALCULATIONS / STATISTICS
  const getAllLines = (): ScriptLine[] => {
    return sections.reduce((acc, sec) => [...acc, ...sec.lines], [] as ScriptLine[]);
  };

  const getWordCount = (): number => {
    const lines = getAllLines();
    return lines.reduce((total, line) => {
      const words = line.text.trim().split(/\s+/).filter(Boolean).length;
      return total + words;
    }, 0);
  };

  const getNarrationDurationText = (): string => {
    const wordCount = getWordCount();
    const totalSeconds = Math.round((wordCount / 130) * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    if (mins === 0) return `${secs} secs`;
    return `${mins}m ${secs}s`;
  };

  const getRuleCounts = () => {
    const lines = getAllLines();
    const counts = { dramatic: 0, contrast: 0, factual: 0, break: 0 };
    lines.forEach(l => {
      if (l.rule in counts) {
        counts[l.rule as keyof typeof counts]++;
      }
    });
    return counts;
  };

  // UNBIASED SPOKEN PROSE COPIER & DOWNLOADER
  // Strips all variables, parenthesis, brackets, summaries, timings, and guide labels! Only clean prose text is downloaded for standard TTS modules.
  const compileCleanProseText = (): string => {
    const isDocStyle = settings.narrationStyle === 'documentary';
    return sections
      .map(sec => {
        return sec.lines
          .map(line => {
            // Remove any remaining [] or () and clean glitches
            let cleanText = cleanEncodingGlitches(line.text)
              .replace(/\[.*?\]/g, '')
              .replace(/\(.*?\)/g, '')
              .replace(/\s+/g, ' ')
              .trim();
            return cleanText;
          })
          .filter(Boolean)
          .join('\n');
      })
      .filter(Boolean)
      .join(isDocStyle ? '\n\n---\n\n' : '\n\n');
  };

  const handleCopyToClipboard = () => {
    const cleanScript = compileCleanProseText();
    navigator.clipboard.writeText(cleanScript);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2400);
    setAlertMessage({ type: 'success', text: 'Copied clean spoken script (no headers, variables, brackets, or timings) to clipboard!' });
  };

  const handleDownloadFile = (type: 'md' | 'txt') => {
    const cleanScript = compileCleanProseText();
    const blob = new Blob([cleanScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `they-cant-come-down-clean-script.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setAlertMessage({ type: 'success', text: `Downloaded clean spoken script as: they-cant-come-down-clean-script.${type}` });
  };

  const counts = getRuleCounts();

  return (
    <div className="min-h-screen bg-[#070708] text-[#cfcbd2] flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* HEADER SECTION */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-12 bg-[#0b0b0c] sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-white font-bold tracking-widest shadow-inner text-sm">
            T
          </div>
          <div>
            <h1 className="text-stone-100 font-medium tracking-tight uppercase text-xs md:text-sm flex items-center gap-2">
              <span className="font-mono text-amber-500 font-semibold">TCCD</span>
              <span className="text-stone-500 font-mono hidden md:inline">//</span>
              <span className="text-stone-300 font-normal hidden md:inline">Narrative Prose Normalizer &amp; Editor</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 bg-stone-900/60 p-1.5 rounded border border-white/5">
            <span className="text-[10px] text-stone-500 font-mono px-1">Presets:</span>
            <select
              id="presets-accordion"
              value={selectedPresetId}
              onChange={(e) => handleLoadPreset(e.target.value)}
              className="bg-transparent text-[11px] text-stone-300 border-none rounded px-1 py-0.5 focus:outline-none focus:ring-0 font-sans cursor-pointer max-w-[140px] md:max-w-none text-ellipsis font-medium"
            >
              {SCRIPT_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0b0b0c] text-stone-300 text-xs">
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-[#070708] text-[10px] font-bold rounded uppercase tracking-widest transition flex items-center gap-1.5"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Script</span>
          </button>
        </div>
      </header>

      {/* BODY MAIN SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL LEFT: Staging parameters, configs, local API setups, KB */}
        <section id="panel-editor-control" className="lg:col-span-4 space-y-6">
          
          {/* I. LOCAL HOST & API VERIFICATION ENGINE */}
          <div className="bg-[#0b0b0c]/90 border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 font-mono">
                <Cpu className="w-3.5 h-3.5" />
                <span>API &amp; Model Hub</span>
              </span>
              <span className="text-[9px] bg-amber-950/20 text-amber-500 border border-amber-900/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Multi-Provider</span>
            </div>

            {/* LLM Provider Selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3 h-3 text-stone-500" />
                <span>LLM Provider</span>
              </label>
              <select
                id="provider-selector"
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value as any);
                  setTestResult(null);
                  setPrefetchedModels([]);
                }}
                className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-amber-500 focus:outline-none focus:border-amber-500/50 cursor-pointer font-bold"
              >
                <option value="gemini">Google Gemini (Default)</option>
                <option value="ollama">Ollama (Local Host)</option>
                <option value="openrouter">OpenRouter (Any LLM)</option>
                <option value="mistral">Mistral AI (European AI)</option>
              </select>
            </div>

            {/* Gemini Configuration Elements */}
            {provider === 'gemini' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-stone-500" />
                    <span>Gemini API Key</span>
                  </label>
                  <input
                    id="api-key-input"
                    type="password"
                    placeholder="Enter Gemini Secret Key (Optional)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Settings className="w-3 h-3 text-stone-500" />
                    <span>Selected Gemini Model</span>
                  </label>
                  <select
                    id="model-selector"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-[#070708] border border-white/5 rounded px-2 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                  >
                    <option value="gemini-3.5-flash">gemini-3.5-flash (Standard &amp; Speed)</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Creative Deep Edit)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Responsive Light)</option>
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Legacy Pro-Active)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Ollama Configuration Elements */}
            {provider === 'ollama' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-stone-500" />
                    <span>Ollama API Host</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. http://localhost:11434"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Settings className="w-3 h-3 text-stone-500" />
                    <span>Ollama Model Target</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. llama3, mistral, gemma"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                  {prefetchedModels.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[9px] text-stone-500 font-mono block mb-1">Local models installed:</span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {prefetchedModels.map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setOllamaModel(m)}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono border transition ${ollamaModel === m ? 'bg-amber-950/30 text-amber-500 border-amber-500/30' : 'bg-[#070708] text-stone-500 border-white/5 hover:border-stone-750'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OpenRouter Configuration Elements */}
            {provider === 'openrouter' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-stone-500" />
                    <span>OpenRouter API Key</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter OpenRouter API Key"
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Settings className="w-3 h-3 text-stone-500" />
                    <span>OpenRouter Model Target</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. meta-llama/llama-3-8b-instruct:free"
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                    className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                  {prefetchedModels.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[9px] text-stone-500 font-mono block mb-1">Available popular models:</span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {prefetchedModels.map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setOpenRouterModel(m)}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono border transition ${openRouterModel === m ? 'bg-amber-950/30 text-amber-500 border-amber-500/30' : 'bg-[#070708] text-stone-500 border-white/5 hover:border-stone-750'}`}
                          >
                            {m.split('/').pop()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mistral Configuration Elements */}
            {provider === 'mistral' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-stone-500" />
                    <span>Mistral API Key</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Mistral API Key"
                    value={mistralKey}
                    onChange={(e) => setMistralKey(e.target.value)}
                    className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Settings className="w-3 h-3 text-stone-500" />
                    <span>Mistral Model Target</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. mistral-tiny, open-mistral-7b"
                    value={mistralModel}
                    onChange={(e) => setMistralModel(e.target.value)}
                    className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                  {prefetchedModels.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[9px] text-stone-500 font-mono block mb-1">Available platform models:</span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {prefetchedModels.map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMistralModel(m)}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono border transition ${mistralModel === m ? 'bg-amber-950/30 text-amber-500 border-amber-500/30' : 'bg-[#070708] text-stone-500 border-white/5 hover:border-stone-750'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key verification test button */}
            <button
              id="test-key-btn"
              type="button"
              onClick={handleTestAPIKey}
              disabled={isTestingKey}
              className="w-full flex items-center justify-center gap-2 py-2 bg-stone-900/60 hover:bg-stone-850 text-stone-300 border border-white/5 rounded text-[10px] font-mono uppercase tracking-wider transition disabled:opacity-40"
            >
              {isTestingKey ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Checking Connection...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3 h-3 text-amber-500" />
                  <span>Test Connection &amp; Prefetch</span>
                </>
              )}
            </button>

            {/* Verification message panel */}
            {testResult && (
              <div className={`p-2.5 rounded text-[11px] leading-relaxed font-mono ${testResult.success ? 'bg-emerald-950/10 text-emerald-400 border border-emerald-900/20' : 'bg-red-950/15 text-red-400 border border-red-900/20'}`}>
                <strong>Status:</strong> {testResult.message}
              </div>
            )}
          </div>

          {/* II. SUBJECT & STYLE KNOWLEDGE BASE REFERENCE */}
          <div className="bg-[#0b0b0c]/90 border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-medium border-b border-white/5 pb-2 flex items-center gap-1.5 font-mono">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Context &amp; Guidelines</span>
            </h3>

            {/* subject input */}
            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block">Script Subject / Topic</label>
              <input
                id="script-subject-input"
                type="text"
                placeholder="Target theme e.g., screen addictive patterns..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500/55"
              />
            </div>

            {/* style knowledge base rules */}
            <div className="space-y-1">
              <label className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block">Rule Knowledge Base (Reference Manual)</label>
              <textarea
                id="knowledge-base-textarea"
                placeholder="Define words to restrict, tone guidelines, pacing constraints..."
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                className="w-full bg-[#070708] border border-white/5 rounded px-2.5 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/55 min-h-[110px] resize-y scrollbar-thin leading-relaxed"
              />
              <span className="text-[9px] text-stone-600 font-mono block">* The editor references this KB for global refactoring and block edits.</span>
            </div>
          </div>

          {/* III. PASTE & STAGING AREA */}
          <div className="bg-[#0b0b0c]/90 border border-white/5 rounded-xl p-5 shadow-lg relative flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span>Stage Raw Script</span>
              </span>
              <button
                id="reset-staging-editor"
                onClick={() => {
                  setRawText('');
                  setAlertMessage({ type: 'warn', text: 'Staging editor cleared.' });
                }}
                className="text-stone-500 hover:text-stone-300 text-[10px] font-mono flex items-center gap-1 transition uppercase tracking-wider"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Clear Staging
              </button>
            </div>

            {/* DRAG-DROP DRAG STAGING BOX */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDropFile}
              className={`relative border rounded transition-all duration-300 ${
                isDraggingFile 
                  ? 'border-amber-500 bg-amber-950/10' 
                  : 'border-white/5 bg-[#070708]'
              }`}
            >
              <textarea
                id="raw-text-staging-editor"
                className="w-full bg-transparent text-stone-300 text-xs font-sans p-4 leading-relaxed focus:outline-none min-h-[160px] resize-y scrollbar-thin"
                placeholder="Paste your raw script paragraphs here to structure them into independent blocks..."
                value={rawText}
                onChange={(e) => setRawText(cleanEncodingGlitches(e.target.value))}
              />

              {isDraggingFile && (
                <div className="absolute inset-0 bg-[#070708]/95 flex flex-col items-center justify-center p-4 text-amber-500 pointer-events-none rounded">
                  <Upload className="w-8 h-8 mb-2 animate-bounce" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Drop here to load script</span>
                </div>
              )}
            </div>

            {/* Upload Selector link */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-stone-600 font-mono uppercase">Plain Text / MD</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-amber-500 hover:text-amber-400 flex items-center gap-1 uppercase font-mono tracking-wider font-semibold transition"
              >
                <Upload className="w-3 h-3" />
                <span>Upload raw file</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".txt,.md"
                className="hidden"
              />
            </div>

            {/* NARRATION ARCHITECTURE STYLE */}
            <div className="space-y-1.5 bg-[#070708] p-3 rounded border border-white/5">
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono block mb-1">Narration Architecture Style</span>
              <select
                id="narration-style-selector"
                value={settings.narrationStyle || 'cinematic'}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSettings(p => ({ ...p, narrationStyle: val }));
                  if (val === 'documentary') {
                    const attPreset = SCRIPT_PRESETS.find(p => p.id === 'attenborough-cybernetic');
                    if (attPreset) {
                      setRawText(attPreset.rawText);
                      setSubject("Cybernetic Captives & Biological Feedbacks");
                      setSections(attPreset.refactored.map((s, sIdx) => ({
                        id: `sec-doc-${sIdx}-${Date.now()}`,
                        title: s.title,
                        summary: s.summary,
                        lines: s.lines.map((l, lIdx) => ({
                          id: `line-doc-${sIdx}-${lIdx}-${Date.now()}`,
                          text: l.text,
                          rule: l.rule,
                          badgeText: l.badgeText
                        }))
                      })));
                    }
                  }
                }}
                className="w-full bg-[#0c0c0d] border border-white/5 rounded px-2.5 py-2 text-xs text-amber-500 focus:outline-none focus:border-amber-500/50 cursor-pointer font-bold font-mono"
              >
                <option value="cinematic">Cinematic Drama (TCCD standard)</option>
                <option value="documentary">David Attenborough (Slow observational documentary narrator)</option>
              </select>
              <p className="text-[9px] text-stone-600 font-mono leading-normal mt-1">
                {settings.narrationStyle === 'documentary' 
                  ? 'Attenborough Mode: High-fidelity expert TTS engineering. Sub-410 words distinct blocks with zero bracketed tags, punctuation cue-controls (em-dashes/periods), and deliberate syntactic slowing.'
                  : 'Cinematic Mode: Fluid conversational dramatic narration suitable for emotional show openings and punchy pacing.'
                }
              </p>
            </div>

            {/* HEURISTICS ADVANCED COMPRESSION CHECKBOXES */}
            <div className="space-y-2 bg-[#070708] p-3 rounded border border-white/5">
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono block mb-1">Pacing Refactoring Controls</span>
              
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings.allowDramaticPause}
                  onChange={(e) => setSettings(p => ({ ...p, allowDramaticPause: e.target.checked }))}
                  className="rounded text-amber-500 focus:ring-amber-500/30 bg-[#070708] border-white/5 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-xs text-stone-400 group-hover:text-stone-200">Ellipses Pauses (...)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings.allowContrasts}
                  onChange={(e) => setSettings(p => ({ ...p, allowContrasts: e.target.checked }))}
                  className="rounded text-amber-500 focus:ring-amber-500/30 bg-[#070708] border-white/5 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-xs text-stone-400 group-hover:text-stone-200">Pivots &amp; Em Dashes (—)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings.allowFactualPeriods}
                  onChange={(e) => setSettings(p => ({ ...p, allowFactualPeriods: e.target.checked }))}
                  className="rounded text-amber-500 focus:ring-amber-500/30 bg-[#070708] border-white/5 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-xs text-stone-400 group-hover:text-stone-200">Short Declarative Periods (.)</span>
              </label>
            </div>

            {/* REFACTOR SUBMIT BUTTON */}
            <button
              id="trigger-ast-processing"
              type="button"
              onClick={handleRefactorWithGemini}
              disabled={isProcessing || !rawText.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                isProcessing 
                  ? 'bg-stone-900 text-stone-500 border border-white/5 cursor-not-allowed' 
                  : 'bg-stone-100 hover:bg-stone-200 text-[#070708] disabled:opacity-40 disabled:cursor-not-allowed shadow-md'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing block lines...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Structure &amp; Normalize Script</span>
                </>
              )}
            </button>
          </div>

          {/* BLUEPRINTS MANUALS */}
          <PacingHelp />

        </section>

        {/* PANEL RIGHT: Interactive card Blocks, AI Assist Rewrites */}
        <section id="panel-script-output" className="lg:col-span-8 space-y-6">
          
          {/* TOAST SYSTEM ALERTS */}
          {alertMessage && (
            <div
              id="notification-toast"
              className={`p-4 rounded-xl border flex items-start gap-3 shadow-md ${
                alertMessage.type === 'warn'
                  ? 'bg-amber-950/10 border-amber-900/20 text-amber-200'
                  : alertMessage.type === 'success'
                  ? 'bg-emerald-950/10 border-emerald-900/25 text-emerald-200'
                  : 'bg-red-950/15 border-red-900/25 text-red-200'
              }`}
            >
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
              <div className="flex-1 text-xs leading-relaxed font-sans">
                {alertMessage.text}
              </div>
              <button
                type="button"
                onClick={() => setAlertMessage(null)}
                className="text-[9px] uppercase font-mono tracking-widest font-bold opacity-60 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* METRIC SUMMARIES */}
          <div id="script-metadata-bar" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0b0b0c] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-mono font-medium block">Exact Words</span>
                <span className="text-lg font-medium text-stone-100 font-mono tracking-tight block mt-0.5">{getWordCount()}</span>
              </div>
              <div className="p-2 bg-stone-900/50 rounded border border-white/5 text-stone-500">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-[#0b0b0c] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-mono font-medium block">Narration Time</span>
                <span className="text-lg font-medium text-stone-100 font-mono tracking-tight block mt-0.5">{getNarrationDurationText()}</span>
              </div>
              <div className="p-2 bg-stone-900/50 rounded border border-white/5 text-stone-500">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-[#0b0b0c] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-mono font-medium block">Block Count</span>
                <span className="text-lg font-medium text-stone-100 font-mono tracking-tight block mt-0.5">{sections.length}</span>
              </div>
              <div className="p-2 bg-stone-900/50 rounded border border-white/5 text-stone-500">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-[#0b0b0c] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-mono font-medium block">Dramatic Rests</span>
                <span className="text-lg font-medium text-stone-100 font-mono tracking-tight block mt-0.5">{counts.dramatic}</span>
              </div>
              <div className="p-2 bg-stone-900/50 rounded border border-white/5 text-stone-500">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
            </div>
          </div>

          {/* ACTIVE SCRIPT BLOCK workspace BOARD */}
          <div className="bg-[#0b0b0c]/90 border border-white/5 rounded-xl shadow-xl overflow-hidden relative">
            
            {/* Header Control for clean export operations */}
            <div className="bg-[#0c0c0d] px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xs uppercase tracking-widest font-mono text-stone-300 font-bold">Narration Working Draft</h2>
                <p className="text-[11px] text-stone-500 font-sans mt-0.5">Spoken prose ONLY. Absolutely zeroes all brackets, parenthesis, or variables in outputs.</p>
              </div>

              {/* CLEAN SPOKEN EXPORTS */}
              <div className="flex items-center gap-2">
                <button
                  id="copy-script-trigger"
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/60 border border-white/5 hover:border-stone-850 text-stone-300 text-[10px] font-semibold rounded transition uppercase tracking-wider"
                  title="Copy cleaned spoken text without any headers, rules, brackets, or parenthesis"
                >
                  {copiedStatus ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Prose Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-500" />
                      <span>Copy Prose</span>
                    </>
                  )}
                </button>

                <button
                  id="download-script-txt"
                  type="button"
                  onClick={() => handleDownloadFile('txt')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/60 border border-white/5 hover:border-stone-850 text-stone-300 text-[10px] font-semibold rounded transition uppercase tracking-wider"
                  title="Download clean spoken prose .txt"
                >
                  <FileDown className="w-3 h-3" />
                  <span>TXT</span>
                </button>

                <button
                  id="download-script-md"
                  type="button"
                  onClick={() => handleDownloadFile('md')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/60 border border-white/5 hover:border-stone-850 text-stone-300 text-[10px] font-semibold rounded transition uppercase tracking-wider"
                  title="Download clean spoken prose .md"
                >
                  <Download className="w-3 h-3" />
                  <span>MD</span>
                </button>
              </div>
            </div>

            {/* List of Blocks correspond exactly to paragraphs */}
            <div className="p-6 md:p-8 space-y-10 max-h-[720px] overflow-y-auto scrollbar-thin relative z-10">
              {sections.length === 0 ? (
                <div className="text-center py-16">
                  <AudioLines className="w-10 h-10 text-stone-700 mx-auto mb-4 animate-pulse" />
                  <h4 className="text-stone-400 font-sans text-sm font-semibold">No normalized blocks staged</h4>
                  <p className="text-xs text-stone-500 leading-normal max-w-sm mx-auto mt-1">
                    Paste raw transcript paragraphs on the left or load preset episodes to view paced narration blocks instantly.
                  </p>
                </div>
              ) : (
                sections.map((section, sIdx) => (
                  <div key={section.id} className="relative group/section bg-[#070708]/40 border border-white/5 rounded-xl p-5 md:p-6 space-y-5 hover:bg-[#070708]/60 transition-all duration-300 shadow-md">
                    
                    {/* Section Top Header, Click to Edit Block title */}
                    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                      <div className="flex-1 space-y-1">
                        <input
                          id={`sect-title-input-${section.id}`}
                          type="text"
                          value={section.title}
                          onChange={(e) => handleUpdateSectionHeader(section.id, e.target.value, section.summary)}
                          className="bg-transparent border-none text-[10px] text-amber-500/80 font-mono uppercase tracking-[0.2em] font-medium focus:outline-none w-full py-0.5 bg-stone-900/20 px-1 rounded hover:bg-stone-900/40"
                        />
                        <input
                          id={`sect-summary-input-${section.id}`}
                          type="text"
                          value={section.summary}
                          placeholder="Provide target cue or tone..."
                          onChange={(e) => handleUpdateSectionHeader(section.id, section.title, e.target.value)}
                          className="bg-transparent border-none text-[11px] text-stone-500 font-sans italic focus:outline-none w-full py-0.5 px-0.5 rounded hover:bg-stone-900/30"
                        />
                      </div>

                      {/* block word counter & warning */}
                      <div className="flex items-center gap-2 shrink-0 select-none">
                        {(() => {
                          const wCount = section.lines.reduce((total, l) => {
                            return total + (l.text || '').trim().split(/\s+/).filter(Boolean).length;
                          }, 0);
                          return (
                            <span 
                              className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 transition ${
                                wCount > 410 
                                  ? 'bg-rose-950/40 text-rose-400 border-rose-500/40 font-bold animate-pulse' 
                                  : wCount > 355
                                    ? 'bg-amber-950/40 text-amber-500 border-amber-500/40'
                                    : 'bg-stone-900/50 text-stone-500 border-white/5'
                              }`}
                              title={wCount > 410 ? "Warning: Exceeds the strict 410 words block limit for TTS pacing!" : "Block word count"}
                            >
                              <span>{wCount}</span>
                              <span className="opacity-40">/</span>
                              <span>410</span>
                              <span>W</span>
                            </span>
                          );
                        })()}

                        {/* manual line appendix */}
                        <button
                          id={`add-line-endpoint-${section.id}`}
                          type="button"
                          onClick={() => handleAddLine(section.id, section.lines[section.lines.length - 1]?.id || '')}
                          title="Append custom line to this block"
                          className="text-stone-500 hover:text-stone-300 p-1 rounded border border-white/5 bg-[#0b0b0c] transition shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Lines List inside Card Block */}
                    <div className="space-y-4">
                      {section.lines.map((line, lIndex) => {
                        const isThisLineEditing = editingLineId === line.id;
                        
                        // Badge themes matched to indicators
                        const badgeColors = {
                          dramatic: 'bg-amber-950/30 text-amber-400 border-amber-900/20',
                          contrast: 'bg-stone-900 text-stone-300 border-white/5',
                          factual: 'bg-amber-900/10 text-amber-300 border-amber-500/10',
                          break: 'bg-stone-900 text-stone-400 border-transparent',
                          none: 'bg-transparent text-stone-500 border-none'
                        };

                        return (
                          <div
                            key={line.id}
                            id={`line-item-${line.id}`}
                            className="relative flex items-start gap-4 p-2.5 rounded hover:bg-[#0b0b0c]/40 transition group/line"
                          >
                            {/* Sequence dot indicator instead of variables */}
                            <span className="text-[10px] text-stone-600 font-mono py-1 select-none shrink-0 w-4">
                              {lIndex + 1}.
                            </span>

                            {/* Center Line content editable */}
                            <div className="flex-1">
                              {isThisLineEditing ? (
                                <div className="space-y-2">
                                  <textarea
                                    id={`inline-textarea-edit-${line.id}`}
                                    value={editingLineText}
                                    onChange={(e) => setEditingLineText(e.target.value)}
                                    className="w-full bg-[#070708] border border-stone-800 text-stone-200 text-xs rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-sans"
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setEditingLineId(null)}
                                      className="text-[9px] text-stone-500 font-mono hover:text-stone-300 uppercase tracking-wider px-2 py-1"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      id={`save-inline-btn-${line.id}`}
                                      type="button"
                                      onClick={() => handleSaveEditLine(section.id, line.id)}
                                      className="text-[9px] bg-stone-100 hover:bg-stone-200 text-black font-semibold font-mono uppercase tracking-widest px-3 py-1 rounded"
                                    >
                                      Save Statement
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <p 
                                    onClick={() => handleStartEditLine(line.id, line.text)}
                                    className="text-sm text-stone-300 cursor-pointer hover:text-stone-100 transition-colors duration-150 leading-relaxed font-sans font-normal"
                                    title="Click to edit raw line text"
                                  >
                                    {line.text}
                                  </p>
                                  
                                  {/* Pacing Rules tags under each sentence */}
                                  <div className="flex gap-4 items-center pt-1.5 select-none opacity-85 group-hover/line:opacity-100 transition-opacity">
                                    {line.rule !== 'none' && (
                                      <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase tracking-widest font-mono ${badgeColors[line.rule]}`}>
                                        {line.badgeText}
                                      </span>
                                    )}
                                    <span className="text-[8px] uppercase font-mono tracking-widest text-stone-500">
                                      Pace: {line.rule === 'dramatic' ? 'Hollow Rests' : 'Consistent Flow'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Direct surgical controls on hover */}
                            <div className="opacity-0 group-hover/line:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                              <button
                                id={`edit-line-lineicon-${line.id}`}
                                type="button"
                                onClick={() => handleStartEditLine(line.id, line.text)}
                                className="text-stone-500 hover:text-stone-300 p-1 hover:bg-[#0b0b0c] rounded"
                                title="Edit dialogue"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                id={`append-line-lineicon-${line.id}`}
                                type="button"
                                onClick={() => handleAddLine(section.id, line.id)}
                                className="text-stone-500 hover:text-stone-300 p-1 hover:bg-[#0b0b0c] rounded"
                                title="Stitch sentence after"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                id={`remove-line-lineicon-${line.id}`}
                                type="button"
                                onClick={() => handleRemoveLine(section.id, line.id)}
                                className="text-red-900/50 hover:text-red-400 p-1 hover:bg-[#0b0b0c]  rounded"
                                title="Remove line"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* IV. INDEPENDENT AI ASSIST rewrite PANEL */}
                    <div className="mt-4 bg-[#0b0b0c] p-4 rounded-lg border border-white/5 space-y-3 relative overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-amber-500/80 font-mono flex items-center gap-1 font-bold">
                          <Wand2 className="w-3 h-3 text-amber-500" />
                          <span>AI Assist Writing Option</span>
                        </span>
                        
                        <span className="text-[8px] text-stone-600 font-mono uppercase tracking-widest">Model: {selectedModel}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch gap-2">
                        <input
                          id={`assist-instruction-${section.id}`}
                          type="text"
                          placeholder="Tell AI how to rewrite this block (e.g. 'make it colder', 'word it poetically', 'simplify terminology')"
                          value={assistInstructions[section.id] || ''}
                          onChange={(e) => setAssistInstructions(prev => ({ ...prev, [section.id]: e.target.value }))}
                          className="flex-1 bg-[#070708] border border-white/5 rounded px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500/40 placeholder-stone-600 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyBlockAssist(section.id)}
                          disabled={isApplyingAssist && activeAssistSecId === section.id}
                          className="bg-amber-650 hover:bg-amber-600 disabled:bg-stone-900 border border-amber-900/40 text-black hover:text-[#070708] disabled:text-stone-600 px-4 py-1.5 rounded text-[10px] font-mono font-bold uppercase transition tracking-wider shrink-0 flex items-center justify-center gap-1"
                        >
                          {isApplyingAssist && activeAssistSecId === section.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Rewriting...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3 h-3" />
                              <span>Apply AI Assist</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Append whole new card block */}
            {sections.length > 0 && (
              <div className="p-4 bg-[#0a0a0b] border-t border-white/5 text-center">
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-mono tracking-widest uppercase transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Stitch New Paragraph Block</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#0b0b0c] py-6 px-12 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AudioLines className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-stone-500 font-mono">"They Can't Come Down" • Local Production Guide</span>
          </div>
          <div className="text-[10px] text-stone-600 font-mono uppercase tracking-wider">
            Shaun's Private Offline Workspace
          </div>
        </div>
      </footer>
    </div>
  );
}
