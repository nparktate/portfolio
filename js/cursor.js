document.addEventListener('DOMContentLoaded', () => {
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
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
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
        transition: width 0.3s, height 0.3s, border-color 0.3s;
        mix-blend-mode: difference;
    `;
    
    // Add to DOM
    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);
    
    // Disable default cursor
    document.body.style.cursor = 'none';
    
    // Make the cursor follow mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Add slight delay to the ring for cool effect
        setTimeout(() => {
            cursorRing.style.left = `${e.clientX}px`;
            cursorRing.style.top = `${e.clientY}px`;
        }, 50);
    });
    
    // Add hover effect on categories
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorRing.style.width = '50px';
            cursorRing.style.height = '50px';
            cursorRing.style.borderColor = 'rgba(255, 255, 255, 1)';
        });
        
        category.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.width = '30px';
            cursorRing.style.height = '30px';
            cursorRing.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Disable text selection across the entire site
    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Hide cursor when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorRing.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorRing.style.opacity = '1';
    });
});