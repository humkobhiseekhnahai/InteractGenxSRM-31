import type { GraphNode } from "../types/graph";

export interface GraphLink {
  source: string;
  target: string;
}

export const mockGraphData = {
  nodes: [
    { id: "1", title: "AI", type: "concept" },
    { id: "2", title: "Cybersecurity", type: "concept" },
    { id: "3", title: "AI in Cybersecurity", type: "blog" }
  ] as GraphNode[],
  links: [
    { source: "1", target: "3" },
    { source: "2", target: "3" }
  ] as GraphLink[]
};