import type { NodeObject } from "react-force-graph-2d";

export interface GraphNode extends NodeObject {
  id: string;
  label?: string;
  type?: "blog" | "concept";
  color?: string;
  title?: string;  // ← this is missing! 
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}