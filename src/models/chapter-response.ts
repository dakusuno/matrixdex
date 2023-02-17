export interface Chapter {
  id: string;
  relationships: Array<Manga>;
  attributes: ChapterAttributes;
}

export interface ChapterResponse {
  data: Array<Chapter>;
}

export interface ChapterAttributes {
  chapter: string;
}
