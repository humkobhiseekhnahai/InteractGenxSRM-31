import BlogModal from "./components/BlogModal";
import CommandPalette from "./components/CommandPalette";
import { useHotkeys } from "./hooks/useHotkeys";
import GraphPage from "./pages/graphPage";

function App() {
  useHotkeys();

  return (
    <div className="w-full h-full bg-black text-white">
      <GraphPage />
      <CommandPalette />
      <BlogModal /> 
    </div>
  );
}

export default App;