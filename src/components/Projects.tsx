import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { 
  Eye,
  Terminal,
  Cpu,
  Search,
  ArrowUpDown,
  ArrowRight,
  Database,
  Check,
  Play,
  Copy,
  X
} from "lucide-react";
import type { Project } from "../types";
import { useCursor } from "../context/CursorContext";

// Inner modular component wrapping a Flagship project slide card to handle localized mouse tilt springs and scrolling parallax offsets
interface FlagshipCardProps {
  key?: any;
  project: Project;
  idx: number;
  scrollYProgress: any;
  setActiveProject: (p: Project | null) => void;
}

function FlagshipCard({ project, idx, scrollYProgress, setActiveProject }: FlagshipCardProps) {
  const { setVariant, resetVariant } = useCursor();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);

  // 1. Calculate relative progress around the cylinder (-3 to +3)
  const totalItems = 7;
  const relativeProgress = useTransform(scrollYProgress, (p: number) => {
    return p * (totalItems - 1) - idx;
  });

  const snappedProgress = useTransform(relativeProgress, (p: number) => {
    const rounded = Math.round(p);
    const diff = Math.abs(p - rounded);
    if (diff < 0.15) return rounded;
    
    // Smoothly interpolate the remaining gap
    const sign = Math.sign(p - rounded);
    const mappedDiff = ((diff - 0.15) / 0.35) * 0.5;
    return rounded + sign * mappedDiff;
  });

  // --- ORBITAL ARC TRANSFORMS (Horizontal Carousel) ---
  const RADIUS = 1600;
  const ANGLE_STEP = 360 / totalItems; 

  const cardRotateY = useTransform(snappedProgress, (p) => p * ANGLE_STEP);
  
  const cardTranslateX = useTransform(snappedProgress, (p) => {
    const angleRad = (p * ANGLE_STEP * Math.PI) / 180;
    return `calc(-50% + ${RADIUS * Math.sin(angleRad)}px)`;
  });

  const cardTranslateZ = useTransform(snappedProgress, (p) => {
    const angleRad = (p * ANGLE_STEP * Math.PI) / 180;
    return RADIUS * Math.cos(angleRad) - RADIUS;
  });

  // Scale: focused card is full size, others slightly smaller
  const cardScale = useTransform(snappedProgress, (p) => {
    const dist = Math.abs(p);
    if (dist >= 1) return 0.85;
    return 1 - (dist * 0.15);
  });

  // Opacity: Keep all cards visible to show the "bigger picture"
  const cardOpacity = useTransform(snappedProgress, (p) => {
    const dist = Math.abs(p);
    if (dist >= 3) return 0.3;
    if (dist === 0) return 1;
    return 1 - (dist * 0.2); // Smoothly fade outer cards
  });

  // Make all cards clickables
  const pointerEvents = "auto";

  // Parallax translation inside mockup panels
  const terminalTranslateX = useTransform(snappedProgress, [-1, 0, 1], [25, 0, -25]);
  const contentTranslateY = useTransform(snappedProgress, [-1, 0, 1], [8, 0, -8]);

  return (
    // Outer scroll wrapper applying multi-dimensional vertical cylinder alignments
    <motion.div
      style={{
        position: "absolute",
        top: "20px", // Perfectly center h-[500px] card inside h-[580px] parent cylinder container
        left: "50%",
        rotateY: cardRotateY,
        x: cardTranslateX,
        z: cardTranslateZ,
        scale: cardScale,
        opacity: cardOpacity,
        pointerEvents,
        transformStyle: "preserve-3d",
      }}
      className="shrink-0 w-[92vw] md:w-[78vw] xl:w-[62vw]"
    >
      {/* Middle Interactive card shell handling localized mouse tilt events and spring states */}
      <motion.div
        ref={cardRef}
        onClick={() => setActiveProject(project)}
        onMouseEnter={() => { setIsHovered(true); setVariant("expanded"); }}
        onMouseLeave={() => { setIsHovered(false); resetVariant(); }}
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          boxShadow: isHovered ? `0 0 80px -10px ${project.techGlow}` : "0 0 0px 0px transparent"
        }}
        className="w-full h-[500px] bg-zinc-950/75 border border-white/[0.08] hover:border-white/20 rounded-2xl p-6 md:p-8 flex flex-col md:grid md:grid-cols-12 gap-6 relative overflow-hidden backdrop-blur-3xl select-none cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
      >
        {/* Solid color backlighting replacing linear gradients */}
        <div className={`absolute -right-32 -bottom-32 w-80 h-80 rounded-full blur-[100px] opacity-[0.07] ${
          project.techGlow === "cyan" ? "bg-cyan-500" : project.techGlow === "purple" ? "bg-orange-500" : "bg-emerald-500"
        }`} />

        {/* Left Side Details Panel: Parallaxes slightly inside viewport transitions */}
        <motion.div 
          style={{ y: contentTranslateY, transformStyle: "preserve-3d" }}
          className="md:col-span-7 flex flex-col justify-between h-full relative z-10 text-left"
        >
          <div style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[9px] text-zinc-500 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-full">
                0{idx + 1} // FLAGSHIP
              </span>
              <span className={`text-[10px] font-mono tracking-wider uppercase ${
                project.techGlow === "cyan" ? "text-cyan-400" : project.techGlow === "purple" ? "text-orange-500" : "text-emerald-400"
              }`}>
                {project.subtitle}
              </span>
            </div>

            <h3 className="font-display font-medium text-2xl md:text-3xl text-white mb-3 tracking-tight">
              {project.title}
            </h3>

            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-5 font-sans">
              {project.description}
            </p>

            <div className="space-y-1.5 mb-5">
              {project.keyMetrics.map((met) => (
                <div key={met} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    project.techGlow === "cyan" ? "bg-cyan-400" : project.techGlow === "purple" ? "bg-orange-500" : "bg-emerald-400"
                  }`} />
                  <span className="text-[11px] text-zinc-300 font-mono tracking-wide">{met}</span>
                </div>
              ))}
            </div>
          </div>

          <div 
            style={{ transform: "translateZ(20px)" }}
            className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 mt-auto"
          >
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-mono bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveProject(project);
              }}
              className="text-white hover:text-cyan-400 font-mono text-xs flex items-center gap-1.5 interactive-hover border border-white/10 px-3.5 py-1.5 rounded-lg bg-white/[0.02] transition-colors"
            >
              <Eye className="w-4 h-4" /> BLUEPRINT
            </button>
          </div>
        </motion.div>

        {/* Right Side Mockup Displays (Col 5): Slides with parallax translation factor */}
        <motion.div
          style={{ 
            x: terminalTranslateX, 
            transformStyle: "preserve-3d", 
            transform: "translateZ(45px) rotateY(-5deg)"
          }}
          className="md:col-span-5 hidden md:flex items-center justify-center p-5 bg-black/60 rounded-xl border border-white/[0.05] relative overflow-hidden group transition-all"
        >
          <div className={`absolute inset-0 ${
            project.techGlow === "cyan" ? "bg-cyan-500/5" : project.techGlow === "purple" ? "bg-orange-500/5" : "bg-emerald-500/5"
          } opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

          {project.id === "clawvio" && (
            <div className="w-full flex flex-col gap-3 font-mono text-[10px] text-zinc-400 relative z-10 p-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-cyan-400">
                <span>CONVERSATION_PROCESS_OS</span>
                <span className="animate-pulse text-cyan-400">● LIVE_AGENT</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex items-center justify-between">
                  <span>Intent: schedule meeting</span>
                  <span className="text-emerald-400">[PARSED]</span>
                </div>
                <div className="p-2 bg-black/40 border border-white/5 rounded-lg flex items-center justify-between text-zinc-500">
                  <span>Executing async inngest</span>
                  <span className="text-cyan-400">RUNNING...</span>
                </div>
                <div className="text-[9px] text-zinc-500 mt-2 truncate">
                  &gt; node job.js --service=gcal
                </div>
              </div>
            </div>
          )}

          {project.id === "realitylens" && (
            <div className="w-full flex flex-col gap-3 font-mono text-[10px] text-zinc-400 relative z-10 p-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-emerald-400">
                <span>LIVE_STREAM_THREAD</span>
                <span className="animate-pulse text-rose-500">● CAPTURE_ACTIVE</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex items-center justify-between">
                  <span>Frame #2492 (YOLOv8)</span>
                  <span className="text-emerald-400">[98.8% REAL]</span>
                </div>
                <div className="p-2 bg-rose-950/20 border border-rose-500/20 rounded-lg flex items-center justify-between">
                  <span>Frame #2493 (Deepfake)</span>
                  <span className="text-red-400">[SYNTH_MOD]</span>
                </div>
                <div className="text-[9px] text-zinc-500 mt-2 truncate">
                  &gt; curl -X 'POST' '/verify'
                </div>
              </div>
            </div>
          )}

          {project.id === "resolveit" && (
            <div className="w-full flex flex-col gap-3 font-mono text-[10px] text-zinc-400 relative z-10 p-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-purple-400">
                <span>RESOLVEIT_AI_LAYER</span>
                <span className="text-emerald-400">CONNECTED</span>
              </div>
              <div className="space-y-1 bg-black/50 p-2 rounded-lg border border-white/5 text-left">
                <span className="text-zinc-500">model SimilarityCluster &#123;</span>
                <div className="pl-3 space-y-0.5 text-purple-300">
                  <div>hash String @unique</div>
                  <div>count Int @default(1)</div>
                  <div>category String</div>
                </div>
                <span className="text-zinc-500">&#125;</span>
              </div>
            </div>
          )}

          {project.id === "visualizer3d" && (
            <div className="w-full h-full flex flex-col justify-center items-center relative z-10 p-4 min-h-[150px]">
              <div className="absolute w-24 h-24 rounded-full border border-rose-500/40 animate-spin" style={{ animationDuration: "12s" }} />
              <div className="absolute w-16 h-16 rounded-full border border-dashed border-rose-400/30 animate-spin" style={{ animationDuration: "6s" }} />
              <div className="absolute w-7 h-7 rounded-full bg-rose-500/20 border border-rose-400/60 flex items-center justify-center">
                <Cpu className="w-3 h-3 text-rose-400 animate-pulse" />
              </div>
              <span className="text-[8px] font-mono text-rose-400/80 absolute bottom-1">THREE_S_GRAPH_RENDERER</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Terminal Simulator states
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalStatus, setTerminalStatus] = useState<"idle" | "running" | "ready">("idle");

  // Track the scroll of the full target container for vertical cylinder
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Calculate normalized distance from the closest project focus (0 = focused, 0.5 = exactly halfway)
  const totalItems = 7;
  const rawDistance = useTransform(scrollYProgress, (p: number) => {
    const x = p * (totalItems - 1); 
    const rounded = Math.round(x);
    const diff = Math.abs(x - rounded);
    if (diff < 0.15) return 0;
    return ((diff - 0.15) / 0.35) * 0.5;
  });

  // Calculate dynamic camera tilt (negative rotateX tilts container/camera down, presenting a gorgeous elevated semi-top view on scroll)
  const rawContainerRotateX = useTransform(rawDistance, [0, 0.5], [0, -28]);

  // Calculate dynamic camera height translation (elevates the view slightly as we look down)
  const rawContainerTranslateY = useTransform(rawDistance, [0, 0.5], [0, 22]);

  const springConfig = { damping: 25, stiffness: 120 };
  const containerRotateX = useSpring(rawContainerRotateX, springConfig);
  const containerTranslateY = useSpring(rawContainerTranslateY, springConfig);

  const allProjectsList: Project[] = [
    {
      id: "clawvio",
      title: "Clawvio",
      subtitle: "Conversation OS Voice Agent",
      description: "An advanced voice-to-action operating system capture framework. Translates natural language into multi-step background procedures across Google Workspace APIs, executing robust integrations with async Inngest pipelines, Supabase, and a custom Windows desktop tray tracker.",
      tags: ["Next.js", "Express", "Inngest", "Clerk Auth", "Supabase", "OpenAI API"],
      githubLink: "https://github.com/FirePheonix/far-away-2026",
      liveLink: "https://github.com",
      imageColor: "from-indigo-600/35 to-cyan-500/15",
      techGlow: "cyan",
      category: "AI & Agents",
      keyMetrics: [
        "Interactive desktop hotkey background capture",
        "Encrypted state variables Supabase secrets",
        "Robust retry loops via async Inngest queues"
      ],
      installation: "# Clone backend + client\ncd backend && npm install\ncd ../client && npm install\n\n# Configure DB tokens\ncp .env.example .env\n\n# Boot servers\nnpm run dev",
      architectureDetails: "Voice Input -> SpeechToText Companion Tray -> Express Security Router JWT -> Inngest Worker Engine -> Supabase RLS Client DB -> Third Party APIs Execution (Gmail / Sheets / Docs)",
      detailedFeatures: [
        "Structured multi-step trigger actions parsing from speech intents",
        "Windows desktop faster-whisper capture integration via soundcard handles",
        "Complete asynchronous workflows logging monitor visual UI screen",
        "Secure credential encryption pipelines protecting active Google Access Tokens"
      ]
    },
    {
      id: "realitylens",
      title: "RealityLens",
      subtitle: "AI Screenshot Fact-Check Gateway",
      description: "Processes live captures frame-by-frame using automated background workers. Extracts metadata claims, performs parallel search checks using Google LLMs and Tavily APIs, and provides instant confidence scoring dashboards.",
      tags: ["FastAPI", "PyQt6", "PostgreSQL", "Tavily Search", "OpenCV", "YOLOv8"],
      githubLink: "https://github.com/hannuverma/RealityLens",
      liveLink: "https://github.com",
      imageColor: "from-cyan-500/25 to-emerald-500/15",
      techGlow: "cyan",
      category: "AI & Agents",
      keyMetrics: [
        "420ms Latency on claim extraction profiles",
        "94.2% Accurate computer vision face modulation detection",
        "Tray-integrated Qt screenshot global keybind hooks"
      ],
      installation: "# Install package dependencies\nuv sync\n\n# Setup credentials\ncp .env.example .env\n\n# Boot API server\nuvicorn backend.server.main:app --reload",
      architectureDetails: "Qt Keybind Capture -> Base64 Image Submission -> FastAPI Async Task Queue -> Google Gemini OCR -> Tavily Google Grounding Index -> Verdict Report Synthesis Panel",
      detailedFeatures: [
        "Automatic synthetic face manipulation (deepfake) visual frame scan",
        "Tavily ground searches fetching multiple verifiable source links",
        "Real-time WebSocket connection streaming ongoing job analysis frames",
        "Robust scheduled background cleanups removing cached local images"
      ]
    },
    {
      id: "resolveit",
      title: "ResolveIt",
      subtitle: "AI College Complaint Dispatcher",
      description: "A centralized, intelligent student issue tracker equipped with automated prioritization algorithms. Groups related or duplicate complaints using similarity hashes, manages ledger transactions, and balances resolution metrics.",
      tags: ["Django REST", "LangChain/Graph", "Supabase", "React 19", "Cloudinary"],
      githubLink: "https://github.com/hannuverma/ResolveIt",
      liveLink: "https://github.com",
      imageColor: "from-purple-500/30 to-rose-500/15",
      techGlow: "purple",
      category: "AI & Agents",
      keyMetrics: [
        "Automatic similarity groupings reducing review load",
        "Realtime speed-bonus department score indicators",
        "Secure Row-Level Security rules protecting college metrics"
      ],
      installation: "# Setup virtual env\ncd Backend/backend && python -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt\n\n# Run Django migrations\npython manage.py migrate\npython manage.py runserver",
      architectureDetails: "Student Web Portal -> Django ORM Server -> Node.js AI-layer Hub -> LangGraph Similarity Hash Cluster -> Cloudinary Image Assets -> Supabase Points Ledger",
      detailedFeatures: [
        "Gamified points scoreboards for departments tracking resolution streaks",
        "Google LLM categorical router assigning tickets to correct departments",
        "Auto-resolve child issues when primary parent cluster ticket is addressed",
        "Integrated feedback rating multiplies directly editing department reward margins"
      ]
    },
    {
      id: "visualizer3d",
      title: "3D Algorithm Engine",
      subtitle: "GPU-Accelerated Visualizer",
      description: "Designed a premium hardware-accelerated interactive WebGL matrix visualizing complex graph structures, binary tree sorting algorithms, and shortest routing paths (Dijkstra/A*). Renders real-time node weights, interactive raycasting, and user-driven variable velocity threads.",
      tags: ["Three.js", "FastAPI", "react-force-graph-3d", "WebGL Shaders", "Zustand"],
      githubLink: "https://github.com/hannuverma/AlgorithmVisualizer",
      liveLink: "https://github.com",
      imageColor: "from-rose-500/25 to-pink-500/15",
      techGlow: "rose",
      category: "Systems & Visuals",
      keyMetrics: [
        "Steady 60 FPS under full GPU ray-traces",
        "16+ Data structures fully mapped interactively",
        "Real-time procedural math shaders"
      ],
      installation: "# Clone repository\ncd algorithmVisualizer/frontend\nnpm install\n\n# Start visualizer server\nnpm run dev",
      architectureDetails: "Zustand State Coordinator -> Three.js Render Target WebGL -> react-force-graph-3d GPU Loop -> FastAPI Python Computation Helper -> SVG overlay monitors",
      detailedFeatures: [
        "Animated shortest path finder tracks using real-time dynamic weights",
        "Three-dimensional forces layout calculation utilizing GPU WebGL loops",
        "Procedural floating particles shader tracking vertex transformations",
        "User interactive speed sliders and structural array generator variables"
      ]
    },
    {
      id: "pyqhub",
      title: "PyQHub 2.0",
      subtitle: "Academic Exam Repository Network",
      description: "Sleek past years test questions repository designed to support college discovery. Features lightning-fast PostgreSQL indexes, secure file upload previews, and JWT authentication token rotations.",
      tags: ["React 18", "Express", "Prisma ORM", "PostgreSQL", "Cloudinary"],
      githubLink: "https://github.com/hannuverma/pyqhub-2.0",
      liveLink: "https://github.com",
      imageColor: "from-amber-600/20 to-indigo-500/15",
      techGlow: "gold",
      category: "Fullstack Web",
      keyMetrics: [
        "1,500+ Active college student accounts registered",
        "32ms Search queries via Postgres indexing metrics",
        "Fully automated Cloudinary PDF render buffers"
      ],
      installation: "# Boot backend prisma client\ncd backend && npm install\ncp .env.example .env\nnpm run db:migrate\n\n# Launch API\nnpm run dev",
      architectureDetails: "College Web Client -> React Router SPA -> Express Security Gateway -> Prisma Schema Mapping -> PostgreSQL Storage -> Cloudinary Document Cloud",
      detailedFeatures: [
        "Filter exam documents by subject index, examination year, batch, and semester",
        "Secure administrator moderation dashboard validating file submissions",
        "Automated PDF cover-page visual extraction using Cloudinary",
        "Advanced Postgres schemas containing multiple related student profiles"
      ]
    },
    {
      id: "blogging-site",
      title: "Blogging Site",
      subtitle: "Clean OAuth2 Writing Hub",
      description: "A complete writing workspace combining clean layouts, advanced image uploads, and secure authentication. Deployed across global edge CDNs for rapid performance indices.",
      tags: ["React 19", "Django REST", "Google OAuth 2.0", "Lottie CSS", "Tailwind 4"],
      githubLink: "https://github.com/hannuverma/Blogging-site",
      liveLink: "https://github.com",
      imageColor: "from-purple-600/20 to-teal-500/15",
      techGlow: "purple",
      category: "Fullstack Web",
      keyMetrics: [
        "Global Google OAuth2 single-sign-on integration",
        "Optimized image uploads processing on Django REST API",
        "Vercel Serverless hosting routing layouts"
      ],
      installation: "# Start Django backend\ncd Backend\npip install -r requirements.txt\npython manage.py runserver\n\n# Run Frontend React\ncd ../Frontend && npm install\nnpm run dev",
      architectureDetails: "Google Auth Callback -> React UI Client State -> Django Rest Framework Token Exchange -> SQLite Schema Database -> Vercel Static Distribution CDN",
      detailedFeatures: [
        "Google OAuth single sign-on mapping custom profiles database",
        "Lottie JSON vector animation layouts providing pristine onboarding flows",
        "Optimized multipart image payload form uploads with server validation",
        "Static site rendering structures designed for minimal paint sequences"
      ]
    },
    {
      id: "beacon",
      title: "Beacon",
      subtitle: "Safe Night-Life Maps Discoverer",
      description: "A map-centric live application promoting localized nights discovery, artists showcase, and citizen safety trip mapping with emergency SOS dispatch.",
      tags: ["React", "Django REST", "Leaflet API", "SQL Database", "GeoJSON"],
      githubLink: "https://github.com/hannuverma/Beacon",
      liveLink: "https://github.com",
      imageColor: "from-cyan-600/25 to-blue-500/15",
      techGlow: "cyan",
      category: "Fullstack Web",
      keyMetrics: [
        "Leaflet integration mapping GeoJSON vector regions",
        "Automatic density evaluation calculating safe crowds zones",
        "Instant emergency SOS trip tracking pinging active servers"
      ],
      installation: "# Install Django core database and map assets\npip install django djangorestframework\n\n# Launch map client server\nnpm run dev",
      architectureDetails: "User Browser GPS -> Leaflet GeoJS Mapping Context -> Django Coordinate Router -> Real-time SQL Database queries mapping event clusters",
      detailedFeatures: [
        "Community forum updates pinning alerts on localized vectors",
        "GeoJSON pathing removing unsafe or dark coordinates from active options",
        "Live trip location sharing allowing safety supervisors overview access",
        "Artist/small Business visual event uploads with document validations"
      ]
    },
    {
      id: "framedrop",
      title: "FrameDrop",
      subtitle: "Collaborative Photos Studio",
      description: "A collaborative, room-centric media publishing portal. Supports secure JWT invite lobbies, encrypted admin parameters, and Cloudinary resizing CDN buffers.",
      tags: ["React", "Express.js", "MongoDB", "Cloudinary", "Bcrypt API"],
      githubLink: "https://github.com/hannuverma/FrameDrop",
      liveLink: "https://github.com",
      imageColor: "from-indigo-600/30 to-pink-500/15",
      techGlow: "purple",
      category: "Fullstack Web",
      keyMetrics: [
        "Bcrypt salted hashing keys secure registers",
        "Dynamic room authorization models Admin roles",
        "Steady responsive media grid resizing performance"
      ],
      installation: "# Start express backend server\ncd backend && npm install\n# Configure Cloudinary vars\nnpm run dev",
      architectureDetails: "React Client -> Express Token Session Cookie -> MongoDB Database Document -> Cloudinary CDN Image Optimizations",
      detailedFeatures: [
        "Interactive room invites tracking multiple active members roles",
        "Cloudinary backend integration automatically compressing large image payloads",
        "JWT-locked endpoint protections blocking unauthorized media actions",
        "Smooth Framer Motion staggered grid entrance animations on enter"
      ]
    },
    {
      id: "dice-stats",
      title: "Dice Stats Analyzer",
      subtitle: "Parallel C++ OpenMP Simulation",
      description: "High-performance statistics tool using Mersenne Twister nodes. Measures error convergence rates and benchmarks multi-threaded CPU threads.",
      tags: ["C++17 Core", "OpenMP Parallelism", "Mersenne Twister", "Statistics", "CPU Benchmarking"],
      githubLink: "https://github.com/hannuverma/dice-stats",
      imageColor: "from-teal-600/20 to-slate-500/15",
      techGlow: "cyan",
      category: "Systems & Visuals",
      keyMetrics: [
        "Billions of simulated dice loops with high accuracy",
        "Excellent thread-safe parallel scaling OpenMP",
        "0.0005% precision tolerance measuring outcomes"
      ],
      installation: "# Compile with OpenMP parallel compiler flags\ng++ -O3 -fopenmp main.cpp files.cpp -o dice-stats\n\n# Run statistical simulation executable\n./dice-stats",
      architectureDetails: "Mersenne Twister Generator (Thread-Local) -> Parallel rolls loop -> OpenMP Critical Reduction -> Percentage Mean Error Calculation -> File IO result append (.txt)",
      detailedFeatures: [
        "Uses robust mt19937 random engines preventing pattern repetitions",
        "Calculates Percentage Mean Average Error tracking probability convergence",
        "Fully measures execution time down to nanoseconds for CPU benchmarking",
        "Secure administrator file utility wiping accumulated analytics data logs"
      ]
    },
    {
      id: "file-search",
      title: "File Search Engine",
      subtitle: "Recursive C++ Indexing Engine",
      description: "High-performance full-text recursive systems lookup tool. Quickly indexes directory maps and compiles file databases with low memory consumption.",
      tags: ["C++ Standard", "CMake Compiler", "Directory Traversal", "Inverted Index"],
      githubLink: "https://github.com/hannuverma/file.search.engine",
      imageColor: "from-amber-500/20 to-emerald-500/15",
      techGlow: "gold",
      category: "Systems & Visuals",
      keyMetrics: [
        "Inverted systems indices querying in microseconds",
        "Extremely tiny runtime heap memory usage profile",
        "Cross-platform cmake configurations supported"
      ],
      installation: "# Configure system files index\nmkdir build && cd build\ncmake ..\nmake && ./file-search-engine --index /paths",
      architectureDetails: "Recursive Directory filesystem Traversal -> Words Parsing & Inverted Index Compiler -> High speed Binary file DB -> Command Line Quick-Query Interface",
      detailedFeatures: [
        "Deep recursive file directory walking caching filesystem handles",
        "Fast inverted indices mapping search tokens directly to disk tracks",
        "Low core memory footprint capable of processing millions of unique filenames",
        "Optimized compiler flags ensuring peak native CPU instruction pipelining"
      ]
    }
  ];

  // Select top 4 premium visual highlights to present in Horizontal sticky track
  const carouselExcludedIds = ["dice-stats", "file-search", "pyqhub"];
  const horizontalFeaturedList = allProjectsList.filter(proj => !carouselExcludedIds.includes(proj.id));

  // Filter projects matrix
  const filteredCodexList = allProjectsList.filter((proj) => {
    const categoryMatch = selectedCategory === "All" || proj.category === selectedCategory;
    const searchMatch = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const handleCopyInstall = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const runTerminalSimulation = (proj: Project) => {
    setTerminalLogs([]);
    setTerminalStatus("running");

    const commands: string[] = [];
    if (proj.id === "clawvio") {
      commands.push(
        "> initializing clawvio voice system framework...",
        "[ok] system processes ready on kernel node thread",
        "> spawning desktop soundcard Whisper listener channels",
        "[active.sh] mapping voice coordinates: standard input set [Ctrl+Shift+Space]",
        "> initializing async inngest workflow queues... auth client clerk [CONNECTED]",
        "[db] supabase postgres rls verified. 0 leak violations found.",
        "--- SYSTEM OPERATING WITH MAXIMUM EFFICIENCY ---"
      );
    } else if (proj.id === "realitylens") {
      commands.push(
        "> uvicorn backend.server.main:app --port 8000",
        "[ok] mapping sqlalchemy models: jobs, credentials, oauth_sessions",
        "> checking screenshot clipboard triggers: hook [Cmd+Shift+L] ACTIVE",
        "> task job queue: polling local tavily engine channels",
        "[info] frame #0492 processed by YOLOv8: synth_deepfakes score = 1.2% [REAL]",
        "--- STATUS: SECURE AND LISTENING ON 127.0.0.1:8000 ---"
      );
    } else if (proj.id === "resolveit") {
      commands.push(
        "> python manage.py migrate",
        "[ok] 12 migration operations successful on system keys",
        "> establishing supabase postgres client schema constraints",
        "> connecting node.js langgraph similarities groupings",
        "[ai-agent] 3 similar complaints detected in student portal",
        "[points] department scoreboard credits transaction logged (+50 speed_bonus)",
        "--- STATUS: SECURE RESOLUTION FLOW READY ---"
      );
    } else if (proj.id === "dice-stats") {
      commands.push(
        "> g++ -O3 -fopenmp main.cpp -o dice-stats",
        "[compiler] building native visual C++ thread operations",
        "> launching statistical dice simulation: 10,000,000,000 rolls...",
        "[core 0] mt19937 rng seeded: parallel threads running [OMP]",
        "[results] accuracy: 99.99672% percentage mean average error: 0.00312%",
        "--- RUN SUCCESSFUL: execution took 12.19s ---"
      );
    } else {
      commands.push(
        `> launching sandbox tracker for ${proj.title}...`,
        "[ok] initializing compilation sequences",
        "> loading architecture modules...",
        `[ok] database pipeline ${proj.techGlow.toUpperCase()} active`,
        "--- PIPELINE VERIFICATION SUCCESSFUL ---"
      );
    }

    commands.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, log]);
        if (index === commands.length - 1) {
          setTerminalStatus("ready");
        }
      }, (index + 1) * 350);
    });
  };

  useEffect(() => {
    if (activeProject) {
      runTerminalSimulation(activeProject);
    }
  }, [activeProject]);

  return (
    <div className="bg-[#020202]">
      {/* 1. FEATURED 3D CYLINDER VERTICAL STICKY SCROLL SECTION */}
      <motion.div 
        ref={targetRef} 
        id="projects" 
        style={{ backgroundColor: "#020202" }}
        className="relative h-[500vh] overflow-visible"
      >
        <div className="sticky top-0 h-screen flex flex-col justify-between overflow-hidden">
          {/* Section Header */}
          <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-2 block">
                PORTFOLIO GRID
              </span>
              <h2 className="font-display font-medium text-4xl md:text-5xl tracking-tight text-white m-0">
                Featured Flagships
              </h2>
            </div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] text-zinc-500">
              <span className="animate-pulse text-cyan-400">●</span>
              <span>SCROLL VERTICALLY TO ROTATE 3D CYLINDER</span>
              <ArrowUpDown className="w-3.5 h-3.5 animate-bounce" />
            </div>
          </div>

          {/* Scrolling track wrapper applying 3D vertical cylinder transforms */}
          <motion.div 
            style={{ 
              perspective: 1200, 
              transformStyle: "preserve-3d",
              rotateX: containerRotateX,
              y: containerTranslateY
            }}
            className="h-[580px] w-full max-w-7xl mx-auto flex items-center justify-center relative mb-12 overflow-visible"
          >
            {horizontalFeaturedList.map((project, idx) => (
              <FlagshipCard
                key={project.id}
                project={project}
                idx={idx}
                scrollYProgress={scrollYProgress}
                setActiveProject={setActiveProject}
              />
            ))}
          </motion.div>

          {/* Carousel Progress indicator */}
          <div className="px-6 md:px-12 max-w-7xl mx-auto w-full pb-16">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase mb-2">
              <span>Cylinder Rotation Progress</span>
              <span>Visual Flagships Track</span>
            </div>
            <div className="w-full h-[2px] bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full bg-cyan-400 origin-left"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. ALL PROJECTS MATRIX SEARCH GRID SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 bg-[#020202]">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
          <div>
            <span className="font-mono text-xs text-orange-500 tracking-widest uppercase mb-2 block font-semibold">
              CATALOG MATRIX
            </span>
            <h2 className="font-display font-medium text-4xl md:text-5xl tracking-tight text-white m-0">
              Complete Project Codex
            </h2>
            <p className="text-zinc-500 text-sm max-w-md mt-2">
              A comprehensive directory mapping all 10 repositories. Drill down using subject categories or instant tags query.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query tags (e.g. C++, Supabase)..."
              className="w-full bg-[#080808] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all pointer-events-auto"
            />
            <Search className="w-4 h-4 text-zinc-600 absolute left-4 top-3.5" />
          </div>
        </div>

        {/* Categories Tab selectors */}
        <div className="flex flex-wrap gap-2.5 mb-8 border-b border-white/5 pb-6">
          {["All", "AI & Agents", "Fullstack Web", "Systems & Visuals"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-mono rounded-lg border transition-all pointer-events-auto interactive-hover uppercase ${
                selectedCategory === cat
                  ? "bg-white text-black border-white"
                  : "bg-transparent border-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Matrix Results Grid displaying filtered items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCodexList.map((proj) => (
              <motion.div
                layout
                key={proj.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl border border-white/5 hover:border-white/10 p-6 flex flex-col justify-between group relative overflow-hidden transition-all text-left pointer-events-auto h-[320px]"
              >
                {/* Visual hover background flare */}
                <div className={`absolute -right-16 -bottom-16 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity ${
                  proj.techGlow === "cyan" ? "bg-cyan-500" : proj.techGlow === "purple" ? "bg-orange-500" : "bg-emerald-500"
                }`} />

                <div>
                  {/* Category Pill tag header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-mono text-zinc-500 px-2 py-0.5 border border-white/5 rounded">
                      {proj.category || "Fullstack Native"}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      proj.techGlow === "cyan" ? "bg-cyan-400" : proj.techGlow === "purple" ? "bg-orange-500" : "bg-emerald-400"
                    }`} />
                  </div>

                  <h3 className="text-xl font-display text-white font-medium group-hover:text-cyan-400 transition-colors mb-2">
                    {proj.title}
                  </h3>

                  <p className="text-zinc-500 text-xs leading-normal mb-5 line-clamp-4">
                    {proj.description}
                  </p>
                </div>

                {/* Card links & tags footer */}
                <div className="border-t border-white/5 pt-4">
                  <div className="flex flex-wrap gap-1 mb-4 h-6 overflow-hidden">
                    {proj.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] font-mono text-zinc-400 bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveProject(proj)}
                      className="text-cyan-400 group-hover:text-white font-mono text-[10px] uppercase flex items-center gap-1.5 transition-colors interactive-hover"
                    >
                      <span>EXAMINE MODULE</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2">
                      <a
                        href={proj.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-600 hover:text-white transition-colors"
                      >
                        <FaGithub className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty fallback state */}
          {filteredCodexList.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center text-center">
              <span className="font-mono text-xs text-zinc-600 uppercase mb-2">No elements matched</span>
              <p className="text-zinc-500 text-sm max-w-xs">
                Refine your target search or category tab options to load matching project matrices.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. CINEMATIC SIDE DRAWER SYSTEM OVERLAY */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Blurring interactive backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-zoom-out"
            />

            {/* Main Drawer container panel floating from right */}
            <motion.div
              initial={{ x: "100%", opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full md:w-[650px] h-screen bg-[#040404] border-l border-white/10 z-10 flex flex-col justify-between overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                {/* Header detail menu */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-500/20">
                      {activeProject.category}
                    </span>
                    <span className="text-zinc-600 font-mono text-[10px]">
                      {activeProject.id.toUpperCase()}_BLUE_PRINTS.LOG
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveProject(null)}
                    className="p-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Project Title Block info */}
                <div className="mb-8">
                  <h3 className="font-display text-2xl md:text-3.5xl font-medium text-white mb-2">
                    {activeProject.title}
                  </h3>
                  <p className="text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
                    {activeProject.subtitle}
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                    {activeProject.description}
                  </p>
                </div>

                {/* Architecture Details map */}
                <div className="glass-card border border-white/5 rounded-xl p-5 mb-8">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase mb-3">
                    <Database className="w-4 h-4 text-orange-500" />
                    <span>System Architecture Pathway</span>
                  </div>
                  <div className="text-zinc-300 font-sans text-xs bg-black/40 p-3 rounded-lg border border-white/5 font-medium leading-relaxed">
                    {activeProject.architectureDetails}
                  </div>
                </div>

                {/* Key modular features list bullets */}
                <div className="mb-8 text-left">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-4">
                    Core Technical Deliverables
                  </span>
                  <div className="space-y-3.5">
                    {activeProject.detailedFeatures?.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-zinc-300 font-sans leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Simulated system terminal sandbox */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span>PROCESS_SIMULATOR</span>
                    </div>
                    {terminalStatus === "ready" && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">
                        PROCESS_OK
                      </span>
                    )}
                  </div>

                  <div className="bg-black/90 rounded-xl border border-white/10 p-5 font-mono text-xs text-zinc-400 min-h-[160px] flex flex-col justify-between overflow-x-auto relative">
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pb-4">
                      {terminalLogs.map((log, idx) => (
                        <p key={idx} className={
                          log.startsWith(">") ? "text-cyan-400" :
                          log.startsWith("[ok]") || log.includes("CONNECTED") || log.includes("SUCCESSFUL") ? "text-emerald-400" :
                          log.startsWith("[compiler]") || log.startsWith("[info]") ? "text-amber-400" : "text-zinc-300"
                        }>
                          {log}
                        </p>
                      ))}

                      {terminalStatus === "running" && (
                        <div className="flex items-center gap-1.5 text-cyan-400 h-5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-[10px] animate-pulse">Processing instructions matrix...</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => runTerminalSimulation(activeProject)}
                      disabled={terminalStatus === "running"}
                      className="absolute right-4 bottom-4 p-2 bg-white/[0.03] border border-white/10 text-cyan-400 hover:text-white rounded-lg transition-colors pointer-events-auto"
                      title="Rerun Simulation Pipeline"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Copyable Installation block */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                      INSTALLATION_PROMPT
                    </span>
                    <button
                      onClick={() => handleCopyInstall(activeProject.installation || "")}
                      className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase flex items-center gap-1.5 cursor-pointer pointer-events-auto"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY CODE</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-black/60 rounded-xl border border-white/5 p-4 overflow-x-auto text-left text-xs font-mono text-zinc-300 leading-relaxed">
                    {activeProject.installation}
                  </pre>
                </div>
              </div>

              {/* Close Drawer controls bottom */}
              <div className="p-6 border-t border-white/5 bg-[#030303]/98 text-left">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <a
                      href={activeProject.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 bg-[#080808] border border-white/5 text-zinc-300 hover:text-white text-xs font-mono rounded-lg flex items-center gap-2 transition-colors duration-250 cursor-pointer pointer-events-auto interactive-hover"
                    >
                      <FaGithub className="w-4 h-4 text-zinc-400" />
                      GITHUB REPOSITORY
                    </a>
                  </div>
                  <button
                    onClick={() => setActiveProject(null)}
                    className="px-4 py-3 text-zinc-500 hover:text-white text-xs font-mono uppercase bg-transparent hover:bg-white/[0.01] transition-all cursor-pointer pointer-events-auto rounded-lg"
                  >
                    Dimiss Codex
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}