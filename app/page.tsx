'use client'

import { useEffect, useRef, useState } from 'react'

export default function Portfolio() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [canAutoplay, setCanAutoplay] = useState(true)

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
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white pointer-events-none">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-mono text-sm font-bold mb-2 tracking-tight">NICHOLAS PARK</h1>
            <p className="font-mono text-sm text-gray-300 mb-6">Motion Designer & Creative Technologist</p>
            <div className="flex items-center space-x-8 font-mono text-sm text-gray-400">
              <span>REEL 2023</span>
              <span>21M+ VIEWS</span>
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
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-3">
              <h2 className="font-mono text-4xl font-bold text-gray-900 uppercase sticky top-8">
                Experience
              </h2>
            </div>
            <div className="col-span-9">
              <div className="space-y-16">
                {/* Current Position */}
                {/* Current Role */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-900 rounded-full transform -translate-x-1"></div>
                  <div className="pl-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 uppercase">Present</span>
                      <span className="font-mono text-sm text-gray-400">Current</span>
                    </div>
                    <h3 className="font-mono text-2xl font-bold text-gray-900 mb-2">Motion Designer</h3>
                    <p className="font-mono text-lg text-gray-700 mb-4">Warner Bros. Discovery</p>
                    <p className="font-mono text-base text-gray-600 leading-relaxed mb-6">
                      Create motion graphics and visual content for HBO and Max Original programming. 
                      Develop modular After Effects toolkits to streamline versioning and localization 
                      across marketing assets while maintaining brand consistency.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-700">
                      <div>• The Last of Us S2 podcast visuals</div>
                      <div>• White Lotus S3 generative effects</div>
                      <div>• DC Studios Showcase GFX suite</div>
                      <div>• 15+ major show campaigns</div>
                    </div>
                  </div>
                </div>

                {/* Graphics Specialist Role */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-600 rounded-full transform -translate-x-1"></div>
                  <div className="pl-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 uppercase">Oct 2022</span>
                      <span className="font-mono text-sm text-gray-400">Promoted</span>
                    </div>
                    <h3 className="font-mono text-2xl font-bold text-gray-900 mb-2">Graphics Specialist</h3>
                    <p className="font-mono text-lg text-gray-700 mb-4">Warner Bros. Discovery</p>
                    <p className="font-mono text-base text-gray-600 leading-relaxed mb-6">
                      Coordinated graphic deliverables for AV promos and trailers for MAX and HBO Original titles. Built modular After Effects toolkits and worked under the Concept + Design Studio team as both designer and finisher.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-700">
                      <div>• AV promo & trailer graphics</div>
                      <div>• Modular toolkit development</div>
                      <div>• Creative & technical execution</div>
                      <div>• Concept + Design Studio team</div>
                    </div>
                  </div>
                </div>

                {/* Initial Motion Designer Role */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-600 rounded-full transform -translate-x-1"></div>
                  <div className="pl-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 uppercase">Oct 2020 - Oct 2022</span>
                      <span className="font-mono text-sm text-gray-400">2 Years</span>
                    </div>
                    <h3 className="font-mono text-2xl font-bold text-gray-900 mb-2">Motion Designer</h3>
                    <p className="font-mono text-lg text-gray-700 mb-4">Warner Bros. Discovery (HBO Max)</p>
                    <p className="font-mono text-base text-gray-600 leading-relaxed mb-6">
                      Developed graphics and animations for HBO MAX, from official podcast visuals to supplementary motion graphics. Collaborated with cross-functional teams as a design generalist. Contributed to key art designs for 50+ shows and podcasts.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-700">
                      <div>• Spark AR & TikTok Effect House filters</div>
                      <div>• Top 1% ranked AR filters (2M+ uses)</div>
                      <div>• Succession to DC Comics filters</div>
                      <div>• Storyboarding & static mock-ups</div>
                    </div>
                  </div>
                </div>

                {/* Contract Work */}
                <div className="relative">
                  <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-600 rounded-full transform -translate-x-1"></div>
                  <div className="pl-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 uppercase">Feb 2023 - Mar 2023</span>
                      <span className="font-mono text-sm text-gray-400">Contract</span>
                    </div>
                    <h3 className="font-mono text-2xl font-bold text-gray-900 mb-2">VFX Director</h3>
                    <p className="font-mono text-lg text-gray-700 mb-4">NIKE, Inc.</p>
                    <p className="font-mono text-base text-gray-600 leading-relaxed mb-6">
                      Coordinated and designed VFX/GFX for five short-form social promotional assets and final sizzle piece for Nike D/N global launch. Worked internationally with coordinators from Bangkok to India on practical effects, green screen work, and 360 video reframing.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-700">
                      <div>• Advanced rotoscoping & compositing</div>
                      <div>• 360° video reframing techniques</div>
                      <div>• GFX toolkit for design challenge</div>
                      <div>• International talent coordination</div>
                    </div>
                  </div>
                </div>

                {/* Freelance Work */}
                <div className="relative">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1"></div>
                  <div className="pl-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 uppercase">Mar 2021 - Jan 2022</span>
                      <span className="font-mono text-sm text-gray-400">Freelance</span>
                    </div>
                    <h3 className="font-mono text-2xl font-bold text-gray-900 mb-2">Motion Graphics Artist</h3>
                    <p className="font-mono text-lg text-gray-700 mb-4">Universal Music Group</p>
                    <p className="font-mono text-base text-gray-600 leading-relaxed mb-6">
                      Produced lyric video animations for six distinct albums, amassing over 21 million views. Utilized motion tracking and 3D compositing techniques in After Effects and Blender to create seamless text aesthetics integrated with 3D space.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-700">
                      <div>• 6 albums, 21M+ total views</div>
                      <div>• After Effects & Blender workflow</div>
                      <div>• 3D space extraction from footage</div>
                      <div>• Seamless text integration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Experience */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-px h-full bg-gray-200"></div>
              <div className="absolute left-0 top-2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1"></div>
              <div className="pl-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 uppercase">Dec 2021 - Mar 2022</span>
                  <span className="font-mono text-sm text-gray-400">Contract</span>
                </div>
                <h3 className="font-mono text-2xl font-bold text-gray-900 mb-2">Web Developer</h3>
                <p className="font-mono text-lg text-gray-700 mb-4">Katkoot Italia</p>
                <p className="font-mono text-base text-gray-600 leading-relaxed mb-6">
                  Full stack web development using custom CMS for wine brand. Built automated article-publishing system, adaptive SEO features, and complex UI interactions and animations.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-700">
                  <div>• Custom CMS development</div>
                  <div>• Automated publishing system</div>
                  <div>• Adaptive SEO implementation</div>
                  <div>• Advanced UI animations</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1"></div>
              <div className="pl-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 uppercase">Oct 2019 - Dec 2019</span>
                  <span className="font-mono text-sm text-gray-400">Contract</span>
                </div>
                <h3 className="font-mono text-2xl font-bold text-gray-900 mb-2">Designer</h3>
                <p className="font-mono text-lg text-gray-700 mb-4">Creature Conserve</p>
                <p className="font-mono text-base text-gray-600 leading-relaxed mb-6">
                  Collaborated with Dr. Lucy Spelman to create mock-up designs for a book focused on Primatologist Dian Fossey. Designs intended for National Geographic review.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-700">
                  <div>• Book design & layout</div>
                  <div>• National Geographic standards</div>
                  <div>• Scientific illustration</div>
                  <div>• Editorial design</div>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="grid grid-cols-12 gap-8 pt-16 border-t border-gray-200">
            <div className="col-span-3">
              <h3 className="font-mono text-2xl font-bold text-gray-900 uppercase">Education</h3>
            </div>
            <div className="col-span-9">
              <div className="bg-gray-50 border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm text-gray-500 bg-white px-3 py-1 uppercase">2017 - 2021</span>
                  <span className="font-mono text-sm text-gray-400">GPA: 3.7/4.0 • Honors</span>
                </div>
                <h4 className="font-mono text-xl font-bold text-gray-900 mb-2">B.F.A. in Graphic Design</h4>
                <p className="font-mono text-lg text-gray-700 mb-4">Rhode Island School of Design (RISD)</p>
                <p className="font-mono text-base text-gray-600 leading-relaxed">
                  Graduated with Graphic Design Honors. Coursework emphasized motion design, 
                  interactive media, and visual communication. Active in cross-disciplinary collaborations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-32 bg-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <h2 className="font-mono text-4xl font-bold text-gray-900 uppercase sticky top-8">Skills</h2>
            </div>
            <div className="col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 p-8">
                  <h3 className="font-mono text-xl font-bold text-gray-900 mb-6 uppercase">Design Expertise</h3>
                  <div className="space-y-3 font-mono text-sm text-gray-700">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Typography & Static Design
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      AR Filter Development
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Motion Design & 3D Design
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Interactive Design & Web Development
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      3D Texturing & Rendering
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Program Development (iOS, PC, Mac, Linux)
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-8">
                  <h3 className="font-mono text-xl font-bold text-gray-900 mb-6 uppercase">Software</h3>
                  <div className="space-y-3 font-mono text-sm text-gray-700">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      After Effects, Premiere Pro, DaVinci Resolve
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Photoshop, Illustrator
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Blender 3D, Cinema 4D, RedShift
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Houdini, Substance Suite
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Unreal Engine 5, Unity
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Spark AR, TikTok Effect House
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-3">
              <h2 className="font-mono text-4xl font-bold text-gray-900 uppercase sticky top-8">
                Selected Work
              </h2>
            </div>
            <div className="col-span-6">
              <p className="font-mono text-lg text-gray-700 leading-relaxed">
                A curated selection of motion graphics, VFX, and creative technology projects 
                spanning entertainment, music, and brand campaigns.
              </p>
            </div>
            <div className="col-span-3">
              <div className="font-mono text-sm text-gray-500 space-y-2">
                <div>TOTAL PROJECTS: 50+</div>
                <div>COMBINED VIEWS: 21M+</div>
                <div>YEARS ACTIVE: 2020-2024</div>
              </div>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project 1 */}
            <div className="bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-white text-xl mb-2">THE LAST OF US S2</div>
                    <div className="font-mono text-gray-400 text-sm">PODCAST VISUALS</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-xl font-bold text-gray-900">The Last of Us S2</h3>
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">Featured</span>
                </div>
                <p className="font-mono text-base text-gray-600 leading-relaxed mb-4">
                  Created highly-praised marketing promo visuals and looping platform content 
                  for HBO official companion podcast.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Design</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">After Effects</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">HBO</span>
                </div>
                <div className="font-mono text-sm text-gray-500">
                  <span className="font-medium">Client:</span> Warner Bros. Discovery • <span className="font-medium">Year:</span> 2024
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-white text-xl mb-2">NIKE D/N</div>
                    <div className="font-mono text-red-200 text-sm">GLOBAL LAUNCH</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-xl font-bold text-gray-900">Nike D/N Global Launch</h3>
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">Contract</span>
                </div>
                <p className="font-mono text-base text-gray-600 leading-relaxed mb-4">
                  Led design and coordination of VFX/GFX for Nike global product launch campaign 
                  across multiple markets.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">VFX Direction</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">360° Video</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Global</span>
                </div>
                <div className="font-mono text-sm text-gray-500">
                  <span className="font-medium">Client:</span> NIKE, Inc. • <span className="font-medium">Year:</span> 2023
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-purple-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-white text-xl mb-2">UNIVERSAL MUSIC</div>
                    <div className="font-mono text-purple-200 text-sm">LYRIC VIDEOS</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-xl font-bold text-gray-900">Universal Music Lyric Videos</h3>
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">21M+ Views</span>
                </div>
                <p className="font-mono text-base text-gray-600 leading-relaxed mb-4">
                  Produced animated lyric videos for Jeremy Zucker and Alexander 23 using 
                  motion tracking and 3D projection techniques.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Kinetic Typography</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Motion Tracking</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">3D</span>
                </div>
                <div className="font-mono text-sm text-gray-500">
                  <span className="font-medium">Client:</span> Universal Music Group • <span className="font-medium">Year:</span> 2021-2022
                </div>
              </div>
            </div>

            {/* Project 4 */}
            <div className="bg-white border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-blue-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-white text-xl mb-2">HBO MAX AR</div>
                    <div className="font-mono text-blue-200 text-sm">SOCIAL FILTERS</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-xl font-bold text-gray-900">HBO Max AR Filters</h3>
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 uppercase">2M+ Uses</span>
                </div>
                <p className="font-mono text-base text-gray-600 leading-relaxed mb-4">
                  Created interactive AR filters for major franchises using Instagram Spark AR 
                  and TikTok Effect House.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">AR Development</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Spark AR</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1">Social</span>
                </div>
                <div className="font-mono text-sm text-gray-500">
                  <span className="font-medium">Client:</span> HBO Max • <span className="font-medium">Year:</span> 2021-2022
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6">
              <h3 className="font-mono text-2xl font-bold mb-6 uppercase">Get In Touch</h3>
              <p className="font-mono text-base text-gray-300 leading-relaxed mb-6">
                Available for select freelance projects and collaborations in motion design and creative technology.
              </p>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center">
                  <span className="text-gray-400 w-16">EMAIL:</span>
                  <a href="mailto:nparktate@gmail.com" className="text-white hover:text-gray-300 transition-colors">
                    nparktate@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-16">PHONE:</span>
                  <a href="tel:4012413241" className="text-white hover:text-gray-300 transition-colors">
                    (401) 241-3241
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-16">LINKED:</span>
                  <a href="https://www.linkedin.com/in/linkparkdesign/" target="_blank" className="text-white hover:text-gray-300 transition-colors">
                    linkedin.com/in/linkparkdesign
                  </a>
                </div>
              </div>
            </div>
            <div className="col-span-6">
              <div className="grid grid-cols-3 gap-8 font-mono text-sm">
                <div>
                  <div className="text-gray-400 uppercase mb-3">Status</div>
                  <div className="text-white">Available</div>
                </div>
                <div>
                  <div className="text-gray-400 uppercase mb-3">Location</div>
                  <div className="text-white">Los Angeles, CA</div>
                </div>
                <div>
                  <div className="text-gray-400 uppercase mb-3">Response</div>
                  <div className="text-white">24-48 Hours</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex items-center justify-between font-mono text-xs text-gray-500">
              <div>© 2024 Nicholas Park. Motion Designer & Creative Technologist.</div>
              <div>Portfolio v10.0 • Built with Next.js</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}