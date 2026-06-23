import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeading = ({ title, subtitle, align = 'left' }: SectionHeadingProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={`mb-16 ${align === 'center' ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-orange-500">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <motion.div
        className="mt-4 h-[2px] rounded-full bg-orange-500"
        initial={{ width: 0, opacity: 0 }}
        animate={isInView ? { width: align === 'center' ? 120 : 80, opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        style={align === 'center' ? { margin: '0 auto' } : {}}
      />
    </motion.div>
  );
};

export default SectionHeading;
