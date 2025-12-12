// src/api/graph.ts
import { api } from "./client";
import type { GraphData } from "../types/graph";

// ROOT GRAPH
export async function fetchRootGraph(): Promise<GraphData> {
  const res = await api.get("/graph");
  return res.data;
}

// CONCEPT EXPANSION → /graph?id=conceptId
export async function fetchConceptGraph(id: string): Promise<GraphData> {
  const res = await api.get(`/graph?id=${id}`);
  return res.data;
}

// BLOG EXPANSION → /graph/expand?id=blogId
export async function fetchGraphExpand(id: string): Promise<GraphData> {
  const res = await api.get(`/graph/expand?id=${id}`);
  return res.data;
}