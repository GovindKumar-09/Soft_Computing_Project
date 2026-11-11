
import { motion, useReducedMotion } from 'motion/react'

function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  amount = 0.15
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 40, rotateX: 2 }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0
      }}
      viewport={{
        once: true,
        amount
      }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
