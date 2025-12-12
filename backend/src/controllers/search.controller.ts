import { type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { generateEmbedding } from "../utils/embeddings.js";
import { cosineSimilarity } from "../utils/similarity.js";

export const search = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ error: "Missing query ?q=" });
  }

  // 1. Generate embedding for the search query
  const queryEmbedding = await generateEmbedding(query);

  // 2. Fetch blogs with embeddings
  const blogs = await prisma.blogPost.findMany({
    where: { embedding: { not: null } },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      embedding: true
    }
  });

  // 3. Score each blog
  const scoredBlogs = blogs.map((blog) => ({
    id: blog.id,
    type: "blog" as const,
    title: blog.title,
    snippet: blog.excerpt ?? blog.content.slice(0, 120),
    score: cosineSimilarity(queryEmbedding, blog.embedding as number[]),
  }));

  // 4. Apply minimum similarity threshold
  const MIN_SCORE = 0.40;

  const filtered = scoredBlogs
    .filter((b) => b.score >= MIN_SCORE) // ⬅️ critical fix
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // 5. Send response
  res.json({
    query,
    results: filtered
  });
};