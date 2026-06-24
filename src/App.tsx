import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CustomCursor from "./components/CustomCursor";
import { CursorProvider } from "./context/CursorContext";

// Lazy load below-the-fold components to improve Lighthouse score / LCP
const Skills = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const Timeline = lazy(() => import("./components/Timeline"));
const Contact = lazy(() => import("./components/Contact"));

// Minimal loading pulse for suspended chunks
const ChunkLoader = () => (
  <div className="w-full h-[50vh] flex items-center justify-center bg-[#020202]">
    <div className="w-12 h-12 rounded-full border border-orange-500/20 border-t-orange-500 animate-spin" />
  </div>
);

export default function App() {
  return (
    <CursorProvider>
      <div id="root-container" className="selection:bg-orange-500/30 selection:text-orange-400 bg-[#020202] text-zinc-100 min-h-screen relative overflow-x-clip">
        {/* Custom cursor with inverted color text effect */}
        <CustomCursor />

        {/* Floating navigation bar */}
        <Navbar />

        {/* Main presentation blocks */}
        <main id="primary-content-track">
          <Hero />
          <Suspense fallback={<ChunkLoader />}>
            <Skills />
            <Projects />
            <Timeline />
            <Contact />
          </Suspense>
        </main>
      </div>
    </CursorProvider>
  );
}
