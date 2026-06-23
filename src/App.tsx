import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import CustomCursor from "./components/CustomCursor";
import { CursorProvider } from "./context/CursorContext";

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
          <Skills />
          <Projects />
          <Timeline />
          <Contact />
        </main>
      </div>
    </CursorProvider>
  );
}
