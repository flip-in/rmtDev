export type JobItem = {
  id: number;
  badgeLetters: string;
  title: string;
  company: string;
  relevanceScore: number;
  daysAgo: number;
};

export type JobItemExpanded = JobItem & {
  description: string;
  location: string;
  salary: string;
  reviews: string[];
  qualifications: string[];
  coverImgURL: string;
  companyURL: string;
  duration: string;
};

export type PageDirection = 'next' | 'previous'

export type SortBy = 'relevant' | 'recent';