export type CefrLevel =
    | 'A1'
    | 'A2'
    | 'B1'
    | 'B2'
    | 'C1'
    | 'C2';

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

export type ExerciseDifficulty =
    | 'easy'
    | 'standard'
    | 'hard';

export type LearnerErrorStatus =
    | 'active'
    | 'improving'
    | 'resolved';


export type LearnerErrorCategory =
    | 'grammar'
    | 'vocabulary'
    | 'spelling'
    | 'word_order'
    | 'article'
    | 'preposition'
    | 'verb_form'
    | 'tense'
    | 'agreement'
    | 'pronoun'
    | 'collocation'
    | 'register'
    | 'punctuation'
    | 'other';