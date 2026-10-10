export type CompleteSegment =
  | {
      type: 'text';
      value: string;
    }
  | {
      type: 'blank';
      id: string;
    };

export interface CompleteExerciseContent {
  instruction: string;
  segments: CompleteSegment[];
}