'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number | null>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'video' | 'text'>('default')
  
  // Debounced cursor variant update
  const updateTimer = useRef<NodeJS.Timeout | null>(null)
  const updateCursorVariant = useCallback((e: MouseEvent) => {
    if (updateTimer.current) clearTimeout(updateTimer.current)
    
    updateTimer.current = setTimeout(() => {
      const target = e.target as HTMLElement
      if (!target) return
      
      const tagName = target.tagName.toLowerCase()
      
      // Check for video elements
      if (tagName === 'video') {
        setCursorVariant('video')
        return
      }
      
      // Check for interactive elements
      if (
        tagName === 'a' || 
        tagName === 'button' || 
        target.closest('a') || 
        target.closest('button') ||
        target.style.cursor === 'pointer'
      ) {
        setCursorVariant('hover')
        return
      }
      
      // Check for text elements
      if (
        ['p', 'h1', 'h2', 'h3', 'span', 'li'].includes(tagName) && 
        target.innerText && 
        target.innerText.trim().length > 0
      ) {
        setCursorVariant('text')
        return
      }
      
      setCursorVariant('default')
    }, 10)
  }, [])

  // Smooth cursor movement
  const moveCursor = useCallback(() => {
    if (cursorRef.current && cursorDotRef.current) {
      const x = mousePosition.current.x
      const y = mousePosition.current.y
      
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      cursorDotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    
    requestRef.current = null
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
      
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(moveCursor)
      }
      
      updateCursorVariant(e)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Use passive listeners for better performance
    const options = { passive: true }
    document.addEventListener('mousemove', handleMouseMove, options)
    document.addEventListener('mouseenter', handleMouseEnter, options)
    document.addEventListener('mouseleave', handleMouseLeave, options)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      if (updateTimer.current) {
        clearTimeout(updateTimer.current)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [moveCursor, updateCursorVariant])

  // Don't render on touch devices or when invisible
  if (!isVisible || typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null
  }

  const cursorClasses = `
    fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference
    ${cursorVariant === 'default' ? 'w-3 h-3 -ml-1.5 -mt-1.5' : ''}
    ${cursorVariant === 'hover' ? 'w-8 h-8 -ml-4 -mt-4' : ''}
    ${cursorVariant === 'video' ? 'w-12 h-12 -ml-6 -mt-6' : ''}
    ${cursorVariant === 'text' ? 'w-0.5 h-6 -ml-0.5 -mt-3' : ''}
  `

  const dotClasses = `
    fixed top-0 left-0 pointer-events-none z-[9999]
    ${cursorVariant === 'default' ? 'w-1 h-1 -ml-0.5 -mt-0.5' : ''}
    ${cursorVariant === 'hover' ? 'w-2 h-2 -ml-1 -mt-1' : ''}
    ${cursorVariant === 'video' ? 'w-1 h-1 -ml-0.5 -mt-0.5 opacity-0' : ''}
    ${cursorVariant === 'text' ? 'w-0 h-0' : ''}
  `

  return (
    <>
      <div 
        ref={cursorRef}
        className={cursorClasses}
        style={{
          transition: 'width 0.2s ease-out, height 0.2s ease-out, margin 0.2s ease-out',
          backgroundColor: cursorVariant === 'video' ? 'transparent' : 'white',
          borderRadius: cursorVariant === 'text' ? '0' : '50%',
          border: cursorVariant === 'video' ? '2px solid #ef4444' : 'none',
          willChange: 'transform',
        }}
      />
      <div 
        ref={cursorDotRef}
        className={dotClasses}
        style={{
          transition: 'all 0.1s ease-out',
          backgroundColor: 'white',
          borderRadius: '50%',
          willChange: 'transform',
        }}
      />
    </>
  )
}