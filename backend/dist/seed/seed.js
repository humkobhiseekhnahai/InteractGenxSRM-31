import prisma from "../utils/prisma.js";
// Realistic blog post templates for each concept
const blogTemplates = {
    "Cryptography": [
        {
            title: "Understanding Modern Encryption Standards",
            excerpt: "An exploration of AES, RSA, and the future of quantum-resistant cryptography.",
            content: `<p>Modern cryptography forms the backbone of digital security. The Advanced Encryption Standard (AES) has become the de facto symmetric encryption algorithm, used everywhere from HTTPS connections to file encryption. Its 256-bit variant offers exceptional security while maintaining reasonable performance.</p>
      <p>RSA encryption, on the other hand, revolutionized public-key cryptography. By using a pair of keys—one public and one private—RSA enables secure communication without prior key exchange. However, as quantum computers advance, we're seeing increased research into post-quantum cryptographic algorithms that can resist attacks from these powerful machines.</p>
      <p>The future of cryptography lies in developing systems that remain secure even in a post-quantum world, while still being practical for everyday use.</p>`
        },
        {
            title: "Hash Functions and Digital Signatures",
            excerpt: "How cryptographic hashing ensures data integrity and authentication.",
            content: `<p>Cryptographic hash functions are one-way mathematical operations that convert input data of any size into a fixed-size output. SHA-256, part of the SHA-2 family, produces a 256-bit hash value and is widely used in blockchain technology and digital signatures.</p>
      <p>Digital signatures leverage hash functions to provide authentication and non-repudiation. When you digitally sign a document, you're essentially creating a hash of that document and encrypting it with your private key. Anyone with your public key can verify that the signature is authentic and that the document hasn't been tampered with.</p>
      <p>These mechanisms are fundamental to establishing trust in digital systems, from code signing to blockchain transactions.</p>`
        },
        {
            title: "The Mathematics Behind Cryptographic Security",
            excerpt: "Exploring the number theory that makes modern encryption possible.",
            content: `<p>At the heart of many cryptographic systems lies elegant mathematics. RSA encryption, for instance, depends on the computational difficulty of factoring large prime numbers. While it's easy to multiply two large primes together, factoring their product back into the original primes is computationally infeasible with current technology.</p>
      <p>Elliptic curve cryptography (ECC) offers similar security to RSA but with much smaller key sizes. ECC is based on the algebraic structure of elliptic curves over finite fields, and the discrete logarithm problem in this context is believed to be even harder than integer factorization.</p>
      <p>Understanding these mathematical foundations helps us appreciate why certain cryptographic primitives are considered secure and guides the development of next-generation cryptographic systems.</p>`
        },
        {
            title: "Practical Cryptography in Modern Applications",
            excerpt: "Implementing secure encryption in real-world software systems.",
            content: `<p>Implementing cryptography correctly is notoriously difficult. Even with strong algorithms, poor implementation choices can completely undermine security. Common pitfalls include using weak random number generators, improper key management, and failing to authenticate ciphertext.</p>
      <p>Modern applications should use established cryptographic libraries rather than implementing primitives from scratch. Libraries like libsodium and OpenSSL have been extensively reviewed and tested. They provide high-level APIs that make it easier to use cryptography correctly.</p>
      <p>Key management remains one of the hardest problems in applied cryptography. Hardware security modules (HSMs) and key management services help protect cryptographic keys, but developers must carefully design their systems to minimize key exposure and handle key rotation properly.</p>`
        }
    ],
    "Artificial Intelligence": [
        {
            title: "The Evolution of AI: From Expert Systems to Deep Learning",
            excerpt: "Tracing the journey of artificial intelligence through the decades.",
            content: `<p>Artificial intelligence has undergone several paradigm shifts since its inception in the 1950s. Early AI research focused on symbolic reasoning and expert systems—programs that encoded human knowledge in rules. While these systems showed promise in narrow domains, they struggled with the complexity and ambiguity of real-world problems.</p>
      <p>The 1980s and 1990s saw the rise of machine learning approaches that could learn patterns from data rather than relying on hand-coded rules. Neural networks, inspired by biological neurons, showed promise but were limited by computational power and training techniques.</p>
      <p>The deep learning revolution of the 2010s changed everything. With massive datasets, powerful GPUs, and improved algorithms, deep neural networks achieved superhuman performance on tasks like image recognition and game playing. Today's large language models represent the latest frontier, demonstrating emergent capabilities that weren't explicitly programmed.</p>`
        },
        {
            title: "Neural Networks: Architecture and Training",
            excerpt: "Understanding how artificial neural networks learn from data.",
            content: `<p>Neural networks are computational models inspired by the structure of biological brains. At their core, they consist of interconnected nodes (neurons) organized in layers. Each connection has a weight that determines how much influence one neuron has on another.</p>
      <p>Training a neural network involves adjusting these weights to minimize error on a given task. This process, called backpropagation, uses calculus to compute gradients and update weights in the direction that reduces the loss function. The learning rate determines how big these updates are—too large and the network might never converge; too small and training becomes prohibitively slow.</p>
      <p>Modern architectures have become increasingly sophisticated. Convolutional neural networks excel at image processing, recurrent networks handle sequential data, and transformers have revolutionized natural language processing. Understanding these architectural innovations is key to applying AI effectively.</p>`
        },
        {
            title: "AI Ethics and Responsible Development",
            excerpt: "Navigating the moral implications of artificial intelligence systems.",
            content: `<p>As AI systems become more powerful and pervasive, ethical considerations have moved to the forefront. Bias in training data can lead to discriminatory outcomes, affecting decisions in hiring, lending, and criminal justice. Addressing this requires careful dataset curation, fairness metrics, and ongoing monitoring of deployed systems.</p>
      <p>Privacy concerns arise when AI systems process personal data. Techniques like differential privacy and federated learning aim to preserve privacy while still enabling effective learning. However, there's often a fundamental tension between model performance and privacy guarantees.</p>
      <p>The question of AI alignment—ensuring that AI systems behave in accordance with human values—becomes more pressing as systems grow more capable. Researchers are developing frameworks for value learning and safe exploration, but many challenges remain unsolved. The path forward requires collaboration between technologists, ethicists, policymakers, and the broader public.</p>`
        },
        {
            title: "The Future of AI: Challenges and Opportunities",
            excerpt: "Exploring the frontiers of artificial intelligence research.",
            content: `<p>Current AI systems, despite their impressive capabilities, remain narrow specialists. They excel at specific tasks but lack the general intelligence that would allow them to adapt flexibly to novel situations. Achieving artificial general intelligence (AGI) remains a grand challenge that may require fundamental breakthroughs in our understanding of intelligence itself.</p>
      <p>Few-shot and zero-shot learning represent promising directions. Can we build systems that learn efficiently from limited examples, more like humans do? Meta-learning approaches that "learn how to learn" show potential, as do techniques that leverage world models to reason about novel scenarios.</p>
      <p>The integration of symbolic reasoning with neural networks—combining the flexibility of learned representations with the interpretability of logical inference—may bridge the gap between narrow and general AI. Whatever path we take, the next decade of AI research promises to be transformative.</p>`
        }
    ],
    // Add more templates for other concepts...
};
// Default template for concepts without specific templates
const defaultTemplate = (conceptName, index) => {
    const titles = [
        `Introduction to ${conceptName}`,
        `Advanced Techniques in ${conceptName}`,
        `Best Practices for ${conceptName}`,
        `Common Challenges in ${conceptName}`
    ];
    return {
        title: titles[index % titles.length] || `${conceptName} Deep Dive`,
        excerpt: `A comprehensive exploration of ${conceptName} concepts, practical applications, and industry best practices.`,
        content: `<p>${conceptName} represents a critical area in modern technology. This field has evolved significantly over the past decade, driven by advances in both theoretical understanding and practical implementation techniques.</p>
    <p>Understanding ${conceptName} requires a solid foundation in its core principles. Practitioners must balance theoretical knowledge with hands-on experience, learning from both successes and failures in real-world deployments. The landscape continues to evolve rapidly, with new patterns and practices emerging regularly.</p>
    <p>As organizations increasingly adopt ${conceptName} solutions, the demand for expertise grows. This creates opportunities for professionals who can bridge the gap between technical implementation and business value, delivering solutions that are both technically sound and aligned with organizational goals.</p>`
    };
};
async function main() {
    console.log("🌱 Seeding large semantic graph with realistic content");
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
       2️⃣ BLOG POSTS with REALISTIC CONTENT
    -------------------------------------------------- */
    const blogs = [];
    for (const concept of concepts) {
        const templates = blogTemplates[concept.name];
        for (let i = 0; i < 4; i++) {
            const relatedConcept = concepts[Math.floor(Math.random() * concepts.length)];
            if (!relatedConcept)
                continue;
            // Use predefined template if available, otherwise use default
            const template = templates?.[i] || defaultTemplate(concept.name, i);
            const blog = await prisma.blogPost.create({
                data: {
                    title: template.title,
                    slug: template.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                    content: template.content,
                    excerpt: template.excerpt,
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
    console.log(`✔ ${blogs.length} blog posts created with realistic content`);
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
    }
    console.log(`✔ Blog-to-blog relations created`);
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