import { useGraphStore } from "../state/graphStore";

export default function GraphBackButton() {
  const { popGraphHistory, setGraphData } = useGraphStore();

  function handleBack() {
    const prev = popGraphHistory();
    if (prev) setGraphData(prev);
  }

  return (
    <button
      onClick={handleBack}
      className="absolute top-4 left-4 z-50
        px-3 py-1.5 rounded-md
        bg-black/40 backdrop-blur-md
        border border-white/10 text-neutral-300 hover:text-white"
    >
      ← Back
    </button>
  );
}