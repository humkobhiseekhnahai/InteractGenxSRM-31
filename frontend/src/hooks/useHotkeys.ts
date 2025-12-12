import { useEffect } from "react";
import { useUIStore } from "../state/uiStore";

export function useHotkeys() {
  const toggleCommand = useUIStore((s) => s.toggleCommand);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommand();
      }

      // Escape closes palette
      if (e.key === "Escape") {
        useUIStore.setState({ commandOpen: false });
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleCommand]);
}