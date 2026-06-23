import { useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, CheckCircle2, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useCursor } from "../context/CursorContext";

export default function Contact() {
  const { setVariant, resetVariant } = useCursor();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "transmitting" | "completed">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState("transmitting");
    setTimeout(() => {
      setFormState("completed");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormState("idle"), 4000);
    }, 1500);
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/hannuverma",
      icon: FaGithub,
      color: "hover:text-orange-400 hover:border-orange-500/30 hover:bg-orange-950/10"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/hannu-verma-b6930b2b7/",
      icon: FaLinkedin,
      color: "hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-950/10"
    },
    {
      name: "Email",
      url: "mailto:hannuverma78@gmail.com",
      icon: Mail,
      color: "hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-950/10"
    }
  ];

  return (
    <footer id="contact" className="py-24 relative px-6 max-w-7xl mx-auto border-t border-white/5 bg-[#020202]">
      {/* Decorative ambient flare */}
      <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[80vw] h-[300px] rounded-full bg-orange-500/5 blur-[150px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Left column: Epic typography Call To Action & socials */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs text-orange-400 tracking-widest uppercase mb-2 block">
              TRANSMIT ROUTE
            </span>
            <h2 className="font-display font-medium text-5xl md:text-7xl leading-none text-white tracking-tight mb-6">
              Let's <br />
              <span className="text-orange-400 font-extrabold">Build Beyond</span>.
            </h2>
            <p className="text-zinc-400 max-w-md text-sm md:text-base leading-relaxed mb-8">
              Always on the lookup for challenging problem matrices, system optimizations, and forward-thinking internship terms. Tap into my grid.
            </p>
          </div>

          {/* Social connections cards */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">
              Directory Anchors
            </span>
            <div className="flex flex-wrap gap-3.5">
              {socialLinks.map((soc) => (
                <motion.a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setVariant('expanded')}
                  onMouseLeave={resetVariant}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`px-4 py-3 bg-[#080808] border border-white/5 rounded-xl text-zinc-400 text-xs font-mono uppercase flex items-center gap-2.5 transition-colors duration-250 interactive-hover ${soc.color}`}
                >
                  <soc.icon className="w-4 h-4 shrink-0" />
                  <span>{soc.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-45 group-hover:opacity-100" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Interactive transmission feedback forms */}
        <div className="lg:col-span-6">
          <div className="glass-card border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-3xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span className="font-mono text-[10px] text-zinc-500">COMMSPORTAL_STATUS: READY</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase">SYS_SECURE</span>
            </div>

            <AnimatePresence mode="wait">
              {formState === "completed" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 flex flex-col items-center justify-center text-center font-sans"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-white font-display text-lg font-medium mb-1">
                    Signal Broadcasted Successfully
                  </h4>
                  <p className="text-zinc-400 text-xs max-w-xs leading-relaxed">
                    Routing connection request down socket servers. An optimal thread callback will match soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
                      IDENT_NAME
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alan Turing"
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 placeholder-zinc-700 font-sans transition-all duration-300 pointer-events-auto"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
                      ROUTE_EMAIL
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. user@domain.com"
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 placeholder-zinc-700 font-sans transition-all duration-300 pointer-events-auto"
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label htmlFor="message" className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
                      BODY_MESSAGE
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Brief your requirements or project scope..."
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 placeholder-zinc-700 font-sans transition-all duration-300 resize-none pointer-events-auto"
                    />
                  </div>

                  {/* Submit trigger button */}
                  <button
                    type="submit"
                    disabled={formState === "transmitting"}
                    onMouseEnter={() => setVariant('expanded')}
                    onMouseLeave={resetVariant}
                    className="w-full mt-2 py-3.5 bg-[#080808] hover:bg-orange-500/10 border border-orange-500/30 text-white font-mono text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 pointer-events-auto interactive-hover cursor-pointer"
                  >
                    {formState === "transmitting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Signal...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-orange-400" />
                        <span>Transmit Signal</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Credit / Copyright sub-footer */}
      <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-zinc-600 gap-4 relative z-10">
        <div>
          © {new Date().getFullYear()} Core Developer Matrix. All Rights Reserved.
        </div>
        <div className="flex items-center gap-1">
          <span>PIPELINE SYSTEM: </span>
          <span className="text-zinc-400 font-bold">Optimized React + Tailwind 4</span>
        </div>
      </div>
    </footer>
  );
}
