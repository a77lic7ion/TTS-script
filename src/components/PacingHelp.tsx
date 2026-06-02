/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export default function PacingHelp() {
  return (
    <div id="pacing-help-container" className="bg-[#0d0d0d]/90 border border-white/5 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="font-medium text-stone-100 font-sans tracking-tight uppercase text-xs">Audio Pacing Blueprint</h3>
      </div>
      
      <p className="text-xs text-stone-400 leading-relaxed mb-4">
        Narrating is about controlling silence. The script normalizer segments prose and injects indicators that instruct the vocal performer how to pace their breathing.
      </p>

      <div className="space-y-3">
        <div id="rule-item-dramatic" className="p-3 bg-stone-900/30 rounded-lg border border-amber-900/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Dramatic Pause</span>
            <span className="text-xs bg-amber-950/40 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">...</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-tight">
            Indicates expectation, dread, or an emotional climax. Add a 1.5 to 2.0-second silence before proceeding.
          </p>
          <p className="text-[10px] text-amber-400/80 italic mt-1 font-mono">
            &quot;And you... had not been.&quot;
          </p>
        </div>

        <div id="rule-item-contrast" className="p-3 bg-stone-900/30 rounded-lg border border-stone-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Contrast / Pivot</span>
            <span className="text-xs bg-stone-900 text-stone-300 px-1.5 py-0.5 rounded border border-white/5 font-mono">—</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-tight">
            Signifies sudden redirects, opposition, or contradictions. Pivot the tone from gentle observation to harsh realism.
          </p>
          <p className="text-[10px] text-stone-400 italic mt-1 font-mono">
            &quot;This is not vanity — this is harm.&quot;
          </p>
        </div>

        <div id="rule-item-factual" className="p-3 bg-stone-900/30 rounded-lg border border-amber-950/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider font-sans">Forced Period</span>
            <span className="text-xs bg-amber-950/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-900/30 font-mono">.</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-tight">
            Forces clean, complete stops on adjacent parallel clauses. Essential for highlighting statistics or physical features.
          </p>
          <p className="text-[10px] text-amber-300 italic mt-1 font-mono">
            &quot;Smoother skin. Bigger eyes. Slimmer jawline.&quot;
          </p>
        </div>

        <div id="rule-item-break" className="p-3 bg-stone-900/30 rounded-lg border border-stone-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Phrase Split</span>
            <span className="text-xs bg-stone-900 text-stone-400 px-1.5 py-0.5 rounded border border-white/5 font-mono">⏎</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-tight">
            Sub-divides compound thoughts into singular breath blocks. Always keep line widths short so the reader remains steady.
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-[#0a0a0a] rounded-lg flex items-start gap-2 border border-white/5">
        <Info className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
        <p className="text-[10px] text-stone-500 leading-relaxed font-mono">
          <strong>Tip:</strong> Estimated voice reading speeds operate on a default of 130 words-per-minute (WPM) to allow for these scripted emotional rests.
        </p>
      </div>
    </div>
  );
}
