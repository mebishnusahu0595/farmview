import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars', // 'chars', 'words', or 'lines'
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left'
}) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const splitText = () => {
    if (splitType === 'chars') {
      return text.split('').map((char, index) => ({
        char: char === ' ' ? '\u00A0' : char,
        index
      }));
    } else if (splitType === 'words') {
      return text.split(' ').map((word, index) => ({
        char: word,
        index
      }));
    } else {
      return text.split('\n').map((line, index) => ({
        char: line,
        index
      }));
    }
  };

  const items = splitText();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000,
      }
    }
  };

  const itemVariants = {
    hidden: from,
    visible: {
      ...to,
      transition: {
        duration,
        ease: ease === 'power3.out' ? [0.215, 0.61, 0.355, 1] : ease
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ textAlign }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={{ display: 'inline-block' }}
        >
          {item.char}
          {splitType === 'words' && index < items.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.div>
  );
}
