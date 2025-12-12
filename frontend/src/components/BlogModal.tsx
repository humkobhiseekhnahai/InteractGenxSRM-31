// src/components/BlogModal.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "../state/uiStore";
import { useEffect, useState, useCallback } from "react";
import { getBlogById } from "../api/blog";
import LoadingSpinner from "./LoadingSpinner";
import type { Blog } from "../types/blog";

export default function BlogModal() {
  const blogModalOpen = useUIStore((s) => s.blogModalOpen);
  const currentBlogId = useUIStore((s) => s.currentBlogId);
  const close = useUIStore((s) => s.closeBlogModal);
  const popHistory = useUIStore((s) => s.popHistory);
  const pushHistory = useUIStore((s) => s.pushHistory);
  const openBlogModal = useUIStore((s) => s.openBlogModal);

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);

  // Load blog whenever modal opens or ID changes
  useEffect(() => {
    if (!blogModalOpen || !currentBlogId) return;

    let mounted = true;
    queueMicrotask(() => setLoading(true));

    getBlogById(currentBlogId)
      .then((b) => {
        if (mounted) setBlog(b);
      })
      .catch((e) => console.error("getBlogById error", e))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [blogModalOpen, currentBlogId]);

  // Reset data when modal closes
  useEffect(() => {
    if (!blogModalOpen) {
      queueMicrotask(() => setBlog(null));
    }
  }, [blogModalOpen]);

  // ESC handler
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        close();
      }
    },
    [close]
  );

  useEffect(() => {
    if (!blogModalOpen) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [blogModalOpen, onKeyDown]);

  // Back button logic
  function handleBack() {
    const prev = popHistory();
    if (!prev) {
      close();
      return;
    }
    openBlogModal(prev);
  }

  return (
    <AnimatePresence>
      {blogModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Enhanced Backdrop */}
          <motion.div
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-lg"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(16px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            aria-hidden
          />

          {/* Modal Container */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 10, opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(30, 30, 35, 0.98) 0%, rgba(20, 20, 25, 0.98) 100%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Header Bar */}
            <motion.div 
              className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/5"
              style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)",
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Back button */}
              <motion.button
                onClick={handleBack}
                className="flex items-center gap-2 text-neutral-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path 
                    d="M10 12L6 8L10 4" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-sm">Back</span>
              </motion.button>

              {/* Title hint */}
              {!loading && blog && (
                <motion.div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-neutral-500 text-center truncate">{blog.title}</p>
                </motion.div>
              )}

              {/* Close button */}
              <motion.button
                onClick={close}
                className="flex items-center justify-center w-9 h-9 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path 
                    d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            </motion.div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                className="p-8 pb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {/* Loading State */}
                {loading && (
                  <motion.div 
                    className="w-full h-96 flex flex-col items-center justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <LoadingSpinner />
                    <p className="text-sm text-neutral-500">Loading content...</p>
                  </motion.div>
                )}

                {/* Blog Content */}
                {!loading && blog && (
                  <motion.article 
                    className="prose prose-invert prose-lg max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Title */}
                    <motion.h1 
                      className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent leading-tight"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {blog.title}
                    </motion.h1>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <motion.div 
                        className="text-lg text-neutral-400 mb-8 pb-6 border-b border-white/5 leading-relaxed"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                      >
                        {blog.excerpt}
                      </motion.div>
                    )}

                    {/* Main Content */}
                    <motion.div
                      className="mt-6 text-neutral-200 leading-relaxed prose-headings:text-neutral-100 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 prose-strong:text-neutral-100 prose-code:text-neutral-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900/50 prose-pre:border prose-pre:border-white/5"
                      dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    />

                    {/* Related Posts Section */}
                    {blog.related && blog.related.length > 0 && (
                      <motion.div 
                        className="mt-16 pt-8 border-t border-white/10"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                          <span className="w-1 h-6 bg-gradient-to-b from-neutral-400 to-neutral-600 rounded-full" />
                          Related Posts
                        </h3>

                        <div className="grid gap-4">
                          {blog.related.map((rel, idx) => (
                            <motion.button
                              key={rel.id}
                              className="group text-left px-6 py-4 rounded-xl transition-all duration-300 border border-white/5 hover:border-white/10"
                              style={{
                                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)",
                              }}
                              whileHover={{ 
                                scale: 1.01,
                                x: 4,
                                boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.3)"
                              }}
                              whileTap={{ scale: 0.99 }}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.45 + idx * 0.05 }}
                              onClick={() => {
                                if (currentBlogId) pushHistory(currentBlogId);
                                openBlogModal(rel.id);
                              }}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-white group-hover:text-neutral-200 transition-colors mb-1">
                                    {rel.title}
                                  </div>
                                  {rel.excerpt && (
                                    <div className="text-sm text-neutral-500 line-clamp-2">
                                      {rel.excerpt}
                                    </div>
                                  )}
                                </div>
                                <svg 
                                  width="20" 
                                  height="20" 
                                  viewBox="0 0 20 20" 
                                  fill="none"
                                  className="flex-shrink-0 text-neutral-600 group-hover:text-neutral-400 transition-all duration-300 group-hover:translate-x-1"
                                >
                                  <path 
                                    d="M7 14L11 10L7 6" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.article>
                )}

                {/* Empty State */}
                {!loading && !blog && (
                  <motion.div 
                    className="w-full h-96 flex flex-col items-center justify-center text-neutral-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4 opacity-50">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2"/>
                      <path d="M32 20V32M32 40V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p className="text-lg font-medium">No blog content available</p>
                    <p className="text-sm mt-1">The requested post could not be found</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Custom Scrollbar Styles */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.02);
              border-radius: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 5px;
              border: 2px solid transparent;
              background-clip: padding-box;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.15);
              background-clip: padding-box;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}