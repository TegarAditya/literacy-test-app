export interface Data {
  stems: Stems;
}

export interface Stems {
  data: Stem[];
  meta: Meta;
}

export interface Stem {
  id: string;
  attributes: {
    name: string;
    stem_field: string;
    questions: Questions;
  };
}

export interface Questions {
  data: Question[];
}

export interface Question {
  id: string;
  attributes: {
    code: string;
    order: number;
    question_field: string;
    options: Options;
  };
}

export interface Options {
  data: Option[];
}

export interface Option {
  attributes: {
    option: string;
    is_correct: boolean;
    code: string;
  };
}

export interface Meta {
  pagination: {
    total: number;
  };
}

export interface Answers {
  data: Answer[];
}

export interface Answer {
  question_code: string;
  option_code: string | null;
  isNotSure: boolean;
  duration?: number;
}
