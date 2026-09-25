// Realistic Blog Dataset
export const initialArticles = [
  {
    id: "nextgen-web-design-2026",
    title: "The Evolution of Modern Web Design: Micro-Interactions & Spatial UI",
    slug: "nextgen-web-design-2026",
    excerpt: "Explore how spatial computing, fluid typography, and intelligent micro-interactions are transforming modern web interfaces into immersive digital experiences.",
    category: "Design",
    tags: ["UI/UX", "CSS", "Micro-Interactions", "Design Systems"],
    publishedAt: "2026-09-18",
    readTime: "6 min read",
    featured: true,
    views: 1420,
    likes: 89,
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    coverCaption: "Spatial layers and fluid lighting in next-generation web architectures.",
    author: {
      name: "Elena Rostova",
      role: "Principal Product Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Elena crafts design systems and spatial interaction patterns for next-generation platforms across the globe."
    },
    content: `
      <p class="article-lead">Web design in 2026 has crossed a pivotal threshold. The era of static layouts with flat, predictable grids has given way to deeply tactile, spatial interfaces that respond dynamically to intent, velocity, and user psychology.</p>

      <h2>1. The Rise of Tactile Micro-Interactions</h2>
      <p>Micro-interactions are no longer decorative afterthoughts. Instead, they serve as the communicative nervous system of the interface. When a user hovers, toggles, or drags an element, the feedback is calibrated with physics-informed damping curves.</p>
      
      <blockquote>
        "The difference between a good interface and an unforgettable one lies in how it moves when nobody is watching. Fluidity is respect for user intent."
      </blockquote>

      <p>Notice how subtle hover elevations and spring-mass animations create an intuitive sense of weight and physical presence. This tactile delight keeps visitors engaged without adding cognitive friction.</p>

      <h2>2. Design Tokens in Modern CSS Architecture</h2>
      <p>Modern CSS custom properties have evolved beyond simple colors. We now orchestrate multi-layered design token graphs that adapt simultaneously across light levels, device capabilities, and accessibility preferences.</p>

      <pre><code class="language-css">/* Adaptive Spatial Token Hierarchy */
:root {
  --surface-depth-1: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
  --surface-depth-2: 0 12px 32px -4px rgba(15, 23, 42, 0.16);
  --transition-fluid: cubic-bezier(0.16, 1, 0.3, 1);
  --color-accent-glow: color-mix(in srgb, var(--primary) 40%, transparent);
}

.card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--surface-depth-2), 0 0 25px var(--color-accent-glow);
  transition: all 350ms var(--transition-fluid);
}</code></pre>

      <h2>3. Spatial Hierarchy & Glassmorphism Refined</h2>
      <p>Early iterations of glassmorphism suffered from poor contrast and accessibility issues. Modern implementations combine dynamic backdrop filters with luminance-aware borders that preserve WCAG AAA contrast while maintaining optical translucency.</p>

      <div class="callout callout-tip">
        <strong>💡 Key Takeaway:</strong> Always prioritize structural readability before applying glass effects. Maintain an opacity of at least 85% for background surfaces containing long-form text.
      </div>

      <h2>Conclusion</h2>
      <p>As web experiences continue to converge with spatial hardware, mastering dynamic CSS, sensible physics transitions, and responsive typography ensures your creations remain timeless, accessible, and delightful.</p>
    `,
    comments: [
      {
        id: "c1",
        authorName: "Marcus Vance",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
        date: "2 days ago",
        likes: 14,
        text: "The point about physics-informed damping curves is spot on! We swapped out standard linear transitions last month and our user session time jumped by 18%."
      },
      {
        id: "c2",
        authorName: "Sarah Jenkins",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
        date: "1 day ago",
        likes: 6,
        text: "Beautiful layout on this article. Loving the code snippet styling and typography hierarchy."
      }
    ]
  },
  {
    id: "ai-agents-software-engineering",
    title: "Autonomous AI Agents in Production: From Scripting to Cognitive Workflows",
    slug: "ai-agents-software-engineering",
    excerpt: "A deep dive into how self-correcting agent loops, structured tool calling, and deterministic evaluation frameworks are reshaping modern engineering teams.",
    category: "Technology",
    tags: ["AI & ML", "Architecture", "Engineering", "Python"],
    publishedAt: "2026-09-22",
    readTime: "8 min read",
    featured: true,
    views: 2840,
    likes: 164,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    coverCaption: "Neural orchestration pathways and self-correcting graph networks.",
    author: {
      name: "Dr. Aris Chen",
      role: "Chief Architect, Distributed Systems",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Aris writes about large-scale distributed systems, autonomous agents, and deterministic AI pipelines."
    },
    content: `
      <p class="article-lead">The conversation around generative AI in software engineering has rapidly matured. We have transitioned from basic syntax autocomplete to multi-agent swarms that plan, implement, review, and benchmark production codebases.</p>

      <h2>1. The ReAct Pattern and State Machines</h2>
      <p>At the heart of reliable autonomous systems is not simply a larger prompt, but a robust state machine governing tool execution, structured output validation, and state reconciliation.</p>

      <pre><code class="language-python">class AgentWorkflow(Workflow):
    @step
    async def plan_step(self, ctx: Context, ev: StartEvent) -> PlanEvent:
        plan = await self.planner.generate(ev.prompt)
        return PlanEvent(plan=plan)

    @step
    async def execute_tools(self, ctx: Context, ev: PlanEvent) -> ExecutionResult:
        results = []
        for task in ev.plan.steps:
            res = await self.dispatcher.run_tool(task.tool, task.args)
            results.append(res)
        return ExecutionResult(results=results)</code></pre>

      <h2>2. Guardrails Against Stochastic Drift</h2>
      <p>When autonomous loops run without deterministic boundaries, hallucination cascades can derail an entire task. Implementing self-verification stages with isolated AST parsing and static linter hooks reduces failure rates by over 74%.</p>

      <blockquote>
        "An agent without programmatic guardrails is like a fast car with no brakes. Velocity only matters if you can stay on the road."
      </blockquote>

      <div class="callout callout-info">
        <strong>⚡ Performance Insight:</strong> Cache intermediate semantic embeddings to avoid redundant round-trips to the LLM endpoint during multi-step iterative loops.
      </div>

      <h2>3. The Future of Pair Programming</h2>
      <p>Engineers are becoming directors rather than typists. The premium skill in 2026 is framing problem boundaries, defining test suites with mathematical rigor, and curating architectural patterns that autonomous assistants can execute reliably.</p>
    `,
    comments: [
      {
        id: "c3",
        authorName: "Liam O'Connor",
        authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
        date: "18 hours ago",
        likes: 9,
        text: "The deterministic state machine model is definitely the only way to get predictable outputs in production. Great article!"
      }
    ]
  },
  {
    id: "mastering-css-grid-subgrid",
    title: "Mastering CSS Grid & Subgrid: Architecting Complex Editorial Layouts",
    slug: "mastering-css-grid-subgrid",
    excerpt: "Learn how to harness CSS Subgrid, container queries, and intrinsic sizing to build flawless magazine-grade web layouts that adapt seamlessly.",
    category: "Web Dev",
    tags: ["CSS", "Web Dev", "Frontend", "Responsive"],
    publishedAt: "2026-09-14",
    readTime: "5 min read",
    featured: false,
    views: 1190,
    likes: 72,
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    coverCaption: "Modular grid systems enabling harmonic typography alignment.",
    author: {
      name: "Sophia Martinez",
      role: "Senior Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Sophia specializes in CSS architecture, design engineering, and performant web animations."
    },
    content: `
      <p class="article-lead">For years, card grids suffered from uneven card headers and misaligned action footers whenever titles spanned varying line counts. CSS Subgrid provides the native solution we have always dreamed of.</p>

      <h2>1. The Subgrid Solution</h2>
      <p>With subgrid, child elements can inherit the track sizing of their parent grid rather than defining their own isolated grid context. This ensures that across multiple cards in a row, every title, body excerpt, and footer aligns with mathematical precision.</p>

      <pre><code class="language-css">.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.blog-card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 4; /* cover image, badge/date, title, excerpt/footer */
}</code></pre>

      <h2>2. Intrinsic Sizing with minmax() and clamp()</h2>
      <p>Pairing CSS grid with fluid clamp formulas eliminates hundreds of lines of fragile media queries while guaranteeing pixel-perfect layout stability on everything from small foldables to 4K ultrawide monitors.</p>
    `,
    comments: [
      {
        id: "c4",
        authorName: "David K.",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
        date: "3 days ago",
        likes: 4,
        text: "Subgrid support across all modern browsers has been such a game changer. No more hacky min-height calculations!"
      }
    ]
  },
  {
    id: "minimalist-developer-productivity",
    title: "The Minimalist Developer: Cultivating Focus in an Era of Hyper-Distraction",
    slug: "minimalist-developer-productivity",
    excerpt: "Practical systems to reclaim deep work, declutter your toolchain, and build sustainable momentum without burnout.",
    category: "Productivity",
    tags: ["Productivity", "Career", "Workflow", "Mindset"],
    publishedAt: "2026-09-10",
    readTime: "4 min read",
    featured: false,
    views: 950,
    likes: 58,
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    coverCaption: "A quiet workspace configured for undistracted creative output.",
    author: {
      name: "Elena Rostova",
      role: "Principal Product Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Elena crafts design systems and spatial interaction patterns for next-generation platforms across the globe."
    },
    content: `
      <p class="article-lead">We live in a world that constantly begs for our cognitive cycles. Notification badges, Slack pings, and endless feeds fragment our attention into brittle, disjointed moments.</p>

      <h2>1. The 90-Minute Focus Block</h2>
      <p>Human ultradian rhythms naturally peak and dip in approximately 90-minute waves. By organizing your day around two concentrated deep work blocks—before checking any email or group chats—you preserve your highest quality mental energy for solving complex architectural challenges.</p>

      <blockquote>
        "Simplicity is not about having less. It is about creating room for what truly matters."
      </blockquote>

      <h2>2. Toolchain Audits</h2>
      <p>Every additional tool, browser extension, or dashboard comes with cognitive maintenance debt. Review your workflow monthly and aggressively prune anything that doesn't directly contribute to clarity and flow.</p>
    `,
    comments: []
  },
  {
    id: "state-of-javascript-2026",
    title: "JavaScript in 2026: Records, Tuples, and the Return of Native Performance",
    slug: "state-of-javascript-2026",
    excerpt: "How native immutable data structures, temporal API, and WASM integrations are redefining what it means to build web applications.",
    category: "Web Dev",
    tags: ["JavaScript", "Web Dev", "Performance", "Frontend"],
    publishedAt: "2026-09-05",
    readTime: "7 min read",
    featured: true,
    views: 3100,
    likes: 210,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    coverCaption: "Code architecture meeting next-generation JS engine pipelines.",
    author: {
      name: "Sophia Martinez",
      role: "Senior Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Sophia specializes in CSS architecture, design engineering, and performant web animations."
    },
    content: `
      <p class="article-lead">JavaScript continues its relentless forward march. With TC39 proposals landing into stable engine specifications, frontend developers are enjoying built-in superpowers that previously required heavyweight external libraries.</p>

      <h2>1. The Temporal API: Farewell to Date Woes</h2>
      <p>For decades, \`Date\` in JavaScript was notorious for time zone traps and mutable state. The modern \`Temporal\` API introduces immutable date-time objects with timezone-first ergonomics.</p>

      <pre><code class="language-javascript">// Working with Temporal in modern JavaScript
const now = Temporal.Now.zonedDateTimeISO('America/New_York');
const eventTime = Temporal.ZonedDateTime.from('2026-10-15T18:30:00-04:00[America/New_York]');
const diff = eventTime.since(now);

console.log(\`Days until event: \${diff.days} days, \${diff.hours} hours\`);</code></pre>

      <h2>2. Records and Tuples: Immutable Primitives</h2>
      <p>Deep object equality checks without serialization overhead or third-party immutable libraries are finally here. Using the hash sign syntax, compare structures by value instead of memory reference:</p>

      <pre><code class="language-javascript">const userA = #{ id: 42, role: "admin" };
const userB = #{ id: 42, role: "admin" };

console.log(userA === userB); // true! Exact structural comparison</code></pre>
    `,
    comments: [
      {
        id: "c5",
        authorName: "Alex Rivera",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
        date: "5 days ago",
        likes: 12,
        text: "Records and Tuples will eliminate so many memoization re-renders in UI libraries. Can't wait for full widespread usage!"
      }
    ]
  },
  {
    id: "sustainable-cloud-architecture",
    title: "Carbon-Aware Cloud Architecture: Building Green Software at Scale",
    slug: "sustainable-cloud-architecture",
    excerpt: "Strategies for scheduling compute based on grid carbon intensity, optimizing cache locality, and slashing cloud infrastructure footprint.",
    category: "Technology",
    tags: ["Cloud", "DevOps", "Architecture", "Sustainability"],
    publishedAt: "2026-08-28",
    readTime: "6 min read",
    featured: false,
    views: 840,
    likes: 47,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    coverCaption: "Global cloud edge nodes routing compute toward renewable energy regions.",
    author: {
      name: "Dr. Aris Chen",
      role: "Chief Architect, Distributed Systems",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Aris writes about large-scale distributed systems, autonomous agents, and deterministic AI pipelines."
    },
    content: `
      <p class="article-lead">Green software engineering is moving from an idealistic corporate bullet point into a core metric tracked in CI/CD pipelines alongside latency and egress costs.</p>

      <h2>1. Carbon Intensity Scheduling</h2>
      <p>Data centers draw power from regional energy grids whose carbon intensity fluctuates by the hour depending on solar and wind availability. By deferring batch processing and model fine-tuning to low-emission windows, companies reduce direct carbon impact by up to 40%.</p>

      <div class="callout callout-warning">
        <strong>⚠️ Metric Alert:</strong> Computing carbon footprint is no longer optional for European digital compliance standards. Monitor your kilowatt-hour per million API calls.
      </div>
    `,
    comments: []
  },
  {
    id: "typography-for-digital-reading",
    title: "The Art of Reading on Screens: Typography, Line Length, and Cognitive Load",
    slug: "typography-for-digital-reading",
    excerpt: "How font pairing, optimal measure (line length), leading, and vertical rhythm affect comprehension and visual fatigue.",
    category: "Design",
    tags: ["Typography", "UI/UX", "Design", "CSS"],
    publishedAt: "2026-08-20",
    readTime: "5 min read",
    featured: false,
    views: 1350,
    likes: 95,
    coverImage: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80",
    coverCaption: "Serif and sans-serif pairings crafted for sustained editorial reading.",
    author: {
      name: "Elena Rostova",
      role: "Principal Product Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Elena crafts design systems and spatial interaction patterns for next-generation platforms across the globe."
    },
    content: `
      <p class="article-lead">When someone reads your blog, the typography is not merely the vehicle for your thoughts—it directly governs whether their eyes feel strained after three minutes or remain effortlessly immersed for an hour.</p>

      <h2>1. The Golden 65-75 Character Measure</h2>
      <p>Lines that are too long cause reader fatigue because the eye struggles to find the start of the next line. Lines that are too short break reading rhythm with frequent carriage returns. Aim for a container \`max-width\` of 68ch to 72ch for long-form narrative content.</p>

      <h2>2. Fluid Type Scales with CSS clamp()</h2>
      <p>Forget jumping breakpoint jumps where text size abruptly snaps. A fluid typography formula transitions seamlessly across all screen dimensions.</p>

      <pre><code class="language-css">/* Fluid editorial typography */
:root {
  --font-body: clamp(1.0625rem, 0.95rem + 0.5vw, 1.25rem);
  --line-height-body: 1.75;
  --measure-content: 68ch;
}

.article-body {
  font-size: var(--font-body);
  line-height: var(--line-height-body);
  max-width: var(--measure-content);
}</code></pre>
    `,
    comments: [
      {
        id: "c6",
        authorName: "Maya Lin",
        authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
        date: "1 week ago",
        likes: 18,
        text: "The \`clamp\` type scale works like magic. Our bounce rate dropped noticeably after fixing our line measures!"
      }
    ]
  },
  {
    id: "navigating-tech-career-growth",
    title: "From Senior to Staff+: Navigating High-Impact Engineering Leadership",
    slug: "navigating-tech-career-growth",
    excerpt: "What really changes when you step beyond senior engineering? Strategic alignment, influence without authority, and organizational leverage.",
    category: "Productivity",
    tags: ["Career", "Engineering", "Leadership", "Productivity"],
    publishedAt: "2026-08-12",
    readTime: "7 min read",
    featured: false,
    views: 2210,
    likes: 140,
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    coverCaption: "Navigating cross-functional impact and technical strategy.",
    author: {
      name: "Sophia Martinez",
      role: "Senior Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Sophia specializes in CSS architecture, design engineering, and performant web animations."
    },
    content: `
      <p class="article-lead">Reaching the Senior engineer title is primarily about execution excellence—building features reliably, mastering frameworks, and mentoring juniors. Moving into Staff+ requires a fundamental mental shift from individual code output to organizational leverage.</p>

      <h2>1. The Currency of Influence Without Authority</h2>
      <p>Staff engineers rarely have direct reports. Your ability to steer technical strategy relies on clarity of written RFCs, empathetic listening, and aligning engineering investments with commercial outcomes.</p>

      <blockquote>
        "Your job is no longer to be the smartest person in the room with all the answers. Your job is to make the entire room smarter."
      </blockquote>

      <h2>2. Identifying High-Leverage Problems</h2>
      <p>Look for repetitive friction points across multiple teams. An internal developer tooling improvement that saves 15 minutes per day for 100 engineers creates more enterprise value than shipping any individual isolated feature.</p>
    `,
    comments: [
      {
        id: "c7",
        authorName: "Kenji Sato",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
        date: "2 weeks ago",
        likes: 21,
        text: "Best summary of the Staff transition I've read this year. The point about internal tooling leverage resonates deeply."
      }
    ]
  }
];

export const categories = [
  { name: "All", slug: "all", icon: "sparkles" },
  { name: "Design", slug: "design", icon: "palette" },
  { name: "Technology", slug: "technology", icon: "cpu" },
  { name: "Web Dev", slug: "web-dev", icon: "code" },
  { name: "Productivity", slug: "productivity", icon: "zap" }
];
