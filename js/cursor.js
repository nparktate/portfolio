document.addEventListener('DOMContentLoaded', () => {
    // More robust touch device detection
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0) ||
                window.matchMedia('(pointer: coarse)').matches ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    // Global variable to track touch capability
    const IS_TOUCH_DEVICE = isTouchDevice();
    
    // Only add custom cursor on non-touch devices
    if (!IS_TOUCH_DEVICE) {
        // Create custom cursor elements
        const cursor = document.createElement('div');
        const cursorRing = document.createElement('div');
        
        // Style the main cursor dot
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            transition: transform 0.1s ease, opacity 0.2s ease;
            mix-blend-mode: difference;
            will-change: transform, opacity;
            backface-visibility: hidden;
        `;
        
        // Style the outer ring
        cursorRing.className = 'cursor-ring';
        cursorRing.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9998;
            transition: width 0.3s, height 0.3s, border-color 0.3s, opacity 0.2s ease, transform 0.2s ease, border-width 0.2s ease;
            mix-blend-mode: difference;
            will-change: transform, width, height, border-color, opacity;
            backface-visibility: hidden;
        `;
        
        // Add to DOM
        document.body.appendChild(cursor);
        document.body.appendChild(cursorRing);
        
        // Disable default cursor
        document.body.style.cursor = 'none';
        
        // Use requestAnimationFrame for smoother cursor movement
        let cursorX = -100, cursorY = -100; // Start offscreen
        let ringX = -100, ringY = -100;
        
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });
        
        // Animation loop for smoother performance
        function updateCursor() {
            // Update dot position immediately
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            
            // Add lag to the ring for effect (lerp)
            ringX = ringX + (cursorX - ringX) * 0.2;
            ringY = ringY + (cursorY - ringY) * 0.2;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(updateCursor);
        }
        
        // Start animation loop
        requestAnimationFrame(updateCursor);
        
        // Add hover effect on categories with performance optimization
        const hoverElements = document.querySelectorAll('.category, .project-item, a, button');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorRing.style.width = '50px';
                cursorRing.style.height = '50px';
                cursorRing.style.borderColor = 'rgba(255, 255, 255, 1)';
                cursorRing.style.transitionDuration = '0.2s';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorRing.style.width = '30px';
                cursorRing.style.height = '30px';
                cursorRing.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                cursorRing.style.transitionDuration = '0.3s';
            });
        });
        
        // Click effect with better transitions
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
            cursor.style.opacity = '0.8';
            cursorRing.style.transform = 'translate(-50%, -50%) scale(0.7)';
            cursorRing.style.borderWidth = '2px';
            cursorRing.style.transitionDuration = '0.1s';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.opacity = '1';
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.borderWidth = '1px';
            cursorRing.style.transitionDuration = '0.2s';
        });
        
        // Hide cursor when mouse leaves the window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorRing.style.opacity = '0';
            cursor.style.transitionDuration = '0.3s';
            cursorRing.style.transitionDuration = '0.3s';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorRing.style.opacity = '1';
            cursor.style.transitionDuration = '0.2s';
            cursorRing.style.transitionDuration = '0.2s';
        });
        
        // Hide cursor when scrolling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            cursor.style.opacity = '0.3';
            cursorRing.style.opacity = '0.3';
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                cursor.style.opacity = '1';
                cursorRing.style.opacity = '1';
            }, 100);
        }, { passive: true });
    }
    
    // Disable text selection only on non-form elements and only on non-touch devices
    document.addEventListener('selectstart', (e) => {
        const target = e.target;
        // Allow selection in input fields and on touch devices
        if (!IS_TOUCH_DEVICE && 
            target.tagName !== 'INPUT' && 
            target.tagName !== 'TEXTAREA' &&
            !target.classList.contains('selectable')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Add additional touch behavior optimizations
    if (IS_TOUCH_DEVICE) {
        // Add touch optimization classes
        document.body.classList.add('touch-device');
        
        // Remove any existing cursor styles if somehow present
        const existingCursors = document.querySelectorAll('.custom-cursor, .cursor-ring');
        existingCursors.forEach(el => el.parentNode.removeChild(el));
    }
});