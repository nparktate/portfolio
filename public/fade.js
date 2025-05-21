window.onload = function() {
  // Initial fade in for hero section
  setTimeout(function() {
    document.querySelector('.hero-section')?.classList.add('visible');
  }, 100);
  
  // Fade in other elements as they scroll into view
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.js-fade').forEach(function(el) {
    observer.observe(el);
  });
  
  // Add smooth hover effects for buttons and cards
  document.querySelectorAll('.hover-lift').forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'translateY(-5px)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translateY(0)';
    });
  });
}