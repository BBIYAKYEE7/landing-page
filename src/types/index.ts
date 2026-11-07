export interface Section {
  title: string;
  highlight: string;
  hashtag: string;
  image?: string | null;
  detailLink: string;
}

export interface DetailSection {
  id: string;
  isTitle?: boolean;
  title: string;
  highlight?: string;
  hashtag?: string;
  description: string;
  image?: string;
}

export interface ProjectSections {
  [key: number]: DetailSection[];
}

