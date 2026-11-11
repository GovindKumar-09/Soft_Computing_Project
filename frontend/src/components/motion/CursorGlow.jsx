
import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

function CursorGlow() {
  const mouseX = useMotionValue(-300)
  const mouseY = useMotionValue(-300)

  const x = useSpring(mouseX, {
    stiffness: 65,
    damping: 25,
    mass: 0.8
  })

  const y = useSpring(mouseY, {
    stiffness: 65,
    damping: 25,
    mass: 0.8
  })

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!finePointer.matches || reducedMotion.matches) return

    const handlePointerMove = event => {
      mouseX.set(event.clientX - 128)
      mouseY.set(event.clientY - 128)
    }

    window.addEventListener('pointermove', handlePointerMove, {
      passive: true
    })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      aria-hidden="true"
      className="ambient-cursor-glow fixed left-0 top-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none z-0"
      style={{ x, y }}
    />
  )
}

export default CursorGlow
