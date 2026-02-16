import type { Ref } from 'vue';

export interface CaseItemBase {
  path: string;
  lastModified: number;
  title: string;
  description: string;
  image: string;
  industries: string;
  fieldsOfInterest: string;
}

export interface CaseItem extends Omit<
  CaseItemBase,
  'fieldsOfInterest' | 'industries'
> {
  industries: string[];
  fieldsOfInterest: string[];
}

export interface QuickAnswerBase {
  label: string;
  filter: string;
}
export interface QuickAnswer {
  label: string;
  filter: string[];
}

export type SearchSuggestions = { suggestion: string }[];

export interface Portfolio {
  cases: Ref<CaseItem[] | null>;
  quickAnswers: Ref<QuickAnswer[] | null>;
  searchSuggestions: Ref<SearchSuggestions | null>;
}

export interface Option {
  label: string;
  value: string | number;
}
