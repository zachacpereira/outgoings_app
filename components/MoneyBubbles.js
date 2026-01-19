import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MoneyBubbles({ active, onComplete }) {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    if (active) {
      // Generate bubbles
      const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100 - 50, // random x offset
        delay: Math.random() * 0.5,
        scale: 0.5 + Math.random() * 1,
      }));
      setBubbles(newBubbles);

      // Reset after animation
      const timer = setTimeout(() => {
        setBubbles([]);
        if (onComplete) onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {active && bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0, y: 100, x: bubble.x * 5, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: -500, 
              x: bubble.x * 10,
              scale: bubble.scale
            }}
            transition={{ 
              duration: 1.5, 
              delay: bubble.delay,
              ease: "easeOut"
            }}
            className="absolute text-green-500 font-bold text-4xl select-none"
            style={{ left: '50%', top: '60%' }}
          >
            £££
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
