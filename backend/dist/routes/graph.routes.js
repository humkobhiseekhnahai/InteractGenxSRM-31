// src/routes/graph.routes.ts
import { Router } from "express";
import prisma from "../utils/prisma.js";
const graphRouter = Router();
/* ----------------------------------------------------
   Helper: Build concept graph with blogs + related concepts
---------------------------------------------------- */
function buildConceptGraph(concept, blogs, relatedConcepts) {
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
    const links = [];
    // Concept → Blogs
    for (const b of blogs) {
        links.push({ source: concept.id, target: b.id });
    }
    // Concept → Related Concepts
    for (const rc of relatedConcepts) {
        links.push({ source: concept.id, target: rc.id });
    }
    return { nodes, links };
}
/* ----------------------------------------------------
   1) ROOT GRAPH — GET /graph
---------------------------------------------------- */
graphRouter.get("/", async (req, res) => {
    const conceptId = req.query.id;
    /* ---------------------------------------------
       CASE A — Drilldown: /graph?id=<conceptId>
    --------------------------------------------- */
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
            });
            const relatedConcepts = await prisma.concept.findMany({
                where: { id: { in: concept.relatedIds } },
            });
            const graph = buildConceptGraph(concept, blogs, relatedConcepts);
            return res.json(graph);
        }
        catch (err) {
            console.error("Concept graph error:", err);
            return res.status(500).json({ error: "Failed to load concept graph" });
        }
    }
    /* ---------------------------------------------
       CASE B — ROOT GRAPH: /graph
       Shows entire knowledge graph minimally
    --------------------------------------------- */
    try {
        const concepts = await prisma.concept.findMany();
        const blogs = await prisma.blogPost.findMany();
        const nodes = [
            ...concepts.map((c) => ({
                id: c.id,
                title: c.name,
                type: "concept",
            })),
            ...blogs.map((b) => ({
                id: b.id,
                title: b.title,
                type: "blog",
            })),
        ];
        const links = [];
        // Concept → Blog edges
        for (const c of concepts) {
            for (const bid of c.blogPostIds) {
                links.push({ source: c.id, target: bid });
            }
        }
        // Concept → Concept edges
        for (const c of concepts) {
            for (const rid of c.relatedIds) {
                links.push({ source: c.id, target: rid });
            }
        }
        // Blog → Blog edges
        for (const b of blogs) {
            for (const rid of b.relatedIds) {
                links.push({ source: b.id, target: rid });
            }
        }
        return res.json({ nodes, links });
    }
    catch (err) {
        console.error("Root graph error:", err);
        return res.status(500).json({ error: "Failed to load root graph" });
    }
});
/* ----------------------------------------------------
   2) BLOG EXPANSION — GET /graph/expand?id=<blogId>
   Used inside Blog Modal for related blogs
---------------------------------------------------- */
graphRouter.get("/expand", async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: "Missing id parameter" });
    }
    try {
        const blog = await prisma.blogPost.findUnique({ where: { id } });
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        const relatedBlogs = await prisma.blogPost.findMany({
            where: { id: { in: blog.relatedIds } },
        });
        const nodes = [
            { id: blog.id, title: blog.title, type: "blog" },
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
    }
    catch (err) {
        console.error("Expand graph error:", err);
        return res.status(500).json({ error: "Failed to load expanded graph" });
    }
});
export default graphRouter;
//# sourceMappingURL=graph.routes.js.map