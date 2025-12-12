function mapGraph(concept: any, blogs: any[], relatedConcepts: any[]) {
  const nodes = [];
  const links = [];

  // Center concept node
  nodes.push({
    id: concept.id,
    title: concept.name,
    type: "concept",
  });

  // Concept → blogs edges
  for (const b of blogs) {
    nodes.push({
      id: b.id,
      title: b.title,
      type: "blog",
    });

    links.push({
      source: concept.id,
      target: b.id,
    });
  }

  // Concept → related concepts edges
  for (const rc of relatedConcepts) {
    nodes.push({
      id: rc.id,
      title: rc.name,
      type: "concept",
    });

    links.push({
      source: concept.id,
      target: rc.id,
    });
  }

  return { nodes, links };
}