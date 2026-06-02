/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScriptLine {
  id: string;
  text: string;
  rule: 'dramatic' | 'contrast' | 'factual' | 'break' | 'none';
  badgeText: string;
}

export interface ScriptSection {
  id: string;
  title: string;
  summary: string;
  lines: ScriptLine[];
}

export type RefactorStrictness = 'conservative' | 'moderate' | 'aggressive';

export interface RefactoringSettings {
  strictness: RefactorStrictness;
  allowDramaticPause: boolean;
  allowContrasts: boolean;
  allowFactualPeriods: boolean;
  allowLineBreaks: boolean;
}

export interface DefaultNarrativeTemplate {
  title: string;
  description: string;
  episodes: {
    episodeNumber: number;
    title: string;
    rawText: string;
    sections: {
      title: string;
      summary: string;
      lines: {
        text: string;
        rule: 'dramatic' | 'contrast' | 'factual' | 'break' | 'none';
        badgeText: string;
      }[];
    }[];
  }[];
}
