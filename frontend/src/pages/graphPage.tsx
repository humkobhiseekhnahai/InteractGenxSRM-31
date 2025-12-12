"use client"

// src/pages/GraphPage.tsx

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchRootGraph } from "../api/graph"
import { useGraphStore } from "../state/graphStore"
import GraphView from "../components/GraphView"
import LoadingSpinner from "../components/LoadingSpinner"
import GraphBackButton from "../components/graphBackButton"

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Pure black base */}
      <div className="absolute inset-0 bg-black" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Single subtle warm gradient orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(232, 121, 102, 0.03) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />
    </div>
  )
}

export default function GraphPage() {
  const { graphData, setGraphData } = useGraphStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRootGraph()
      .then((g) => setGraphData(g))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [setGraphData])

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <AnimatedBackground />

      <AnimatePresence mode="wait">
        {loading || !graphData ? (
          <motion.div
            key="loading"
            className="w-full h-full flex flex-col items-center justify-center gap-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <LoadingSpinner />
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <p className="text-white/60 text-sm tracking-wide font-light">Loading graph...</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="graph"
            className="w-full h-full relative flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="relative z-20 px-8 py-5"
              style={{
                background: "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <GraphBackButton />
                </motion.div>

                <motion.h1
                  className="text-lg font-light tracking-[0.2em] text-white/90 uppercase"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Knowledge Graph
                </motion.h1>

                <motion.div
                  className="flex items-center gap-6 text-xs tracking-wider"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="text-white/50 font-light">{graphData.nodes.length} nodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e87966]" />
                    <span className="text-white/50 font-light">{graphData.links.length} links</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Graph Area */}
            <div className="flex-1 relative">
              <GraphView />
            </div>

            <motion.div
              className="relative z-20 px-8 py-4"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8 text-[11px] tracking-wider text-white/40 font-light">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)",
                      }}
                    />
                    <span>Concept</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #e87966 0%, #c45a48 100%)",
                      }}
                    />
                    <span>Blog Post</span>
                  </div>
                </div>

                <div className="text-[11px] tracking-wider text-white/30 font-light">
                  Click nodes to explore · Drag to pan · Scroll to zoom
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
