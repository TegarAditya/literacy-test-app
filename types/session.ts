export interface Sessions {
    data: Session[];
    meta: Meta;
}

export interface Session {
    id:         number;
    attributes: Attributes;
}

export interface Attributes {
    name:        string;
    token:       string;
    end:         Date;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
    start:       Date;
    duration:    number;
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
