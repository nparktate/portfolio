'use client'

import { useEffect, useRef, useState } from 'react'

export default function Portfolio() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [canAutoplay, setCanAutoplay] = useState(true)

  // Filter functionality
  useEffect(() => {
    const filterBtns = document.querySelectorAll('.filter-btn')
    const projectCards = document.querySelectorAll('.project-card')
    const yearSections = document.querySelectorAll('.year-section')

    const handleFilter = (e: Event) => {
      const target = e.target as HTMLButtonElement
      const filter = target.dataset.filter

      // Update button states
      filterBtns.forEach(btn => {
        btn.classList.remove('active', 'bg-gray-900', 'text-white')
        btn.classList.add('bg-white', 'text-gray-700')
      })
      target.classList.add('active', 'bg-gray-900', 'text-white')
      target.classList.remove('bg-white', 'text-gray-700')

      // Filter projects
      projectCards.forEach(card => {
        const tags = (card as HTMLElement).dataset.tags || ''
        if (filter === 'all' || tags.includes(filter || '')) {
          (card as HTMLElement).style.display = 'block'
        } else {
          (card as HTMLElement).style.display = 'none'
        }
      })

      // Show/hide year sections based on visible projects
      yearSections.forEach(section => {
        const visibleProjects = section.querySelectorAll('.project-card:not([style*="display: none"])')
        if (visibleProjects.length > 0) {
          (section as HTMLElement).style.display = 'block'
        } else {
          (section as HTMLElement).style.display = 'none'
        }
      })
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', handleFilter)
    })

    return () => {
      filterBtns.forEach(btn => {
        btn.removeEventListener('click', handleFilter)
      })
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Add error handling
    const handleError = (e: Event) => {
      console.error('Video error:', e)
      console.error('Video error details:', video.error)
      setVideoError(true)
      setVideoLoading(false)
    }

    const handleLoadStart = () => {
      console.log('Video load started')
      setVideoLoading(true)
      setVideoError(false)
    }

    const handleCanPlay = () => {
      console.log('Video can play')
      setVideoLoading(false)
    }

    const handleLoadedData = () => {
      console.log('Video loaded data')
      setVideoLoading(false)
    }

    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)

    // Try to play video with user interaction fallback
    const playVideo = async () => {
      try {
        await video.play()
        console.log('Video playing successfully')
        setCanAutoplay(true)
      } catch (error) {
        console.log('Autoplay failed, user interaction required:', error)
        setCanAutoplay(false)
      }
    }



    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playVideo()
        } else {
          video.pause()
        }
      })
    })

    observer.observe(video)

    return () => {
      observer.disconnect()
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])

  // Manual play function for click-to-play
  const handleManualPlay = async () => {
    const video = videoRef.current
    if (!video) return
    
    try {
      await video.play()
      setCanAutoplay(true)
    } catch (error) {
      console.error('Manual play failed:', error)
    }
  }

  return (
    <div className="bg-white">
      {/* Video Reel Section */}
      <section className="relative h-screen bg-black">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          controls
          preload="auto"
          playsInline
          poster=""
        >
          <source src="/reel-2023-nicholas-park.mp4" type="video/mp4" />
          <p className="absolute inset-0 flex items-center justify-center text-white">
            Your browser does not support the video tag. 
            <a href="/reel-2023-nicholas-park.mp4" className="underline ml-2">
              Download the video
            </a>
          </p>
        </video>

        {/* Loading State */}
        {videoLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-mono text-sm">Loading reel...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {videoError && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-center text-white">
              <p className="font-mono text-lg mb-4">Unable to load video</p>
              <a 
                href="/reel-2023-nicholas-park.mp4" 
                className="font-mono text-sm underline hover:text-gray-300"
                target="_blank"
              >
                View video directly
              </a>
            </div>
          </div>
        )}

        {/* Click to Play Overlay */}
        {!canAutoplay && !videoLoading && !videoError && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer z-10 pointer-events-auto"
            onClick={handleManualPlay}
          >
            <div className="text-center text-white">
              <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p className="font-mono text-sm">Click to play</p>
            </div>
          </div>
        )}
        
        {/* Video overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Video info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 text-white pointer-events-none">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-mono text-xs md:text-sm font-bold mb-1 md:mb-2 tracking-tight">NICHOLAS PARK</h1>
            <p className="font-mono text-xs md:text-sm text-gray-300 mb-3 md:mb-6">Motion Designer & Creative Technologist</p>
            <div className="flex flex-wrap items-center gap-3 md:gap-