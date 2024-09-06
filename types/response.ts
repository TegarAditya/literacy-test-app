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
    userAnswer:  UserAnswers;
    sessionData: SessionData;
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

export interface SessionData {
    id:         number;
    attributes: SessionDataAttributes;
}

export interface SessionDataAttributes {
    end:         Date;
    name:        string;
    start:       Date;
    token:       string;
    duration:    number;
    createdAt:   Date;
    threshold:   null;
    updatedAt:   Date;
    publishedAt: Date;
}

export interface UserData {
    age:        string;
    name:       string;
    gender:     string;
    school:     string;
    schoolType: string;
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
