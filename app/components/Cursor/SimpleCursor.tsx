'use client'

import { useEffect, useRef } from 'react'
import styles from './cursor.module.css'

export default function SimpleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: -100, y: -100 })
  const currentState = useRef('default')
  const rafId = useRef<number>()
  const isVisible = useRef(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    if (!cursor || !dot) return

    // Hide cursor initially
    cursor.style.opacity = '0'
    dot.style.opacity = '0'

    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window
    if (isTouchDevice) return

    let lastMoveTime = 0
    const throttleMs = 16 // ~60fps

    // Update cursor position with RAF
    const updatePosition = () => {
      if (!isVisible.current) return
      
      const { x, y } = mousePos.current
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    }

    // Handle mouse move
    const onMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      
      // Update position
      mousePos.current = { x: e.clientX, y: e.clientY }
      
      // Throttle position updates
      if (now - lastMoveTime >= throttleMs) {
        lastMoveTime = now
        if (rafId.current) cancelAnimationFrame(rafId.current)
        rafId.current = requestAnimationFrame(updatePosition)
      }

      // Show cursor if hidden
      if (!isVisible.current) {
        isVisible.current = true
        cursor.style.opacity = '1'
        dot.style.opacity = '1'
      }

      // Update cursor state based on target
      const target = e.target as HTMLElement
      if (!target) return

      const newState = getCursorState(target)
      if (newState !== currentState.current) {
        cursor.className = `${styles.cursor} ${styles[newState]}`
        currentState.current = newState
      }
    }

    // Determine cursor state from element
    const getCursorState = (el: HTMLElement): string => {
      const tag = el.tagName.toLowerCase()
      
      // Video elements
      if (tag === 'video' || el.closest('video')) {
        return 'video'
      }
      
      // Interactive elements
      if (
        tag === 'a' || 
        tag === 'button' || 
        el.closest('a') || 
        el.closest('button') ||
        el.onclick !== null ||
        window.getComputedStyle(el).cursor === 'pointer'
      ) {
        return 'hover'
      }
      
      // Text elements
      if (
        (tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'span' || tag === 'li') &&
        el.innerText?.trim()
      ) {
        return 'text'
      }
      
      return 'default'
    }

    // Handle mouse leave
    const onMouseLeave = () => {
      isVisible.current = false
      cursor.style.opacity = '0'
      dot.style.opacity = '0'
    }

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className={`${styles.cursor} ${styles.default}`} />
      <div ref={cursorDotRef} className={styles.cursorDot} />
    </>
  )
}