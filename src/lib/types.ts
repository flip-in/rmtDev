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