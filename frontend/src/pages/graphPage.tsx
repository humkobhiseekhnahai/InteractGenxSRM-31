import { useEffect, useState } from "react";
import { fetchRootGraph } from "../api/graph";
import { useGraphStore } from "../state/graphStore";
import GraphView from "../components/GraphView";
import LoadingSpinner from "../components/LoadingSpinner";

export default function GraphPage() {
  const { graphData, setGraphData, popHistory } = useGraphStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRootGraph()
      .then((g) => setGraphData(g))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setGraphData]);

  if (loading || !graphData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  function handleBack() {
    const prev = popHistory();
    if (prev) {
      setGraphData(prev);
    }
  }

  return (
    <div className="w-full h-full relative">
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 bg-neutral-800/80 text-white px-4 py-2 rounded-lg border border-white/10 hover:bg-neutral-700 transition"
      >
        ← Back
      </button>

      <GraphView data={graphData} />
    </div>
  );
}