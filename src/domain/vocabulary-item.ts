import { CefrLevel } from "../../types";

export interface VocabularyItem {
  id: string;
  level: CefrLevel;

  italian: string;
  english: string;

  partOfSpeech:
    | 'noun'
    | 'verb'
    | 'adjective'
    | 'adverb'
    | 'preposition'
    | 'other';

  tags: string[];
}