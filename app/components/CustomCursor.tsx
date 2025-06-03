'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'video' | 'text'>('default')

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const hasClickHandler = target.onclick !== null
      const isClickable = ['a', 'button'].includes(tagName) || hasClickHandler
      const isVideo = tagName === 'video'
      const isText = ['p', 'h1', 'h2', 'h3', 'span', 'div'].includes(tagName) && target.textContent?.trim()

      if (isVideo) {
        setCursorState('video')
      } else if (isClickable) {
        setCursorState('hover')
      } else if (isText) {
        setCursorState('text')
      } else {
        setCursorState('default')
      }
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    document.addEventListener('mousemove', updateCursor)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', updateCursor)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const getCursorStyles = () => {
    const baseStyles = 'fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-150 ease-out'
    
    switch (cursorState) {
      case 'hover':
        return `${baseStyles} w-8 h-8 -translate-x-4 -translate-y-4`
      case 'video':
        return `${baseStyles} w-12 h-12 -translate-x-6 -translate-y-6`
      case 'text':
        return `${baseStyles} w-1 h-6 -translate-x-0.5 -translate-y-3`
      default:
        return `${baseStyles} w-4 h-4 -translate-x-2 -translate-y-2`
    }
  }

  const getCursorElement = () => {
    switch (cursorState) {
      case 'hover':
        return (
          <div className="w-full h-full rounded-full border-2 border-white bg-white/20 backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )
      case 'video':
        return (
          <div className="w-full h-full rounded-full border-2 border-red-500 bg-red-500/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-4 h-4 text-red-500 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )
      case 'text':
        return <div className="w-full h-full bg-gray-900 animate-pulse" />
      default:
        return <div className="w-full h-full rounded-full bg-gray-900" />
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={getCursorStyles()}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {getCursorElement()}
    </div>
  )
}