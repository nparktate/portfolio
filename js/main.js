// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.querySelector('.back-to-top');

  // Project filter elements
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Contact form
  const contactForm = document.getElementById('contactForm');

  // Sections for animation
  const sections = document.querySelectorAll('.section');
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-progress');

  // Typed animation elements
  const typedElement = document.querySelector('.typed-element');

  // Cursor elements
  const cursor = document.querySelector('.cursor');
  
  // Initialize animation library
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true
  });

  // Mouse cursor effect
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (window.scrollY > 500) {
      backToTop.classList.add('active');
    } else {
      backToTop.classList.remove('active');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();

    // Reveal animations on scroll
    revealOnScroll();
  });

  // Hamburger menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Function to update active nav link
  function updateActiveNavLink() {
    let scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Back to top functionality
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Project filtering
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        // Animate out all cards first
        projectCards.forEach(card => {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
        });
        
        // Short delay before filtering
        setTimeout(() => {
          projectCards.forEach(card => {
            if (filterValue === 'all') {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              }, 100);
            } else if (card.getAttribute('data-category') === filterValue) {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              }, 100);
            } else {
              card.style.display = 'none';
            }
          });
        }, 300);
      });
    });
  }

  // Contact form submission handling
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Simple validation (can be expanded)
      if (!name || !email || !message) {
        showFormAlert('Please fill in all fields', 'error');
        return;
      }
      
      // Simulated form submission - replace with actual backend call
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate backend delay
      setTimeout(() => {
        showFormAlert(`Thanks ${name}! Your message has been sent.`, 'success');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
      }, 1500);
    });
  }

  // Form alert message
  function showFormAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `form-alert ${type}`;
    alertDiv.textContent = message;
    
    // Find or create alert container
    let alertContainer = document.querySelector('.form-alert-container');
    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.className = 'form-alert-container';
      contactForm.insertAdjacentElement('afterend', alertContainer);
    }
    
    alertContainer.appendChild(alertDiv);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }

  // Reveal elements on scroll
  function revealOnScroll() {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  }

  // Initial call to reveal elements in view on page load
  revealOnScroll();

  // Animate skill bars when in view
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const percentage = bar.getAttribute('data-percentage');
      bar.style.width = percentage;
    });
  }

  // Use Intersection Observer for skill bars
  if (skillBars.length > 0) {
    const skillsSection = document.querySelector('.skills');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBars();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
  }

  // Typing animation effect
  function runTypingEffect() {
    if (!typedElement) return;
    
    const options = {
      strings: JSON.parse(typedElement.getAttribute('data-typed-items')),
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      loop: true
    };
    
    new Typed(typedElement, options);
  }

  // Initialize typed animation if the element exists
  if (typedElement) {
    // Load Typed.js from CDN if not already available
    if (typeof Typed !== 'function') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12';
      script.onload = runTypingEffect;
      document.head.appendChild(script);
    } else {
      runTypingEffect();
    }
  }

  // Parallax effect for hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
  }

  // Animate count up effect for stat numbers
  function animateCounters() {
    const counters = document.querySelectorAll('.count-up');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const step = Math.ceil(target / (duration / 16)); // 60fps
      
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = current;
        }
      }, 16);
    });
  }

  // Use Intersection Observer for counter animation
  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
  }

  // Initialize project cards with animation
  function animateProjectCards() {
    projectCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }, 100 * index);
    });
  }
  
  // Run initial animations
  animateProjectCards();
});