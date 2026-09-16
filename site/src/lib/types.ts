export interface Question {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  frequency: number;
  acceptance: number;
  link: string;
  topics: string[];
}

export interface CompanyData {
  name: string;
  slug: string;
  timeWindows: {
    '30d': Question[];
    '3m': Question[];
    '6m': Question[];
    '6m_plus': Question[];
    all: Question[];
  };
}

export interface CompanyIndex {
  name: string;
  slug: string;
  questionCount: number;
  topics: string[];
}

export interface IndexData {
  companies: CompanyIndex[];
  totalQuestions: number;
}

export type TimeWindow = '30d' | '3m' | '6m' | '6m_plus' | 'all';
export type Difficulty = 'ALL' | 'EASY' | 'MEDIUM' | 'HARD';
export type SortField = 'id' | 'title' | 'difficulty' | 'frequency' | 'acceptance';
export type SortDirection = 'asc' | 'desc';
