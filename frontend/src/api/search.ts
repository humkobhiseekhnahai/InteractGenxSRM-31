import { api } from "./client";

export interface SearchResult {
  id: string;
  type: "blog" | "concept";
  title?: string;
  name?: string;
  snippet?: string;
}

export async function searchQuery(q: string): Promise<SearchResult[]> {
  if (!q.trim()) return [];

  const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
  return res.data.results;
}