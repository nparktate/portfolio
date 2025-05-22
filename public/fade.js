document.addEventListener('DOMContentLoaded', function() {
  // Initial fade in for hero section
  requestAnimationFrame(() => {
    document.querySelector('.hero-section')?.classList.add('visible');
  });
  
  // Fade in other elements as they scroll into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  });
  
  document.querySelectorAll('.js-fade').forEach(el => observer.observe(el));
  
  // Note: Hover effects now handled by CSS in global.css
  // .hover-lift class uses CSS transitions for better performance
});