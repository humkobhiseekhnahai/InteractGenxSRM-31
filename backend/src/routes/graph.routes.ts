import { Router } from "express";
import prisma from "../utils/prisma.js";

const graphRouter = Router();

/* ----------------------------------------------------
   Helper: Build concept drilldown graph
---------------------------------------------------- */
function buildConceptGraph(
  concept: {
    id: string;
    name: string;
  },
  blogs: { id: string; title: string }[],
  relatedConcepts: { id: string; name: string }[]
) {
  const nodes = [
    {
      id: concept.id,
      title: concept.name,
      type: "concept",
    },
    ...blogs.map((b) => ({
      id: b.id,
      title: b.title,
      type: "blog",
    })),
    ...relatedConcepts.map((c) => ({
      id: c.id,
      title: c.name,
      type: "concept",
    })),
  ];

  const links: { source: string; target: string }[] = [];

  // Concept → Blogs
  for (const b of blogs) {
    links.push({
      source: concept.id,
      target: b.id,
    });
  }

  // Concept → Related Concepts
  for (const rc of relatedConcepts) {
    links.push({
      source: concept.id,
      target: rc.id,
    });
  }

  return { nodes, links };
}

/* ----------------------------------------------------
   1️⃣ ROOT GRAPH — GET /graph
   Concepts only (clean semantic map)
---------------------------------------------------- */
graphRouter.get("/", async (req, res) => {
  const conceptId = req.query.id as string | undefined;

  /* ------------------------------------------------
     CASE A — Concept Drilldown
     /graph?id=<conceptId>
  ------------------------------------------------ */
  if (conceptId) {
    try {
      const concept = await prisma.concept.findUnique({
        where: { id: conceptId },
      });

      if (!concept) {
        return res.status(404).json({ error: "Concept not found" });
      }

      const blogs = await prisma.blogPost.findMany({
        where: { id: { in: concept.blogPostIds } },
        select: { id: true, title: true },
      });

      const relatedConcepts = await prisma.concept.findMany({
        where: { id: { in: concept.relatedIds } },
        select: { id: true, name: true },
      });

      const graph = buildConceptGraph(concept, blogs, relatedConcepts);
      return res.json(graph);
    } catch (err) {
      console.error("Concept graph error:", err);
      return res
        .status(500)
        .json({ error: "Failed to load concept graph" });
    }
  }

  /* ------------------------------------------------
     CASE B — ROOT GRAPH
     Concepts only (NO blogs here)
  ------------------------------------------------ */
  try {
    const concepts = await prisma.concept.findMany({
      select: {
        id: true,
        name: true,
        relatedIds: true,
      },
    });

    const nodes = concepts.map((c) => ({
      id: c.id,
      title: c.name,
      type: "concept",
    }));

    const links: { source: string; target: string }[] = [];

    // Concept ↔ Concept relations
    for (const c of concepts) {
      for (const rid of c.relatedIds) {
        links.push({
          source: c.id,
          target: rid,
        });
      }
    }

    return res.json({ nodes, links });
  } catch (err) {
    console.error("Root graph error:", err);
    return res
      .status(500)
      .json({ error: "Failed to load root graph" });
  }
});

/* ----------------------------------------------------
   2️⃣ BLOG EXPANSION — GET /graph/expand?id=<blogId>
   Used inside BlogModal
---------------------------------------------------- */
graphRouter.get("/expand", async (req, res) => {
  const id = req.query.id as string | undefined;

  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  try {
    const blog = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        relatedIds: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const relatedBlogs = await prisma.blogPost.findMany({
      where: { id: { in: blog.relatedIds } },
      select: { id: true, title: true },
    });

    const nodes = [
      {
        id: blog.id,
        title: blog.title,
        type: "blog",
      },
      ...relatedBlogs.map((b) => ({
        id: b.id,
        title: b.title,
        type: "blog",
      })),
    ];

    const links = relatedBlogs.map((b) => ({
      source: blog.id,
      target: b.id,
    }));

    return res.json({ nodes, links });
  } catch (err) {
    console.error("Expand graph error:", err);
    return res
      .status(500)
      .json({ error: "Failed to load expanded graph" });
  }
});

export default graphRouter;