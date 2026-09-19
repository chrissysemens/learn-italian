import { CefrLevel } from "../../types";

export interface Topic {
  id: string;
  level: CefrLevel;

  name: string;
  description: string;

  tags: string[];
}