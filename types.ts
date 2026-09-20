export type CefrLevel =
    | 'A1'
    | 'A2'
    | 'B1'
    | 'B2'
    | 'C1'
    | 'C2';

export type CompetencyCategory =
  | 'grammar'
  | 'communication'

export type ExerciseType =
  | 'translate_en_it'
  | 'translate_it_en'
  | 'complete'
  | 'respond'
  | 'describe'
  | 'conversation'
  | 'review';


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