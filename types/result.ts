export interface Main {
  data: Data;
}

export interface Data {
  options: Options;
}

export interface Options {
  data: Option[];
}

export interface Option {
  id:         string;
  attributes: Attributes;
}

export interface Attributes {
  code: string;
}
