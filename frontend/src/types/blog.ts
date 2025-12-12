export interface Blog {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;

  // Add missing fields returned by backend:
  related?: {
    id: string;
    title: string;
    excerpt?: string;
  }[];

  concepts?: {
    id: string;
    name: string;
    slug?: string;
  }[];
}