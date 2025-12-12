// src/api/blog.ts
import { api } from "./client";

export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string; // HTML or sanitized HTML
  conceptIds?: string[];
  relatedIds?: string[];
  embedding?: number[] | null;
}

export async function getBlogById(id: string): Promise<BlogPost> {
  const res = await api.get(`/blogs/${encodeURIComponent(id)}`);
  return res.data;
}