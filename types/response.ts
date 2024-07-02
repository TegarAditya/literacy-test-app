export interface Responses {
    data: Response[];
    meta: Meta;
}

export interface Response {
    id:         number;
    attributes: Attributes;
}

export interface Attributes {
    userData:    UserData;
    userAnswer:  UserAnswers | null;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
}

export interface UserAnswers {
    data: UserAnswer[];
}

export interface UserAnswer {
    duration:      number;
    isNotSure:     boolean;
    option_code:   null | string;
    question_code: string;
}

export interface UserData {
    age:        string;
    name:       string;
    gender:     Gender;
    school:     string;
    schoolType: SchoolType;
}

export enum Gender {
    L = "L",
    P = "P",
}

export enum SchoolType {
    Negeri = "negeri",
    Swasta = "swasta",
}

export interface Meta {
    pagination: Pagination;
}

export interface Pagination {
    page:      number;
    pageSize:  number;
    pageCount: number;
    total:     number;
}
