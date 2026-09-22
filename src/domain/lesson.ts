export interface Lesson {
  id: string;
  sequence: number;
  competencyIds: string[];
  topicId?: string;
  exerciseId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface NewLesson {
  competencyIds: string[];
  topicId?: string;
  exerciseId: string;
  title: string;
  content: string;
}