import { motion } from "framer-motion";
import { Award, Trophy, Calendar, CheckSquare } from "lucide-react";
import type { HackathonEntry } from "../types";

export default function Timeline() {
  const timelineEntries: HackathonEntry[] = [
    {
      id: "cybrathon",
      title: "Cybrathon 2.0",
      achievement: "Grand Finalist Spotlight",
      description: "Designed, engineered, and shipped 'Beacon', a real-time humanitarian navigation system. Connects dispatchers with affected citizens in active natural disaster coordinates. Configures background sockets mapping distress vectors onto real-time interactive overlays.",
      date: "March 2026",
      tags: ["React SPA", "Django REST Framework", "Leaflet Maps", "Channels WebSockets"],
      glowColor: "orange"
    },
    {
      id: "sustaintech",
      title: "SustainTech Hackathon",
      achievement: "Technical Innovation Winner",
      description: "Architected 'ResolveIt', an enterprise resource-carbon auditing platform. Integrates multi-tenant structures leveraging Row-Level Security, processing carbon footprint coefficients automatically via AI pipelines to recommend localized raw offset initiatives.",
      date: "November 2025",
      tags: ["Django ORM", "Supabase PG", "Anthropic AI API", "Serverless Edge Tasks"],
      glowColor: "orange"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 20 }
    }
  };

  return (
    <section id="timeline" className="py-24 relative px-6 bg-[#020202]">
      {/* Glow Backdrops */}
      <div className="absolute top-[40%] right-[10%] w-[50vw] h-[300px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[5%] w-[40vw] h-[250px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="flex flex-col mb-16 text-left relative z-10">
          <span className="font-mono text-xs text-orange-500 tracking-widest uppercase mb-2 font-semibold">
            STREAKS & ACHIEVEMENTS
          </span>
          <h2 className="font-display font-medium text-4xl md:text-5xl tracking-tight text-white m-0">
            Hackathons Timeline
          </h2>
        </div>

        {/* Timeline main tree structure */}
        <div className="relative border-l border-zinc-800/80 pl-6 md:pl-12 ml-4 md:ml-8 space-y-16 max-w-4xl relative z-10">
          {/* Glowing vertical line slider representing progression */}
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.3)]" />

          {timelineEntries.map((entry, idx) => (
            <div key={entry.id} className="relative">
              {/* Timeline outer interactive dot */}
              <div className="absolute top-1.5 left-[-30px] md:left-[-54px] z-20 flex items-center justify-center">
                <motion.div
                   initial={{ scale: 0.8, opacity: 0.5 }}
                   whileInView={{ scale: 1, opacity: 1 }}
                   viewport={{ once: true, margin: "-100px" }}
                   className={`w-4 h-4 rounded-full border-2 ${
                     entry.glowColor === "orange" 
                       ? "bg-[#020202] border-orange-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" 
                       : "bg-[#020202] border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                   }`}
                />
              </div>

              {/* Collateral item details card rendering */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden backdrop-blur-3xl group"
              >
                {/* Decorative background visual label identifier */}
                <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[10px] text-zinc-500 bg-white/[0.02] border border-white/5 py-1 px-3 rounded-full">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {entry.date}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Category titles */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {idx === 0 ? (
                        <Trophy className="w-4 h-4 text-orange-400 animate-pulse" />
                      ) : (
                        <Award className="w-4 h-4 text-orange-500" />
                      )}
                      <span className={`text-[11px] font-mono tracking-widest uppercase font-semibold ${
                        entry.glowColor === "orange" ? "text-orange-400" : "text-orange-500"
                      }`}>
                        {entry.achievement}
                      </span>
                    </div>

                    <h3 className="font-display font-medium text-xl md:text-2xl text-white">
                      {entry.title}
                    </h3>
                  </div>

                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                    {entry.description}
                  </p>

                  {/* Highlights section inside bullet card */}
                  <div className="space-y-2 mt-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-medium">
                      Architectural Deliverables
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {idx === 0 ? (
                        <>
                          <div className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckSquare className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <span>Secured <strong>Top-10 Finalist</strong> standing from 180+ teams nationwide</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckSquare className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <span>Shipped dynamic Leaflet rendering pipeline in 36 hours</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckSquare className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span>Received <strong>Special Engineering Innovation Award</strong></span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckSquare className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span>Engineered modular Supabase schema restricting API leaks</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badges footer section */}
                  <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-4 mt-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono bg-white/[0.02] border border-white/5 text-zinc-400 px-2.5 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
