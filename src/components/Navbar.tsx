import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useCursor } from "../context/CursorContext";

export default function Navbar() {
  const { setVariant, resetVariant } = useCursor();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Tech Stack", href: "#stack" },
    { name: "Projects", href: "#projects" },
    { name: "Timeline", href: "#timeline" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Simple active link calculation based on position
      const sections = navLinks.map(link => link.href.substring(1));
      let currentSection = "hero";

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.substring(1);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: "smooth"
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled ? "glass-nav py-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)]" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo/Branding */}
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, "#hero")}
          onMouseEnter={() => setVariant('expanded')}
          onMouseLeave={resetVariant}
          className="font-display font-medium tracking-wide text-lg text-white flex items-center gap-2 group interactive-hover"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 group-hover:bg-orange-500 transition-colors duration-300 animate-pulse" />
          <span className="font-mono text-zinc-400 group-hover:text-white transition-colors duration-300">
            PORTFOLIO
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    onMouseEnter={() => setVariant('expanded')}
                    onMouseLeave={resetVariant}
                    className={`font-display text-sm tracking-wide transition-colors duration-300 relative py-2 ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-400"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Socials Link */}
          <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/hannuverma" 
                  target="_blank" 
                  rel="noreferrer"
                  onMouseEnter={() => setVariant('expanded')}
                  onMouseLeave={resetVariant}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl interactive-hover group"
                >
                  <FaGithub className="w-5 h-5 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/hannu-verma-b6930b2b7/" 
                  target="_blank" 
                  rel="noreferrer"
                  onMouseEnter={() => setVariant('expanded')}
                  onMouseLeave={resetVariant}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl interactive-hover group"
                >
                  <FaLinkedin className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
            </a>
          </div>
        </div>

        {/* Mobile Hamburguer Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          onMouseEnter={() => setVariant('expanded')}
          onMouseLeave={resetVariant}
          className="md:hidden text-zinc-300 hover:text-white p-1.5 rounded-md focus:outline-none interactive-hover"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sliding Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-nav border-t border-white/5 absolute top-full left-0 w-full overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-5 bg-[#030303]/98">
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`font-display text-base block py-1 tracking-wide ${
                          isActive ? "text-orange-400 font-medium" : "text-zinc-400"
                        }`}
                      >
                        {link.name}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="h-[1px] bg-zinc-800" />

              <div className="flex items-center gap-5 pt-1">
                <a
                  href="https://github.com/hannuverma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm"
                >
                  <FaGithub className="w-5 h-5" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/hannu-verma-b6930b2b7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm"
                >
                  <FaLinkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
