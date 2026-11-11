
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function AnimatedCounter({ value, suffix = '' }) {
  const containerRef = useRef(null)
  const numberRef = useRef(null)

  useGSAP(() => {
    if (!numberRef.current) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reducedMotion) {
      numberRef.current.textContent = String(value)
      return
    }

    const counter = { value: 0 }

    gsap.to(counter, {
      value,
      duration: 1.5,
      ease: 'power2.out',
      snap: { value: 1 },

      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true
      },

      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = Math.round(counter.value)
        }
      }
    })
  }, { scope: containerRef })

  return (
    <span ref={containerRef}>
      <span ref={numberRef}>0</span>
      {suffix}
    </span>
  )
}

export default AnimatedCounter
