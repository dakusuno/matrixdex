interface MangaAttribute {
  title: MangaLanguage;
}

interface MangaLanguage {
  en: string;
}

interface Manga {
  id: string;
  type: string;
  attributes: MangaAttribute;
}
