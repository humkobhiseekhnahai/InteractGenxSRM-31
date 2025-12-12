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
    queueMicrotask(() => setLoading(true)); // avoid sync setState inside effect

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

  // ESC handler: close modal when Escape pressed
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        // If there is history, you may want different behavior.
        // We'll close the modal entirely on Escape (as requested).
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

  // Back button logic: go to previous blog if available, otherwise close
  function handleBack() {
    const prev = popHistory();
    if (!prev) {
      close();
      return;
    }
    // load previous blog id into modal
    openBlogModal(prev);
  }

  return (
    <AnimatePresence>
      {blogModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.98, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 16, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ backdropFilter: "blur(6px)" }}
            className="relative w-[min(980px,94vw)] max-h-[86vh] overflow-auto rounded-2xl bg-neutral-900/70 border border-white/10 shadow-2xl"
          >
            {/* ===== Header area (prevents overlap) =====
                This reserves space at the top so the Back button doesn't overlap the content.
                The content below uses padding-top to sit under this header.
            */}
            <div className="h-14 px-6 flex items-center border-b border-white/5">
              {/* Left: Back button */}
              <button
                onClick={handleBack}
                className="text-neutral-300 hover:text-white px-3 py-1 rounded-md"
                aria-label="Back"
              >
                ← Back
              </button>

              {/* Center: optional title or breadcrumbs (kept empty for minimal UI) */}
              <div className="flex-1 text-center text-sm text-neutral-400">
                {/* optional: breadcrumb or small subtitle */}
              </div>

              {/* Right: close button */}
              <div className="w-20 text-right">
                <button
                  onClick={close}
                  className="text-neutral-400 hover:text-white px-3 py-1 rounded-md"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content area with padding so header doesn't overlap */}
            <div className="p-6 pt-6 pb-8 bg-neutral-900/70 rounded-b-2xl">
              {/* Loading */}
              {loading && (
                <div className="w-full h-48 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}

              {/* Blog Content */}
              {!loading && blog && (
                <article className="prose prose-invert max-w-none">
                  <h1 className="text-2xl font-bold">{blog.title}</h1>

                  {blog.excerpt && (
                    <div className="text-sm text-neutral-400 mb-3">
                      {blog.excerpt}
                    </div>
                  )}

                  <div
                    className="mt-3 text-neutral-100"
                    dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
                  />

                  {/* Related posts (simple links) */}
                  {blog.related && blog.related.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-3">
                        Related Posts
                      </h3>

                      <div className="flex flex-col gap-2">
                        {blog.related.map((rel) => (
                          <button
                            key={rel.id}
                            className="text-left px-4 py-2 rounded-lg bg-neutral-800/40 hover:bg-neutral-700/60 transition border border-white/5 text-neutral-300 hover:text-white"
                            onClick={() => {
                              // push current id to history then open new blog
                              if (currentBlogId) pushHistory(currentBlogId);
                              openBlogModal(rel.id);
                            }}
                          >
                            <div className="font-medium">{rel.title}</div>
                            {rel.excerpt && (
                              <div className="text-xs text-neutral-400 mt-1">
                                {rel.excerpt}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              )}

              {/* No blog */}
              {!loading && !blog && (
                <div className="w-full h-48 flex items-center justify-center text-neutral-400">
                  No blog content.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}