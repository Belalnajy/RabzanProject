import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Smooth easing curves
const easings = {
  smooth: [0.16, 1, 0.3, 1],
  bounce: [0.175, 0.885, 0.32, 1.275],
  elastic: [0.68, -0.55, 0.265, 1.55],
  premium: [0.22, 1, 0.36, 1],
};

export const FadeIn = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 30,
  duration = 0.8,
  className = '',
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: easings.premium,
      }}>
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.6,
  scale = 0.9,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: scale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: easings.bounce,
      }}>
      {children}
    </motion.div>
  );
};

export const SlideIn = ({
  children,
  delay = 0,
  direction = 'left',
  distance = 100,
  className = '',
}) => {
  const directions = {
    left: { x: -distance },
    right: { x: distance },
    up: { y: distance },
    down: { y: -distance },
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 1,
        delay: delay,
        ease: easings.premium,
      }}>
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({
  children,
  delayChildren = 0.1,
  staggerBy = 0.12,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delayChildren,
            staggerChildren: staggerBy,
          },
        },
      }}>
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  direction = 'up',
  distance = 30,
  scale = true,
  className = '',
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          ...directions[direction],
          scale: scale ? 0.95 : 1,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: easings.premium,
          },
        },
      }}>
      {children}
    </motion.div>
  );
};

// Parallax effect component
export const ParallaxSection = ({ children, speed = 0.5, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false }}
      style={{ willChange: 'transform' }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 100,
      }}>
      {children}
    </motion.div>
  );
};

// Hover scale effect
export const HoverScale = ({ children, scale = 1.03, className = '' }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: scale }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}>
      {children}
    </motion.div>
  );
};

// Floating animation
export const FloatIn = ({
  children,
  delay = 0,
  duration = 3,
  distance = 15,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay: delay,
      }}>
      {children}
    </motion.div>
  );
};

// Rotate animation
export const RotateIn = ({
  children,
  delay = 0,
  duration = 0.8,
  degrees = 10,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotate: -degrees }}
      whileInView={{ opacity: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: easings.bounce,
      }}>
      {children}
    </motion.div>
  );
};

// Blur fade effect
export const BlurFade = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: easings.premium,
      }}>
      {children}
    </motion.div>
  );
};

// Text reveal animation (character by character)
export const TextReveal = ({
  text,
  delay = 0,
  className = '',
  staggerDelay = 0.03,
}) => {
  const letters = text.split('');

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
        hidden: {},
      }}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          style={{ display: 'inline-block' }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { ease: easings.premium, duration: 0.4 },
            },
          }}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Counter animation
export const CountUp = ({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay: delay }}>
      {prefix}
      <motion.span
        initial={{ value: from }}
        animate={isInView ? { value: to } : { value: from }}
        transition={{
          duration: duration,
          delay: delay,
          ease: easings.smooth,
        }}
        onUpdate={({ value }) => {
          if (ref.current) {
            ref.current.textContent = prefix + Math.round(value) + suffix;
          }
        }}>
        {from}
      </motion.span>
      {suffix}
    </motion.span>
  );
};

// Magnetic hover effect
export const MagneticHover = ({ children, strength = 0.3, className = '' }) => {
  const ref = useRef(null);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * strength;
    const y = (clientY - top - height / 2) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    ref.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
      {children}
    </motion.div>
  );
};

// Page transition wrapper
export const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: easings.premium,
      }}>
      {children}
    </motion.div>
  );
};
