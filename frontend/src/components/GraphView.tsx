import ForceGraph2D from "react-force-graph-2d";
import type {
  ForceGraphMethods,
  NodeObject,
  LinkObject,
} from "react-force-graph-2d";

import { useRef, useEffect } from "react";
import { useGraphStore } from "../state/graphStore";
import type { GraphNode } from "../types/graph";
import { useUIStore } from "../state/uiStore";

interface GraphLink {
  source: string;
  target: string;
}

interface Props {
  data: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
}

export default function GraphView({ data }: Props) {
  // Correct ref type — this is the only one that works perfectly
  const fgRef = useRef<ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>>(null!);

  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const highlightNodeId = useGraphStore((s) => s.highlightNodeId);
  const setSelectedNode = useGraphStore((s) => s.setSelectedNode);
  const setHighlightNode = useGraphStore((s) => s.setHighlightNode);
  const openBlogModal = useUIStore((s) => s.openBlogModal);

  // Zoom to selected node
  useEffect(() => {
    if (!selectedNodeId || !fgRef.current) return;

    const node = data.nodes.find((n) => n.id === selectedNodeId);
    if (!node?.x || !node?.y) return;

    const distance = 160;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y);

    fgRef.current.centerAt(node.x, node.y, 800);
    fgRef.current.zoom(distRatio, 800);

    setHighlightNode(node.id);
    const timer = setTimeout(() => setHighlightNode(null), 1600);
    return () => clearTimeout(timer);
  }, [selectedNodeId, data.nodes, setHighlightNode]);

  return (
    <ForceGraph2D<GraphNode, GraphLink>
      ref={fgRef}
      graphData={data}
      nodeId="id"
      nodeLabel="title"
      linkSource="source"
      linkTarget="target"
      backgroundColor="#0b0c10"
      nodeRelSize={6}
      cooldownTime={1500}

      // CORRECT ways to customize forces:
      onEngineTick={() => {
        const sim = fgRef.current?.d3Force("charge");
        if (sim) sim.strength(-2600);
      }}

      // OR use the newer, cleaner API (recommended):
      // d3ForceProps={{
      //   charge: { strength: -2600 },
      //   link: { distance: 120 },
      // }}

      linkWidth={2}
      linkDirectionalParticles={2}
      linkDirectionalParticleSpeed={0.005}
      linkCurvature={0.2}

      nodeCanvasObject={(node, ctx, globalScale) => {
        if (node.x == null || node.y == null) return;

        const gnode = node as GraphNode;
        const label = gnode.title ?? "";
        const fontSize = Math.max(14 / globalScale, 9);

        const isSelected = gnode.id === selectedNodeId;
        const isHighlighted = gnode.id === highlightNodeId;

        // Glow pulse for highlight
        if (isHighlighted) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI, false);
          ctx.fillStyle = "rgba(255, 215, 70, 0.3)";
          ctx.fill();
        }

        // Main node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7, 0, 2 * Math.PI, false);

        if (gnode.type === "concept") {
          ctx.fillStyle = isSelected ? "#F9D85E" : "#ffffff";
        } else {
          ctx.fillStyle = isSelected ? "#6EC6FF" : "#a0d8ff";
        }

        ctx.shadowColor = isSelected ? "#ffd744" : isHighlighted ? "#ffd744" : "transparent";
        ctx.shadowBlur = isSelected || isHighlighted ? 20 : 0;
        ctx.fill();

        // Label
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#d0d8e5";
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, node.x + 11, node.y);
      }}

      onNodeClick={(node) => {
        const gnode = node as GraphNode;
        setSelectedNode(gnode.id);
        if (gnode.type === "blog") {
          openBlogModal(gnode.id);
        }
      }}
    />
  );
}