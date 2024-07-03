export interface Data {
  questions: Questions;
}

export interface Questions {
  data: Question[];
}

export interface Question {
  attributes: QuestionAttributes;
}

export interface QuestionAttributes {
  code: string;
  options: Options;
}

export interface Options {
  data: Option[];
}

export interface Option {
  attributes: OptionAttributes;
}

export interface OptionAttributes {
  code: string;
  is_correct: boolean;
}
