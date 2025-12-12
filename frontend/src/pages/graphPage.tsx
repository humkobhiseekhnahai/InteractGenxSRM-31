// src/pages/GraphPage.tsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRootGraph } from "../api/graph";
import { useGraphStore } from "../state/graphStore";
import GraphView from "../components/GraphView";
import LoadingSpinner from "../components/LoadingSpinner";
import GraphBackButton from "../components/graphBackButton";

// Twinkling stars component
function TwinklingStars() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function GraphPage() {
  const { graphData, setGraphData } = useGraphStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRootGraph()
      .then((g) => setGraphData(g))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setGraphData]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* Twinkling stars background */}
      <TwinklingStars />

      {/* Ambient gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at 20% 30%, rgba(100, 100, 100, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(150, 150, 150, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(100, 100, 100, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          x: ["-20%", "120%"],
          y: ["10%", "80%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(150, 150, 150, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          x: ["100%", "-20%"],
          y: ["70%", "20%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <AnimatePresence mode="wait">
        {loading || !graphData ? (
          <motion.div 
            key="loading"
            className="w-full h-full flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoadingSpinner />
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-neutral-400 text-sm mb-1">Loading knowledge graph...</p>
              <p className="text-neutral-600 text-xs">Preparing your exploration experience</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="graph"
            className="w-full h-full relative flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top Navigation Bar */}
            <motion.div
              className="relative z-20 px-6 py-4 border-b border-white/5"
              style={{
                background: "linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 100%)",
                backdropFilter: "blur(10px)",
              }}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                {/* Left: Empty space to avoid overlap */}
                <div className="w-32" />

                {/* Center: Title */}
                <motion.div
                  className="flex-1 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-xl font-semibold bg-gradient-to-r from-amber-400 via-orange-300 to-red-400 bg-clip-text text-transparent">
                    Knowledge Graph
                  </h1>
                </motion.div>

                {/* Right: Stats moved here */}
                <motion.div
                  className="flex items-center gap-4 text-xs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                    <span className="text-neutral-400">
                      <span className="text-white font-semibold">{graphData.nodes.length}</span> nodes
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span className="text-neutral-400">
                      <span className="text-white font-semibold">{graphData.links.length}</span> connections
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Graph Area */}
            <div className="flex-1 relative">
              {/* Back button positioned absolutely to avoid overlap */}
              <motion.div
                className="absolute top-6 left-6 z-20"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <GraphBackButton />
              </motion.div>

              <GraphView />
            </div>

            {/* Bottom Info Bar */}
            <motion.div
              className="relative z-20 px-6 py-3 border-t border-white/5"
              style={{
                background: "linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.95) 100%)",
                backdropFilter: "blur(10px)",
              }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                {/* Legend */}
                <div className="flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-lg shadow-gray-400/30" />
                    <span className="text-neutral-400">Concept Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg shadow-gray-500/30" />
                    <span className="text-neutral-400">Blog Post</span>
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-neutral-500">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>Click to explore • Drag to navigate</span>
                  </div>
                </div>

                {/* Controls hint */}
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-black/50 rounded border border-white/10">⌘</kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-black/50 rounded border border-white/10">scroll</kbd>
                    <span className="ml-1">zoom</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5">
                    <span>Right-click</span>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-black/50 rounded border border-white/10">drag</kbd>
                    <span className="ml-1">pan</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating help tooltip - moved to bottom right */}
            <motion.div
              className="absolute bottom-20 right-6 max-w-xs px-4 py-3 rounded-xl border border-gray-500/20 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
                boxShadow: "0 8px 32px -8px rgba(150, 150, 150, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 7v5M8 4.5v.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1 text-xs">
                  <p className="text-white font-medium mb-1">Getting Started</p>
                  <p className="text-neutral-400 leading-relaxed">
                    Click on any node to dive deeper into concepts or read blog posts. 
                    The graph will expand to show related content.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}