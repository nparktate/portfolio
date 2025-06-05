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
            <div className="flex flex-wrap items-center gap-3 md:gap-4 lg:gap-8 font-mono text-xs md:text-sm text-gray-400">
              <span>REEL 2023</span>
              <span className="hidden sm:inline">21M+ VIEWS</span>
              <span>HBO • NIKE • UNIVERSAL</span>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Timeline/Resume Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase lg:sticky lg:top-8 mb-8 lg:mb-0">
                Experience
              </h2>
            </div>
            <div className="lg:col-span-9">
              <div className="space-y-16">
                {/* Current Position */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-900 rounded-full transform -translate-x-1"></div>
                  <div className="pl-6 md:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="font-mono text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 uppercase inline-block w-fit">Present</span>
                      <span className="font-mono text-xs md:text-sm text-gray-400">Current</span>
                    </div>
                    <h3 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Motion Designer</h3>
                    <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 mb-4">Warner Bros. Discovery</p>
                    <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                      Create motion graphics and visual content for HBO and Max Original programming. 
                      Develop modular After Effects toolkits to streamline versioning and localization 
                      across marketing assets while maintaining brand consistency.
                    </p>
                    <div className="space-y-2 text-xs md:text-sm font-mono text-gray-700">
                      <div className="marquee">
                        <div className="marquee-content" data-text="• The Last of Us S2 podcast visuals • White Lotus S3 generative effects • DC Studios Showcase GFX suite • 15+ major show campaigns">• The Last of Us S2 podcast visuals • White Lotus S3 generative effects • DC Studios Showcase GFX suite • 15+ major show campaigns</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphics Specialist Role */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-600 rounded-full transform -translate-x-1"></div>
                  <div className="pl-6 md:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="font-mono text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 uppercase inline-block w-fit">Oct 2022</span>
                      <span className="font-mono text-xs md:text-sm text-gray-400">Promoted</span>
                    </div>
                    <h3 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Graphics Specialist</h3>
                    <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 mb-4">Warner Bros. Discovery</p>
                    <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                      Coordinated graphic deliverables for AV promos and trailers for MAX and HBO Original titles. Built modular After Effects toolkits and worked under the Concept + Design Studio team as both designer and finisher.
                    </p>
                    <div className="space-y-2 text-xs md:text-sm font-mono text-gray-700">
                      <div className="marquee">
                        <div className="marquee-content" data-text="• AV promo & trailer graphics • Modular toolkit development • Creative & technical execution • Concept + Design Studio team">• AV promo & trailer graphics • Modular toolkit development • Creative & technical execution • Concept + Design Studio team</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Initial Motion Designer Role */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-600 rounded-full transform -translate-x-1"></div>
                  <div className="pl-6 md:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="font-mono text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 uppercase inline-block w-fit">Oct 2020 - Oct 2022</span>
                      <span className="font-mono text-xs md:text-sm text-gray-400">2 Years</span>
                    </div>
                    <h3 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Motion Designer</h3>
                    <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 mb-4">Warner Bros. Discovery (HBO Max)</p>
                    <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                      Developed graphics and animations for HBO MAX, from official podcast visuals to supplementary motion graphics. Collaborated with cross-functional teams as a design generalist. Contributed to key art designs for 50+ shows and podcasts.
                    </p>
                    <div className="space-y-2 text-xs md:text-sm font-mono text-gray-700">
                      <div className="marquee">
                        <div className="marquee-content" data-text="• Spark AR & TikTok Effect House filters • Top 1% ranked AR filters (2M+ uses) • Succession to DC Comics filters • Storyboarding & static mock-ups">• Spark AR & TikTok Effect House filters • Top 1% ranked AR filters (2M+ uses) • Succession to DC Comics filters • Storyboarding & static mock-ups</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Work */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-600 rounded-full transform -translate-x-1"></div>
                  <div className="pl-6 md:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="font-mono text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 uppercase inline-block w-fit">Feb 2023 - Mar 2023</span>
                      <span className="font-mono text-xs md:text-sm text-gray-400">Contract</span>
                    </div>
                    <h3 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">VFX Director</h3>
                    <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 mb-4">NIKE, Inc.</p>
                    <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                      Coordinated and designed VFX/GFX for five short-form social promotional assets and final sizzle piece for Nike D/N global launch. Worked internationally with coordinators from Bangkok to India on practical effects, green screen work, and 360 video reframing.
                    </p>
                    <div className="space-y-2 text-xs md:text-sm font-mono text-gray-700">
                      <div className="marquee">
                        <div className="marquee-content" data-text="• Advanced rotoscoping & compositing • 360° video reframing techniques • GFX toolkit for design challenge • International talent coordination">• Advanced rotoscoping & compositing • 360° video reframing techniques • GFX toolkit for design challenge • International talent coordination</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Freelance Work */}
                <div className="relative">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1"></div>
                  <div className="pl-6 md:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="font-mono text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 uppercase inline-block w-fit">Mar 2021 - Jan 2022</span>
                      <span className="font-mono text-xs md:text-sm text-gray-400">Freelance</span>
                    </div>
                    <h3 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Motion Graphics Artist</h3>
                    <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 mb-4">Universal Music Group</p>
                    <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                      Produced lyric video animations for six distinct albums, amassing over 21 million views. Utilized motion tracking and 3D compositing techniques in After Effects and Blender to create seamless text aesthetics integrated with 3D space.
                    </p>
                    <div className="space-y-2 text-xs md:text-sm font-mono text-gray-700">
                      <div className="marquee">
                        <div className="marquee-content" data-text="• 6 albums with 21M+ total views • Motion tracking & 3D compositing • 3D space extraction from footage • Seamless text integration">• 6 albums with 21M+ total views • Motion tracking & 3D compositing • 3D space extraction from footage • Seamless text integration</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Experience */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1"></div>
                  <div className="pl-6 md:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="font-mono text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 uppercase inline-block w-fit">Dec 2021 - Mar 2022</span>
                      <span className="font-mono text-xs md:text-sm text-gray-400">Contract</span>
                    </div>
                    <h3 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Web Developer</h3>
                    <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 mb-4">Katkoot Italia</p>
                    <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                      Full stack web development using custom CMS for wine brand. Built automated article-publishing system, adaptive SEO features, and complex UI interactions and animations.
                    </p>
                    <div className="space-y-2 text-xs md:text-sm font-mono text-gray-700">
                      <div className="marquee">
                        <div className="marquee-content" data-text="• Custom CMS development • Automated publishing system • Adaptive SEO implementation • Advanced UI animations">• Custom CMS development • Automated publishing system • Adaptive SEO implementation • Advanced UI animations</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1"></div>
                  <div className="pl-6 md:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="font-mono text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 uppercase inline-block w-fit">Oct 2019 - Dec 2019</span>
                      <span className="font-mono text-xs md:text-sm text-gray-400">Contract</span>
                    </div>
                    <h3 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Designer</h3>
                    <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 mb-4">Creature Conserve</p>
                    <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                      Collaborated with Dr. Lucy Spelman to create mock-up designs for a book focused on Primatologist Dian Fossey. Designs intended for National Geographic review.
                    </p>
                    <div className="space-y-2 text-xs md:text-sm font-mono text-gray-700">
                      <div className="marquee">
                        <div className="marquee-content" data-text="• Book design & layout • National Geographic standards • Scientific illustration • Editorial design">• Book design & layout • National Geographic standards • Scientific illustration • Editorial design</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Skills Section */}
          <div className="space-y-16 pt-16 border-t border-gray-200">
            {/* Education */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-3">
                <h3 className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase mb-6 lg:mb-0">Education</h3>
              </div>
              <div className="lg:col-span-9">
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-900 rounded-full transform -translate-x-1"></div>
                  <div className="pl-6 md:pl-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="font-mono text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 uppercase inline-block w-fit">2017 - 2021</span>
                      <span className="font-mono text-xs md:text-sm text-gray-400">GPA: 3.7/4.0 • Honors</span>
                    </div>
                    <h4 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">B.F.A. in Graphic Design</h4>
                    <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 mb-4">Rhode Island School of Design (RISD)</p>
                    <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed">
                      Graduated with Graphic Design Honors. Coursework emphasized motion design, 
                      interactive media, and visual communication. Active in cross-disciplinary collaborations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-3">
                <h3 className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase mb-6 lg:mb-0">Skills</h3>
              </div>
              <div className="lg:col-span-9">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-white border border-gray-200 p-6 md:p-8">
                    <h4 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-4 md:mb-6 uppercase">Design Expertise</h4>
                    <div className="space-y-2 md:space-y-3 font-mono text-xs md:text-sm text-gray-700">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Typography & Static Design
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Motion Graphics & Animation
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        VFX & Compositing
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        3D Modeling & Rendering
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        AR Filter Development
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Creative Coding & Automation
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Full-Stack Web Development
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-6 md:p-8">
                    <h4 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-4 md:mb-6 uppercase">Software & Tools</h4>
                    <div className="space-y-2 md:space-y-3 font-mono text-xs md:text-sm text-gray-700">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        After Effects, Premiere Pro, DaVinci Resolve
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Blender, Cinema 4D, Maya
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Photoshop, Illustrator, Figma
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Spark AR Studio, Effect House
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        JavaScript, Python, React, Node.js
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Unity, Unreal Engine
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Git, Docker, AWS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase lg:sticky lg:top-8 mb-8 lg:mb-0">Projects</h2>
            </div>
            <div className="lg:col-span-2">
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                <p className="font-mono text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8">
                A curated selection of motion graphics, VFX, and creative technology projects 
                spanning entertainment, music, and brand campaigns.
                </p>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="font-mono text-xs md:text-sm text-gray-500 marquee marquee-fast">
                <div className="marquee-content" data-text="TOTAL PROJECTS: 50+ • COMBINED VIEWS: 21M+ • YEARS ACTIVE: 2020-2024 • TOTAL PROJECTS: 50+ • COMBINED VIEWS: 21M+ • YEARS ACTIVE: 2020-2024 • TOTAL PROJECTS: 50+ • COMBINED VIEWS: 21M+ • YEARS ACTIVE: 2020-2024">TOTAL PROJECTS: 50+ • COMBINED VIEWS: 21M+ • YEARS ACTIVE: 2020-2024 • TOTAL PROJECTS: 50+ • COMBINED VIEWS: 21M+ • YEARS ACTIVE: 2020-2024 • TOTAL PROJECTS: 50+ • COMBINED VIEWS: 21M+ • YEARS ACTIVE: 2020-2024</div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="mt-8 md:mt-12 lg:mt-16 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="filter-btn active font-mono text-xs md:text-sm px-3 py-1 border border-gray-300 bg-gray-900 text-white" data-filter="all">
                All Projects
              </button>
              <button className="filter-btn font-mono text-xs md:text-sm px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100" data-filter="motion-graphics">
                Motion Graphics
              </button>
              <button className="filter-btn font-mono text-xs md:text-sm px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100" data-filter="vfx">
                VFX
              </button>
              <button className="filter-btn font-mono text-xs md:text-sm px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100" data-filter="ar">
                AR/Filters
              </button>
              <button className="filter-btn font-mono text-xs md:text-sm px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100" data-filter="hbo">
                HBO/Warner Bros
              </button>
            </div>
          </div>

          {/* 2024 Projects */}
          <div className="year-section mb-12">
            <h3 className="font-mono text-lg md:text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">2024</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              
              {/* The Penguin */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="motion-graphics,hbo,promotional">
                <div className="aspect-video bg-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">THE PENGUIN</div>
                      <div className="font-mono text-slate-200 text-sm">MOTION GRAPHICS</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">The Penguin</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2024</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Coordinated and designed campaign graphics, including critics&apos; quotes and animated concept art for HBO&apos;s The Penguin series.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Graphics</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Promotional</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">HBO</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> HBO <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2024
                  </div>
                </div>
              </div>

              {/* DC Studios Showcase */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="motion-graphics,hbo,promotional">
                <div className="aspect-video bg-red-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">DC STUDIOS SHOWCASE</div>
                      <div className="font-mono text-red-200 text-sm">PODCAST GRAPHICS</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">DC Studios Showcase</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2024</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Designed the graphics package for DC Studios Showcase podcast, including a 3D-animated intro and a comprehensive After Effects toolkit.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Graphics</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Promotional</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">3D Animation</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> HBO <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2024
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2023 Projects */}
          <div className="year-section mb-12">
            <h3 className="font-mono text-lg md:text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">2023</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              
              {/* White House Plumbers */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="motion-graphics,hbo,podcast">
                <div className="aspect-video bg-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">WHITE HOUSE PLUMBERS</div>
                      <div className="font-mono text-gray-400 text-sm">PODCAST VISUALS</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">White House Plumbers Podcast</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2023</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Motion graphics and visual content for HBO&apos;s official companion podcast.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Design</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Podcast</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">HBO</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> Warner Bros. Discovery <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2023
                  </div>
                </div>
              </div>

              {/* Nike DN Sportswear */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="vfx,sportswear">
                <div className="aspect-video bg-orange-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">NIKE DN</div>
                      <div className="font-mono text-orange-200 text-sm">SPORTSWEAR VFX</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">Nike DN Sportswear</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2023</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Supernatural VFX for Nike DN Sportswear campaign, enhancing scenes of athletes performing extraordinary feats.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">VFX</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Direction</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Sportswear</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> Nike Sportswear <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2023
                  </div>
                </div>
              </div>

              {/* Slice Hunter */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="ar,freelance">
                <div className="aspect-video bg-amber-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">SLICE HUNTER</div>
                      <div className="font-mono text-amber-200 text-sm">AR FILTER</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">Slice Hunter</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2023</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Designed a TikTok AR filter mini-game for Mike&apos;s Hot Honey, featuring a bottle shooting honey at various food items to promote the brand.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">AR</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Filter</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Freelance</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> Mike&apos;s Hot Honey <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2023
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2022 Projects */}
          <div className="year-section mb-12">
            <h3 className="font-mono text-lg md:text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">2022</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">

              {/* Winning Time */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="motion-graphics,hbo,promotional">
                <div className="aspect-video bg-yellow-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-yellow-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">WINNING TIME</div>
                      <div className="font-mono text-yellow-200 text-sm">SET TOUR VISUALS</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">Quincy Isaiah & John C. Reilly Winning Time Set Tour</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2022</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Behind-the-scenes content and promotional materials for HBO&apos;s Winning Time.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Graphics</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Promotional</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">HBO</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> HBO Max <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2022
                  </div>
                </div>
              </div>

              {/* Westworld */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="motion-graphics,hbo,promotional">
                <div className="aspect-video bg-purple-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">WESTWORLD</div>
                      <div className="font-mono text-purple-200 text-sm">MARKETING CAMPAIGN</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">Westworld Marketing Campaign</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2022</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Comprehensive marketing assets for HBO&apos;s Westworld series.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Campaign Design</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Graphics</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">HBO</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> HBO Max <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2022
                  </div>
                </div>
              </div>

              {/* Euphoria */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="motion-graphics,hbo,promotional">
                <div className="aspect-video bg-pink-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-pink-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">EUPHORIA</div>
                      <div className="font-mono text-pink-200 text-sm">MARKETING CAMPAIGN</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">Euphoria Marketing Campaign</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2022</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Visual identity and motion assets for Euphoria&apos;s marketing campaign.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Visual Identity</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Design</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">HBO</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> HBO Max <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2022
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2021 & Earlier Projects */}
          <div className="year-section mb-12">
            <h3 className="font-mono text-lg md:text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">2021 & Earlier</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">

              {/* Jeremy Zucker - Brent II */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="motion-graphics,music">
                <div className="aspect-video bg-blue-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">BRENT II</div>
                      <div className="font-mono text-blue-200 text-sm">JEREMY ZUCKER</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">Brent II by Jeremy Zucker</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2021</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Lyric video featuring dynamic typography and seamless motion graphics.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Music Video</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Typography</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Graphics</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> Universal Music Group <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2021
                  </div>
                </div>
              </div>

              {/* Jeremy Zucker - Love Is Not Dying */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="motion-graphics,music">
                <div className="aspect-video bg-green-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">LOVE IS NOT DYING</div>
                      <div className="font-mono text-green-200 text-sm">JEREMY ZUCKER</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">Love Is Not Dying by Jeremy Zucker</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2020</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    Album lyric videos with cohesive visual identity and motion design.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Album Campaign</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Visual Identity</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Design</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Client:</span> Universal Music Group <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2020
                  </div>
                </div>
              </div>

              {/* Augmented Reality Calendar */}
              <div className="project-card bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300" data-tags="ar,academic">
                <div className="aspect-video bg-lime-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-lime-600 to-lime-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-white text-xl mb-2">AUGMENTED REALITY</div>
                      <div className="font-mono text-lime-200 text-sm">CALENDAR</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <h3 className="font-mono text-base md:text-lg lg:text-xl font-bold text-gray-900">Augmented Reality Calendar</h3>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2020</span>
                  </div>
                  <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                    AR application that brings calendar events to life.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">AR Development</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Interactive Design</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Unity</span>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-500">
                    <span className="font-medium">Type:</span> Academic Project <span className="hidden sm:inline">•</span> <span className="sm:hidden block"></span><span className="font-medium">Year:</span> 2020
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="py-12 md:py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-6">
              <h3 className="font-mono text-xl md:text-2xl font-bold mb-4 md:mb-6 uppercase">Get In Touch</h3>
              <p className="font-mono text-sm md:text-base text-gray-300 leading-relaxed mb-6">
                Available for select freelance projects and collaborations in motion design and creative technology.
              </p>
              <div className="space-y-3 font-mono text-xs md:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-400 sm:w-16">EMAIL:</span>
                  <a href="mailto:nparktate@gmail.com" className="text-white hover:text-gray-300 transition-colors break-all">
                    nparktate@gmail.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-400 sm:w-16">PHONE:</span>
                  <a href="tel:4012413241" className="text-white hover:text-gray-300 transition-colors">
                    (401) 241-3241
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <span className="text-gray-400 sm:w-16">LINKED:</span>
                  <a href="https://www.linkedin.com/in/linkparkdesign/" target="_blank" className="text-white hover:text-gray-300 transition-colors break-all">
                    linkedin.com/in/linkparkdesign
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 font-mono text-xs md:text-sm">
                <div>
                  <div className="text-gray-400 uppercase mb-2 md:mb-3">Status</div>
                  <div className="text-white">Available</div>
                </div>
                <div>
                  <div className="text-gray-400 uppercase mb-2 md:mb-3">Location</div>
                  <div className="text-white">Los Angeles, CA</div>
                </div>
                <div>
                  <div className="text-gray-400 uppercase mb-2 md:mb-3">Response</div>
                  <div className="text-white">24-48 Hours</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 font-mono text-xs text-gray-500 text-center md:text-left">
              <div>© 2024 Nicholas Park. Motion Designer & Creative Technologist.</div>
              <div>Portfolio v10.0 • Built with Next.js</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}