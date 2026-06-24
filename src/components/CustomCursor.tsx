import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const CustomCursor = () => {
  const { variant, text } = useCursor();
  const [isVisible, setIsVisible] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsCoarse(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if cursor is over text elements
      const target = e.target as HTMLElement;
      if (target && target.tagName) {
        const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'LI', 'LABEL', 'STRONG', 'EM'];
        setIsHoveringText(textTags.includes(target.tagName));
      }
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    document.body.classList.add('custom-cursor-active');
    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseleave', handleLeave, { passive: true });
    document.addEventListener('mouseenter', handleEnter, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isCoarse) return null;

  const getSize = () => {
    switch (variant) {
      case 'expanded': return 56;
      case 'text': return 80;
      default: return isHoveringText ? 40 : 16;
    }
  };

  const size = getSize();

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      style={{ x: smoothX, y: smoothY }}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: isVisible ? 1 : 0,
          backgroundColor: variant === 'text'
            ? 'rgba(249, 115, 22, 0.15)'
            : 'rgba(255, 255, 255, 0.9)',
          border: variant !== 'default'
            ? '1px solid rgba(249, 115, 22, 0.5)'
            : 'none',
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.15 },
        }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      >
        {variant === 'text' && text && (
          <motion.span
            className="text-[10px] font-mono text-orange-400 whitespace-nowrap font-semibold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {text}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
