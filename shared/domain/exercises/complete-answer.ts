export interface CompleteAnswer {
  type: 'complete';
  values: Record<string, string>;
}