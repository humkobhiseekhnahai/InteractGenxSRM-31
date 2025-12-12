import { api } from "./client";
import type { GraphData } from "../types/graph";

// Fetch root graph (concept graph)
export async function fetchRootGraph(): Promise<GraphData> {
  const res = await api.get("/graph"); 
  return res.data;
}

// Fetch expanded graph around a specific node (blog or concept)
export async function fetchGraphExpand(id: string): Promise<GraphData> {
  const res = await api.get(`/graph/expand?id=${encodeURIComponent(id)}`);
  return res.data;
}

export async function fetchGraphById(id: string): Promise<GraphData> {
  const res = await api.get(`/graph?id=${encodeURIComponent(id)}`);
  return res.data;
}