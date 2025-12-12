import ForceGraph2D from "react-force-graph-2d";
import type {
  ForceGraphMethods,
  NodeObject,
  LinkObject,
} from "react-force-graph-2d";

import { useEffect, useRef, useState } from "react";
import { fetchGraphExpand } from "../api/graph";
import type { GraphData, GraphNode, GraphLink } from "../types/graph";
import { useUIStore } from "../state/uiStore";

export default function SmallGraphView({ centerId }: { centerId: string }) {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], links: [] });

  // Perfectly typed ref – no more errors
  const fgRef = useRef<
    ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>
  >(null!);

  const openBlogModal = useUIStore((s) => s.openBlogModal);

  useEffect(() => {
    let mounted = true;

    fetchGraphExpand(centerId).then((data) => {
      if (!mounted) return;
      setGraph(data);

      // Center + zoom after render
      setTimeout(() => {
        if (!fgRef.current || data.nodes.length === 0) return;
        const centerNode =
          data.nodes.find((n) => n.id === centerId) ?? data.nodes[0];

        // These are guaranteed to exist after the force simulation starts,
        // but TypeScript doesn't know that yet → safe non-null assertion
        fgRef.current.centerAt(centerNode.x ?? 0, centerNode.y ?? 0, 300);
        fgRef.current.zoomToFit(400, 100);
      }, 100);
    });

    return () => {
      mounted = false;
    };
  }, [centerId]);

  return (
    <ForceGraph2D<GraphNode, GraphLink>
      ref={fgRef}
      graphData={graph}
      nodeId="id"
      nodeLabel="title"
      linkSource="source"
      linkTarget="target"
      backgroundColor="transparent"
      onNodeClick={(node) => {
        // node is NodeObject<GraphNode> → cast once
        const n = node as GraphNode;
        if (n.type === "blog") {
          openBlogModal(n.id);
        }
      }}
      nodeCanvasObject={(node, ctx, globalScale) => {
        // Here node is NodeObject<GraphNode>
        // x and y are added by the force engine → they can be undefined on the very first paint
        // → guard + non-null assertion after check (this is the idiomatic way)
        if (node.x == null || node.y == null) return;

        const radius = 5;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);

        const typedNode = node as GraphNode; // now we have your custom properties safely
        ctx.fillStyle = typedNode.type === "blog" ? "#ffcc66" : "#66ccff";
        ctx.fill();

        const label = typedNode.title ?? "";
        const fontSize = Math.max(12 / globalScale, 9);

        ctx.font = `${fontSize}px Inter`;
        ctx.fillStyle = "#e0e0e0";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, node.x + 8, node.y);
      }}
    />
  );
}