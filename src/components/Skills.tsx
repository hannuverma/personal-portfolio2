import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Layers, 
  Cpu, 
  Cloud, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  Network, 
  Info
} from "lucide-react";
import type { SkillCategory, SkillItem } from "../types";
import { useCursor } from "../context/CursorContext";

// Extended interface for the 3D node representation
interface SkillNode3D extends SkillItem {
  categoryTitle: string;
  categoryGlow: string;
  x: number;
  y: number;
  z: number;
}

export default function Skills() {
  const { setVariant, resetVariant } = useCursor();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>({
    name: "TypeScript",
    iconName: "Code2",
    description: "Robust type-safe programming language powering all modern web client interfaces and server modules.",
    glowColor: "orange",
    details: ["Type-Safe Scalability", "AST Manipulation", "Complex Generics Mastery", "Vite/ESBuild Compiler Optimization"],
  });

  const categories: SkillCategory[] = [
    {
      title: "Languages",
      glowColor: "orange",
      skills: [
        {
          name: "TypeScript",
          iconName: "Code2",
          description: "Statically typed JavaScript superset maximizing full-stack design scalability and minimizing runtime failure models.",
          glowColor: "orange",
          details: ["Advance Generics & Utilities", "AST Compilation Pipelines", "State Engines (Zustand/Redux)", "Type-safe Express routes"],
        },
        {
          name: "C++",
          iconName: "Cpu",
          description: "High-performance compilable language heavily used for rigorous math pipelines, matrix calculations, and speed-intensive algorithm design.",
          glowColor: "orange",
          details: ["Resource Management (RAII)", "Data Representation Architectures", "Memory Optimization & Pointers", "Compiler optimization flags"],
        },
        {
          name: "Python",
          iconName: "Code2",
          description: "Highly expressive language utilized extensively for scripting servers, machine learning pipelines, and vector embeddings.",
          glowColor: "orange",
          details: ["Asynchronous asyncio structures", "Django / FastAPI ecosystems", "Data Analysis (Pandas/YOLO)", "LLM integrations (Google GenAI)"],
        },
      ],
    },
    {
      title: "Frameworks",
      glowColor: "orange",
      skills: [
        {
          name: "React",
          iconName: "Layers",
          description: "Sleek frontend environment. Crafting complex component cycles and high-speed hook synchronization models.",
          glowColor: "orange",
          details: ["Virtual DOM Optimization", "Custom state managers", "React-19 structural states", "Advanced Motion triggers (Framer/HMR)"],
        },
        {
          name: "FastAPI",
          iconName: "Cpu",
          description: "Exceedingly rapid, self-documenting asynchronous server gateway designed for AI model exposure.",
          glowColor: "orange",
          details: ["Asynchronous Pydantic schemas", "Dependency Injection design", "High throughput JSON routing", "WebSockets and live streaming APIs"],
        },
        {
          name: "Django",
          iconName: "Layers",
          description: "Fully loaded, battery-included framework ensuring rapid database modelling and solid API routing patterns.",
          glowColor: "orange",
          details: ["Secure ORM query designs", "Multi-tenant authentication", "REST Framework serializations", "Celery cron task threads"],
        },
        {
          name: "Next.js",
          iconName: "Layers",
          description: "Production-ready meta-framework combining React component states with Server-Side Rendering (SSR).",
          glowColor: "orange",
          details: ["Static Site Generation (SSG)", "Incremental Static Regeneration", "Server Actions integration", "Edge network deployments"],
        },
      ],
    },
    {
      title: "3D & Visuals",
      glowColor: "green",
      skills: [
        {
          name: "Three.js",
          iconName: "Cpu",
          description: "GPU-accelerated vector rendering framework bringing real-time mathematical meshes directly to the browser view.",
          glowColor: "green",
          details: ["Custom WebGL Shader writing", "Lighting, Shadows, Raycasting", "Mathematical projection orbits", "Scene graph structure optimization"],
        },
        {
          name: "react-force-graph-3d",
          iconName: "Layers",
          description: "Specialized graph simulation environment modeling relational network links dynamically in realistic 3-dimensions.",
          glowColor: "green",
          details: ["Three-dimensional force engines", "Node click intersection states", "Dynamic dataset mapping", "Custom VR canvas integration"],
        },
      ],
    },
    {
      title: "Backend & Cloud",
      glowColor: "white",
      skills: [
        {
          name: "PostgreSQL",
          iconName: "Cloud",
          description: "Exceedingly reliable relational database solution featuring custom indexes, triggers, and precise transactional safety.",
          glowColor: "white",
          details: ["Advanced Query tuning", "Indexes & Schema migrations", "Transaction locking levels", "Serverless PgPooler scaling"],
        },
        {
          name: "Supabase",
          iconName: "Cloud",
          description: "Modern Firebase-alternative backend-as-a-service leveraging robust PostgreSQL features, vector lookups, and instantaneous socket listeners.",
          glowColor: "white",
          details: ["Row-Level Security (RLS)", "OAuth authentication flows", "Automated backup pipelines", "Serverless edge procedures"],
        },
        {
          name: "Vercel / Render",
          iconName: "Cloud",
          description: "Fast-deploy CD networks hosting highly responsive edge operations and global server runtimes.",
          glowColor: "white",
          details: ["Edge-Caching optimization", "Environment configurations", "Automatic preview rollouts", "Static distribution routing"],
        },
      ],
    },
  ];

  const categoryIcons = [Code2, Layers, Cpu, Cloud];

  // Flatten skills, mapping them to uniform 3D sphere coordinate vectors
  const skillsList3D = useRef<SkillNode3D[]>([]);

  // Generate 3D Spherical nodes once using Fibonacci spiral projection
  useEffect(() => {
    const list: SkillNode3D[] = [];
    let idx = 0;
    
    // Total physical nodes
    const totalNodes = categories.reduce((sum, cat) => sum + cat.skills.length, 0);

    categories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        // Fibonacci Sphere projection formula
        const y = 1 - (idx / (totalNodes - 1)) * 2; // Range from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = idx * Math.PI * (3 - Math.sqrt(5)); // Golden angle

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        // Apply physical distance bounds
        const scaleDist = 135;

        list.push({
          ...skill,
          categoryTitle: cat.title,
          categoryGlow: cat.glowColor,
          x: x * scaleDist,
          y: y * scaleDist,
          z: z * scaleDist
        });
        idx++;
      });
    });
    skillsList3D.current = list;
  }, []);

  const handleSkillSelect = (skill: SkillItem) => {
    setActiveSkill(skill);
    // Find category index of this skill to synchronize left tab selector
    const catIdx = categories.findIndex(cat => cat.title === (skill as any).categoryTitle || cat.skills.some(s => s.name === skill.name));
    if (catIdx !== -1) {
      setSelectedCategoryIndex(catIdx);
    }
  };

  const handleCategorySelect = (index: number) => {
    setSelectedCategoryIndex(index);
    const fitSkill = categories[index].skills[0];
    if (fitSkill) {
      setActiveSkill(fitSkill);
    }
  };

  // --- Interactive 3D Sphere Canvas Implementation ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationAngles = useRef({ x: 0.1, y: 0.1 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const spotlightedNodeIndex = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const fov = 350; // Camera focal depth parameter

    const renderLoop = () => {
      // Scale coordinates on high-res displays
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Clear visual trails with deep dark translucent spacer
      ctx.fillStyle = "rgba(4, 4, 4, 0.22)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Slow, automated rotation offsets when cursor is completely idle
      if (!isDragging.current) {
        rotationAngles.current.y += 0.0035;
        rotationAngles.current.x += 0.0015;
      }

      const cosX = Math.cos(rotationAngles.current.x);
      const sinX = Math.sin(rotationAngles.current.x);
      const cosY = Math.cos(rotationAngles.current.y);
      const sinY = Math.sin(rotationAngles.current.y);

      // 1. Project all nodes into flat screen space coordinate system
      const nodes = skillsList3D.current.map((node, index) => {
        // Y-axis spin projection
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.x * sinY + node.z * cosY;

        // X-axis spin projection
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = node.y * sinX + z1 * cosX;

        // Apply camera projection factor
        const scaleTerm = fov / (fov + z2);
        const px = cx + x1 * scaleTerm;
        const py = cy + y2 * scaleTerm;

        return {
          px,
          py,
          depth: z2,
          scale: scaleTerm,
          node,
          index
        };
      });

      // Sort by depth (painters algorithm) to display back rings first
      nodes.sort((a, b) => b.depth - a.depth);

      // Find node closest to mouse cursor coordinates
      let nearestIndex: number | null = null;
      let minDistance = 24; // Range click boundary

      nodes.forEach((item) => {
        const dx = mousePos.current.x - item.px;
        const dy = mousePos.current.y - item.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIndex = item.index;
        }
      });
      spotlightedNodeIndex.current = nearestIndex;

      // Draw faint cyber orbit lines in perspective
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Draw connections between nodes of identical categories to form structural constellation meshes
      nodes.forEach((aItem) => {
        nodes.forEach((bItem) => {
          if (aItem.index !== bItem.index && aItem.node.categoryTitle === bItem.node.categoryTitle) {
            // Draw a fine connecting pathway
            const dx = aItem.node.x - bItem.node.x;
            const dy = aItem.node.y - bItem.node.y;
            const dz = aItem.node.z - bItem.node.z;
            const d3Dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Connect nearest adjacent peers in the category network
            if (d3Dist < 165) {
              const alphaFactor = Math.max(0.01, Math.min(0.12, (1 - (aItem.depth + bItem.depth) / 400) * 0.12));
              let strokeCol = `rgba(255, 255, 255, ${alphaFactor})`;
              if (aItem.node.categoryGlow === "orange") strokeCol = `rgba(251, 146, 60, ${alphaFactor})`;
              else if (aItem.node.categoryGlow === "orange") strokeCol = `rgba(249, 115, 22, ${alphaFactor})`;
              else if (aItem.node.categoryGlow === "green") strokeCol = `rgba(34, 197, 94, ${alphaFactor})`;

              ctx.strokeStyle = strokeCol;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(aItem.px, aItem.py);
              ctx.lineTo(bItem.px, bItem.py);
              ctx.stroke();
            }
          }
        });
      });

      // 3. Draw physical nodes and label overlays
      nodes.forEach((item) => {
        const isSelected = activeSkill?.name === item.node.name;
        const isHovered = spotlightedNodeIndex.current === item.index;

        // Apply a visual active spotlight bounce
        const visualRadius = Math.max(2.5, (item.node.glowColor ? 4.5 : 3.5) * item.scale);
        const alpha = Math.max(0.15, Math.min(1, (1 - item.depth / 230)));

        let colorStyle = "rgba(255, 255, 255, "; // Default white
        if (item.node.categoryGlow === "orange") colorStyle = "rgba(251, 146, 60, ";
        else if (item.node.categoryGlow === "orange") colorStyle = "rgba(249, 115, 22, ";
        else if (item.node.categoryGlow === "green") colorStyle = "rgba(34, 197, 94, ";

        // Spotlight highlight halo
        if (isHovered || isSelected) {
          ctx.strokeStyle = `${colorStyle}${alpha * 0.35})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(item.px, item.py, visualRadius * 2.8, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw inner core node circle
        ctx.fillStyle = `${colorStyle}${isSelected ? 1 : alpha})`;
        ctx.beginPath();
        ctx.arc(item.px, item.py, isSelected ? visualRadius * 1.4 : visualRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node label typography overlay
        const isCategoryMatched = categories[selectedCategoryIndex].title === item.node.categoryTitle;
        const textWeight = isSelected ? "bold" : "normal";
        ctx.font = `${textWeight} 10px "JetBrains Mono", monospace`;
        ctx.fillStyle = isSelected 
          ? "rgba(255, 255, 255, 1)" 
          : isHovered 
          ? "rgba(255, 255, 255, 0.95)"
          : isCategoryMatched
          ? `rgba(230, 230, 230, ${alpha * 0.85})`
          : `rgba(130, 130, 130, ${alpha * 0.4})`;

        // Align label text beautifully offset to the side
        if (item.depth < 120) { // Keep back-facing nodes extremely clean
          ctx.fillText(item.node.name, item.px + 9, item.py + 3.5);
        }
      });

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [activeSkill, selectedCategoryIndex]);

  // Handle Drag-to-rotate interaction handlers
  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (!isDragging.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    rotationAngles.current.y += dx * 0.007;
    rotationAngles.current.x += dy * 0.007;

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCanvasClick = () => {
    if (spotlightedNodeIndex.current !== null) {
      const selectedNode = skillsList3D.current[spotlightedNodeIndex.current];
      if (selectedNode) {
        handleSkillSelect(selectedNode);
      }
    }
  };

  return (
    <section id="stack" className="py-24 relative px-6 max-w-7xl mx-auto">
      {/* Decorative backdrop glows */}
      <div className="absolute top-[20%] left-[-80px] w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-80px] w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      {/* Section Grid header */}
      <div className="flex flex-col mb-16 relative z-10 text-left">
        <span className="font-mono text-xs text-orange-500 tracking-widest uppercase mb-2 font-semibold">
          COMPETENCIES
        </span>
        <h2 className="font-display font-medium text-4xl md:text-5xl tracking-tight text-white">
          The Interactive Tech Stack
        </h2>
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Side: Bento Categories Selection menu */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="text-xs uppercase font-mono tracking-wider text-zinc-500 pl-2 mb-1 text-left">
            Core Domains
          </div>
          {categories.map((cat, idx) => {
            const IconComponent = categoryIcons[idx] || Code2;
            const isSelected = selectedCategoryIndex === idx;

            // Compute border glow color
            let glowBorders = "border-white/5 bg-white/[0.01]";
            if (isSelected) {
              if (cat.glowColor === "orange") glowBorders = "border-orange-500/40 bg-orange-950/10 shadow-[0_0_15px_rgba(249,115,22,0.05)]";
              else if (cat.glowColor === "orange") glowBorders = "border-orange-500/40 bg-orange-950/10 shadow-[0_0_15px_rgba(249,115,22,0.05)]";
              else if (cat.glowColor === "green") glowBorders = "border-green-500/40 bg-green-950/10 shadow-[0_0_15px_rgba(34,197,94,0.05)]";
              else glowBorders = "border-white/20 bg-white/[0.03] shadow-[0_0_15px_rgba(255,255,255,0.05)]";
            }

            return (
              <button
                key={cat.title}
                onClick={() => handleCategorySelect(idx)}
                onMouseEnter={() => setVariant('expanded')}
                onMouseLeave={resetVariant}
                className={`w-full text-left p-4 rounded-xl glass-card border flex items-center justify-between group transition-all duration-300 pointer-events-auto interactive-hover ${glowBorders}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isSelected
                        ? cat.glowColor === "orange"
                          ? "bg-orange-500/15 text-orange-400"
                          : cat.glowColor === "orange"
                          ? "bg-orange-500/15 text-orange-500"
                          : cat.glowColor === "green"
                          ? "bg-green-500/15 text-green-400"
                          : "bg-white/10 text-white"
                        : "bg-white/[0.03] text-zinc-400 group-hover:text-white"
                     }`}
                  >
                    <IconComponent className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3
                      className={`font-display text-xs font-semibold transition-colors ${
                        isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      {cat.skills.length} Tech Vectors
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    isSelected ? "text-white translate-x-1" : "text-zinc-600 group-hover:text-zinc-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Center: Immersive 3D Constellation Orbit Globe */}
        <div className="lg:col-span-5 h-[360px] md:h-[400px] lg:h-full min-h-[350px] flex flex-col justify-between glass-card border border-white/5 bg-black/40 rounded-2xl relative p-6 overflow-hidden">
          {/* Subtle Cyber Grid backgrounds */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-orange-500/10" />
          <div className="absolute inset-y-0 left-0 w-[1px] bg-orange-500/10" />

          {/* Hologram details */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500">
              <Network className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: "10s" }} />
              <span className="tracking-widest uppercase text-orange-400/80">3D_VECTOR_COGNITION_CORE</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-600">DRAG CORE TO SPIN</span>
          </div>

          {/* Interactive Sphere Canvas viewport */}
          <div className="flex-1 flex items-center justify-center relative cursor-grab active:cursor-grabbing w-full h-full my-3">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { handleMouseUp(); resetVariant(); }}
              onClick={handleCanvasClick}
              onMouseEnter={() => setVariant('expanded')}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-3 relative z-10 select-none">
            <div className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-orange-400" />
              <span>SPHERICAL MAP ACTIVE</span>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-600">NODES: 12</span>
              <span>â— HOLOSTREAM</span>
            </div>
          </div>
        </div>

        {/* Right Side: High-impact analytical dashboard detailing active selected technology */}
        <div className="lg:col-span-4 min-h-[350px]">
          <div className="text-xs uppercase font-mono tracking-wider text-zinc-500 pl-2 mb-2 text-left">
            Technical Diagnosis
          </div>
          <AnimatePresence mode="wait">
            {activeSkill && (
              <motion.div
                key={activeSkill.name}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between border border-white/10 relative overflow-hidden backdrop-blur-xl text-left"
              >
                {/* Visual glow corner effect based on selected skill category */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-15 rounded-full transition-all duration-300 ${
                    selectedCategoryIndex === 0
                      ? "bg-orange-500"
                      : selectedCategoryIndex === 1
                      ? "bg-orange-500"
                      : selectedCategoryIndex === 2
                      ? "bg-green-500"
                      : "bg-white"
                  }`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Header: Skill Name & Category tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl font-display text-white font-medium tracking-tight">
                        {activeSkill.name}
                      </div>
                      <span className={`text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        selectedCategoryIndex === 0 ? "text-orange-400 border-orange-500/20 bg-orange-950/15" :
                        selectedCategoryIndex === 1 ? "text-orange-500 border-orange-500/20 bg-orange-950/15" :
                        selectedCategoryIndex === 2 ? "text-green-400 border-green-500/20 bg-green-950/15" :
                        "text-white border-white/20 bg-white/[0.03]"
                      }`}>
                        {categories[selectedCategoryIndex].title}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-xs leading-relaxed font-sans mb-6">
                      {activeSkill.description}
                    </p>

                    {/* Architectural capability bullets */}
                    <div className="space-y-3.5 mb-6">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Info className="w-3 h-3 text-orange-400" />
                        <span>Demonstrated Proficiencies</span>
                      </div>
                      {activeSkill.details.map((detail) => (
                        <div key={detail} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="text-xs text-zinc-300 font-sans leading-tight">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aesthetic visual system stats */}
                  <div className="border-t border-white/5 pt-4">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-500">OPTIMIZATION INDEX</span>
                      <span className="text-emerald-400">VERIFIED MODULES</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-[3px] rounded-full mt-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "95%" }}
                        transition={{ duration: 0.6 }}
                        className={`h-full ${
                          selectedCategoryIndex === 0
                            ? "bg-orange-400"
                            : selectedCategoryIndex === 1
                            ? "bg-orange-500"
                            : selectedCategoryIndex === 2
                            ? "bg-green-500"
                            : "bg-white"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

