export interface GuideResponse {
    guide: Guide;
}

export interface Guide {
    data: GuideData;
}

export interface GuideData {
    attributes: Attributes;
}

export interface Attributes {
    guide_field: string;
}
