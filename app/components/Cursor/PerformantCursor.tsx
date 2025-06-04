'use client'

import { useEffect, useRef } from 'react'

export default function PerformantCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number>()
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)
  const isActive = useRef(false)

  useEffect(() => {
    // Check for touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return
    }

    const cursor = cursorRef.current
    if (!cursor) return

    // Set initial state
    cursor.style.setProperty('--x', '-100px')
    cursor.style.setProperty('--y', '-100px')
    cursor.style.opacity = '0'

    let lastCallTime = 0
    const fps = 120
    const fpsInterval = 1000 / fps

    // Smooth animation loop
    const animate = () => {
      if (!isActive.current) return

      const now = Date.now()
      const elapsed = now - lastCallTime

      if (elapsed > fpsInterval) {
        lastCallTime = now - (elapsed % fpsInterval)

        // Lerp for smooth following
        const lerp = 0.2
        currentX.current += (mouseX.current - currentX.current) * lerp
        currentY.current += (mouseY.current - currentY.current) * lerp

        // Update CSS variables
        cursor.style.setProperty('--x', `${currentX.current}px`)
        cursor.style.setProperty('--y', `${currentY.current}px`)
      }

      rafId.current = requestAnimationFrame(animate)
    }

    // Mouse move handler - minimal work here
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY

      if (!isActive.current) {
        isActive.current = true
        currentX.current = e.clientX
        currentY.current = e.clientY
        cursor.style.opacity = '1'
        animate()
      }

      // Simple hover detection
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button')
      
      cursor.setAttribute('data-hover', isInteractive ? 'true' : 'false')
    }

    // Mouse leave handler
    const handleMouseLeave = () => {
      isActive.current = false
      cursor.style.opacity = '0'
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }

    // Add listeners with passive flag
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        .performant-cursor {
          --x: -100px;
          --y: -100px;
          position: fixed;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
          backface-visibility: hidden;
          transform: translate3d(var(--x), var(--y), 0) translate(-50%, -50%);
          transition: opacity 0.3s ease, width 0.2s ease, height 0.2s ease;
        }

        .performant-cursor::before {
          content: '';
          position: absolute;
          inset: 0;
          background: white;
          border-radius: 50%;
          mix-blend-mode: difference;
        }

        .performant-cursor[data-hover="true"] {
          width: 40px;
          height: 40px;
        }

        .performant-cursor[data-hover="true"]::before {
          inset: 4px;
        }

        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce), (hover: none) {
          .performant-cursor {
            display: none !important;
          }
        }

        /* Hide on low-end devices */
        @media (max-width: 768px) {
          .performant-cursor {
            display: none !important;
          }
        }
      `}</style>
      <div ref={cursorRef} className="performant-cursor" data-hover="false" />
    </>
  )
}