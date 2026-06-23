import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Sparkles, Cpu } from "lucide-react";
import { useCursor } from "../context/CursorContext";
import FloatingShapes from "./FloatingShapes";

export default function Hero() {
  const { setVariant, resetVariant } = useCursor();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  const handleScrollToProjects = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      const topOffset = 85;
      const elementPosition = projectsSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: "smooth"
      });
    }
  };

  const handleScrollToContact = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      window.scrollTo({
        top: contactSection.getBoundingClientRect().top + window.scrollY - 85,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] flex items-center justify-center pt-24 overflow-hidden px-6"
    >
      {/* Dynamic particles & wireframe backdrop */}
      <FloatingShapes />

      {/* Decorative top ambient radial glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[70vw] h-[300px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[250px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Content Grid */}
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Text Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 flex flex-col justify-center text-left"
        >
          {/* Headline pill */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full w-fit mb-6 shadow-[inset_0_1px_12px_rgba(255,255,255,0.02)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="font-mono text-xs text-orange-400 tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Open to internship, Summer 2026
            </span>
          </motion.div>

          {/* Master title */}
          <motion.h1 
            variants={itemVariants}
            className="font-display font-bold text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight text-white mb-6"
          >
            Hi, I'm a <br />
            <span className="text-gradient-orange-purple font-extrabold relative">
              Full-Stack & 3D
            </span>{" "}
            Developer.
          </motion.h1>

          {/* Subtitle / pitch desc */}
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 font-sans text-base md:text-lg max-w-2xl leading-relaxed mb-8 flex flex-col gap-2"
          >
            <span>
              I am a pursuing computer science engineering student designing highly efficient 3D WebGL architectures, robust and reactive web environments, and production-grade artificial intelligence systems.
            </span>
            <span className="text-zinc-500 text-sm font-mono mt-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500/80" /> node process: active.sh --optimization=max
            </span>
          </motion.p>
 
          {/* Call to actions area */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <button
              onClick={handleScrollToProjects}
              onMouseEnter={() => setVariant('expanded')}
              onMouseLeave={resetVariant}
              className="px-6 py-3.5 bg-white text-black font-semibold rounded-lg flex items-center gap-2 text-sm hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group interactive-hover shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
            >
              Examine Code Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleScrollToContact}
              onMouseEnter={() => setVariant('expanded')}
              onMouseLeave={resetVariant}
              className="px-6 py-3.5 bg-white/[0.04] text-white border border-white/10 font-semibold rounded-lg flex items-center gap-2 text-sm hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 interactive-hover"
            >
              Get in Touch
            </button>
          </motion.div>
        </motion.div>
 
        {/* Decorative Right Dashboard mockup to hint at elite capabilities */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.6 }}
          className="lg:col-span-4 hidden lg:block"
        >
          <div className="glass-card rounded-2xl p-6 glow-orange border border-white/10 relative overflow-hidden backdrop-blur-2xl">
            {/* Top window headers */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <div className="text-xs font-mono text-zinc-500">core_module.py</div>
            </div>
 
            {/* Simulated server logs / code */}
            <div className="font-mono text-xs space-y-2.5 text-zinc-400">
              <p className="text-orange-400"># Initializing algorithmic visualizations...</p>
              <p className="text-zinc-500">{"[ok] Importing ThreeJS, react-force-graph..."}</p>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                <span className="text-orange-400">const</span> renderMatrix = (nodes: <span className="text-orange-400">Node3D[]</span>) =&gt; &#123;
                <div className="pl-4 text-zinc-500">
                  console.log(<span className="text-emerald-400">'Mapping coordinates...'</span>);
                  return nodes.map(n =&gt; Math.sin(n.z));
                </div>
                &#125;
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Cpu className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">System Efficiency</div>
                  <div className="text-white text-sm">99.8% Optimized Thread</div>
                </div>
              </div>
            </div>
 
            {/* Glowing decorative floating dots */}
            <div className="absolute top-[20%] right-[-10px] w-12 h-12 bg-orange-500/10 blur-xl rounded-full" />
            <div className="absolute bottom-[10%] left-[-10px] w-12 h-12 bg-orange-500/10 blur-xl rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Micro scroll layout hints */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">Scroll down</span>
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-1.5 h-3 bg-zinc-400 rounded-full"
        />
      </div>
    </section>
  );
}
