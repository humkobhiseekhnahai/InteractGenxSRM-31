import prisma from "../utils/prisma.js";
async function main() {
    console.log("🌱 Seeding large semantic graph (100+ nodes)");
    await prisma.blogPost.deleteMany({});
    await prisma.concept.deleteMany({});
    /* --------------------------------------------------
       1️⃣ CONCEPTS (20)
    -------------------------------------------------- */
    const conceptNames = [
        "Cryptography",
        "Security",
        "Cybersecurity",
        "Artificial Intelligence",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Blockchain",
        "Cloud Computing",
        "Distributed Systems",
        "Operating Systems",
        "Databases",
        "Web Development",
        "Backend Engineering",
        "Frontend Engineering",
        "DevOps",
        "Networking",
        "Privacy",
        "Software Architecture",
    ];
    const concepts = await Promise.all(conceptNames.map((name) => prisma.concept.create({
        data: {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            blogPostIds: [],
            relatedIds: [],
        },
    })));
    const conceptMap = Object.fromEntries(concepts.map((c) => [c.name, c]));
    console.log(`✔ ${concepts.length} concepts created`);
    /* --------------------------------------------------
       2️⃣ BLOG POSTS (≈80)
    -------------------------------------------------- */
    const blogs = [];
    for (const concept of concepts) {
        for (let i = 1; i <= 4; i++) {
            const relatedConcept = concepts[Math.floor(Math.random() * concepts.length)];
            if (!relatedConcept)
                continue;
            const blog = await prisma.blogPost.create({
                data: {
                    title: `${concept.name} — Insight ${i}`,
                    slug: `${concept.slug}-insight-${i}`,
                    content: `In-depth discussion on ${concept.name}, insight ${i}.`,
                    excerpt: `${concept.name} explained (part ${i}).`,
                    conceptIds: Array.from(new Set([concept.id, relatedConcept.id])),
                    relatedIds: [],
                    embedding: null,
                },
            });
            blogs.push(blog);
            for (const cid of blog.conceptIds) {
                await prisma.concept.update({
                    where: { id: cid },
                    data: { blogPostIds: { push: blog.id } },
                });
            }
        }
    }
    /* --------------------------------------------------
       3️⃣ CONCEPT ↔ CONCEPT RELATIONS
    -------------------------------------------------- */
    function getConcept(map, key) {
        const concept = map[key];
        if (!concept) {
            throw new Error(`Concept not found in map: ${key}`);
        }
        return concept;
    }
    /* --------------------------------------------------
       3️⃣ CONCEPT ↔ CONCEPT RELATIONS
    -------------------------------------------------- */
    const linkConcepts = async (a, b) => {
        const c1 = getConcept(conceptMap, a);
        const c2 = getConcept(conceptMap, b);
        await prisma.concept.update({
            where: { id: c1.id },
            data: { relatedIds: { push: c2.id } },
        });
    };
    await linkConcepts("Cryptography", "Security");
    await linkConcepts("Security", "Cybersecurity");
    await linkConcepts("Artificial Intelligence", "Machine Learning");
    await linkConcepts("Machine Learning", "Deep Learning");
    await linkConcepts("Deep Learning", "Computer Vision");
    await linkConcepts("Deep Learning", "Natural Language Processing");
    await linkConcepts("Cloud Computing", "DevOps");
    await linkConcepts("Databases", "Backend Engineering");
    await linkConcepts("Web Development", "Frontend Engineering");
    await linkConcepts("Privacy", "Security");
    await linkConcepts("Blockchain", "Cryptography");
    await linkConcepts("Distributed Systems", "Cloud Computing");
    console.log(`✔ Concept-to-concept relations created`);
    /* --------------------------------------------------
       4️⃣ BLOG ↔ BLOG RELATIONS (CLUSTERS)
    -------------------------------------------------- */
    for (let i = 0; i < blogs.length; i++) {
        const current = blogs[i];
        if (!current)
            continue;
        const related = blogs
            .slice(i + 1, i + 4)
            .map((b) => b.id);
        if (related.length === 0)
            continue;
        await prisma.blogPost.update({
            where: { id: current.id },
            data: { relatedIds: { push: related } },
        });
        console.log(`✔ Blog ${current.title} linked to ${related.length} related blogs`);
    }
}
main()
    .then(() => {
    console.log("✅ Seeding finished successfully");
})
    .catch((e) => {
    console.error("❌ Seed failed:", e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
export {};
//# sourceMappingURL=seed.js.map