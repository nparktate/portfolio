import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Register plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Header animation
  const heroAnimation = () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButton = document.querySelector('.hero-button');
    
    if (heroTitle && heroSubtitle) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      // Create text split for more granular animation
      const splitTitle = new SplitText(heroTitle, { type: "chars, words" });
      
      tl.from(splitTitle.chars, {
        opacity: 0,
        y: 50,
        stagger: 0.03,
        duration: 1.2
      })
      .from(heroSubtitle, {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, "-=0.6")
      .from(heroButton, {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, "-=0.4");
    }
  };
  
  // Scroll-based animations
  const initScrollAnimations = () => {
    // Batch fade-in animation for elements with js-fade class
    const fadeElements = document.querySelectorAll('.js-fade');
    
    fadeElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom-=100',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });
    
    // Timeline animations for improved visual presentation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom-=100',
          toggleActions: 'play none none none',
          once: true
        }
      });
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      const image = card.querySelector('img');
      const content = card.querySelector('.card-content');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(image, { scale: 1.05, duration: 0.4, ease: 'power1.out' });
        gsap.to(content, { y: -10, duration: 0.4, ease: 'power1.out' });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(image, { scale: 1, duration: 0.4, ease: 'power1.out' });
        gsap.to(content, { y: 0, duration: 0.4, ease: 'power1.out' });
      });
    });
  };
  
  // Navigation scroll animation
  const initNavAnimation = () => {
    const nav = document.getElementById('main-nav');
    
    if (nav) {
      ScrollTrigger.create({
        start: 'top -80',
        onEnter: () => nav.classList.add('nav-scrolled'),
        onLeaveBack: () => nav.classList.remove('nav-scrolled')
      });
    }
  };
  
  // Initialize all animations
  heroAnimation();
  initScrollAnimations();
  initNavAnimation();
});