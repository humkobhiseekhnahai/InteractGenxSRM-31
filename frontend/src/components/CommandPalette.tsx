import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "../state/uiStore";
import { useState, useEffect } from "react";
import { searchQuery } from "../api/search";
import type { SearchResult } from "../api/search";
import { useGraphStore } from "../state/graphStore";

export default function CommandPalette() {
    const open = useUIStore((s) => s.commandOpen);
    const setOpen = useUIStore((s) => s.setCommandOpen);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Cleaned query (derived value)
    const cleanedQuery = query.trim();

    useEffect(() => {
        if (cleanedQuery === "") {
            queueMicrotask(() => {
                setResults([]);
                setLoading(false);
            });
        }
    }, [cleanedQuery]);

    useEffect(() => {
        if (cleanedQuery === "") return;

        const timer = window.setTimeout(async () => {
            setLoading(true);
            const r = await searchQuery(cleanedQuery);
            setResults(r);
            setLoading(false);
        }, 300);

        return () => window.clearTimeout(timer);
    }, [cleanedQuery]);

    function close() {
        setOpen(false);
        setQuery("");
        setResults([]);
    }

    return (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={close}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="w-125 bg-neutral-900 text-white rounded-xl shadow-xl p-4 border border-white/10"
                    >
                        {/* Search input */}
                        <input
                            autoFocus
                            placeholder="Search topics or blogs..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-3 rounded-lg bg-neutral-800 outline-none"
                        />

                        {/* Results */}
                        <div className="mt-3 max-h-80 overflow-y-auto">
                            {loading && (
                                <div className="text-neutral-400 text-sm p-2">Searching...</div>
                            )}

                            {!loading && results.length === 0 && query.trim() && (
                                <div className="text-neutral-500 text-sm p-2">No results found</div>
                            )}

                            {Array.isArray(results) &&
                                results.map((item) => (
                                    <button
                                        key={item.id}
                                        className="w-full text-left px-3 py-2 hover:bg-neutral-800 rounded-lg transition"
                                        onClick={() => {
                                            close();
                                            // 🔥 Focus graph on the selected node
                                            useGraphStore.getState().focusNode(item.id);
                                        }}
                                    >
                                        <div className="text-white font-semibold">
                                            {item.type === "concept" ? item.name : item.title}
                                        </div>

                                        {item.snippet && (
                                            <div className="text-neutral-400 text-sm">{item.snippet}</div>
                                        )}

                                        <div className="text-xs text-neutral-500 mt-1">
                                            {item.type?.toUpperCase?.() ?? ""}
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}