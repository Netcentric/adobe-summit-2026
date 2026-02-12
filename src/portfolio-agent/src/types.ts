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

export interface Option {
  label: string;
  value: string | number;
}
