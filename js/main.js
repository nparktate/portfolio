document.addEventListener('DOMContentLoaded', () => {
    // Get categories and project elements
    const categories = document.querySelectorAll('.category');
    const projectGrid = document.getElementById('project-grid');
    const projectDetails = document.getElementById('project-details');
    
    // Helper function to get text width without wrapping
    function getTextWidth(element) {
        // Get current display and white-space settings
        const originalDisplay = element.style.display;
        const originalWhiteSpace = element.style.whiteSpace;
        const originalVisibility = element.style.visibility;
        
        // Set to measure width without wrapping
        element.style.display = 'inline-block';
        element.style.whiteSpace = 'nowrap';
        element.style.visibility = 'hidden';
        
        // Force layout calculation
        document.body.appendChild(element.cloneNode(true));
        const width = element.offsetWidth;
        
        // Reset to original settings
        element.style.display = originalDisplay;
        element.style.whiteSpace = originalWhiteSpace;
        element.style.visibility = originalVisibility;
        
        return width;
    }
    
    // Function to handle multi-line text with individual line scaling and prevent clipping
    function handleMultiLineText(textElement, originalText, containerHeight, containerWidth) {
        // Add extra padding to the container for multi-line text
        const parentCategory = textElement.closest('.category');
        if (parentCategory) {
            parentCategory.style.paddingTop = '1.5vh';
            parentCategory.style.paddingBottom = '1.5vh';
        }
        // Mark as multi-line
        textElement.classList.add('multi-line');
        
        // Clear current content
        textElement.innerHTML = '';
        
        // Calculate approximately how many characters can fit per line
        const testSpan = document.createElement('span');
        testSpan.textContent = originalText.substring(0, 5); // Test with first few characters
        textSpan.style.fontSize = textElement.style.fontSize;
        document.body.appendChild(testSpan);
        const charWidth = testSpan.offsetWidth / 5;
        document.body.removeChild(testSpan);
        
        // Approximate chars per line
        const charsPerLine = Math.floor(containerWidth / charWidth);
        
        // Split text into reasonable chunks for lines
        const words = originalText.split(' ');
        let lines = [];
        let currentLine = '';
        
        // Limit number of lines to prevent extreme clipping
        const maxLines = Math.min(5, Math.floor(containerHeight / 40));
        
        words.forEach(word => {
            if ((currentLine + ' ' + word).length <= charsPerLine) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
        
                // If we have too many lines, consolidate them
                if (lines.length > maxLines) {
                    // Compress to max lines
                    const compressedLines = [];
                    const linesPerGroup = Math.ceil(lines.length / maxLines);
            
                    for (let i = 0; i < lines.length; i += linesPerGroup) {
                        compressedLines.push(lines.slice(i, i + linesPerGroup).join(' '));
                    }
            
                    lines = compressedLines;
                }
                currentLine = word;
            }
        });
        if (currentLine) lines.push(currentLine);
        
        // Calculate line height based on available space with more conservative sizing
        const lineHeight = Math.floor(containerHeight / (lines.length * 1.5)) * 0.9; // Added extra space between lines
        
        // Create spans for each line and apply optimal scaling
        lines.forEach((line, index) => {
            const lineSpan = document.createElement('span');
            lineSpan.textContent = line;
            lineSpan.style.fontSize = `${lineHeight}px`;
            
            // Apply substantial weight for readability
            lineSpan.style.fontVariationSettings = `'wght' 500`;
            
            textElement.appendChild(lineSpan);
            
            // Calculate optimal scaling for this line with safety margin
            const lineWidth = lineSpan.offsetWidth;
            if (lineWidth > containerWidth * 0.95) { // Added 5% safety margin
                // Line too wide, scale it down more aggressively
                const scaleX = (containerWidth * 0.95) / lineWidth;
                lineSpan.style.setProperty('--line-scale-x', scaleX.toFixed(3));
            } else {
                // Line has room to expand but with more restraint
                const scaleX = Math.min(1.05, (containerWidth * 0.95) / lineWidth); // Reduced from 1.1 to 1.05
                lineSpan.style.setProperty('--line-scale-x', scaleX.toFixed(3));
            }
            
            // Set vertical scale to ensure consistent height with slight reduction to prevent clipping
            lineSpan.style.setProperty('--line-scale-y', 0.85);
        });
    }
    
    // Create projects container for each category
    categories.forEach(category => {
        // Text elements are now in HTML for better structure control
        const textElement = category.querySelector('.category-text');
        
        // Initialize CSS variables for perfect scaling
        textElement.style.setProperty('--text-scale-x', 1);
        textElement.style.setProperty('--text-scale-y', 1);
        
        // Create the projects container for this category
        const projectsContainer = document.createElement('div');
        projectsContainer.classList.add('projects-container');
        projectsContainer.setAttribute('data-for', category.getAttribute('data-category'));
        document.body.appendChild(projectsContainer);
        
        // Add placeholder projects (to be replaced with real data later)
        for (let i = 1; i <= 6; i++) {
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');
            projectItem.textContent = `${category.getAttribute('data-category')} Project ${i}`;
            projectItem.setAttribute('data-project-id', `${category.getAttribute('data-category')}-${i}`);
            projectsContainer.appendChild(projectItem);
            
            projectItem.addEventListener('click', (e) => {
                e.stopPropagation();
                openProjectDetails(projectItem.getAttribute('data-project-id'));
            });
        }
    });
    
    // Function to perfectly size text to fill container space
    function adjustTextSize() {
        // Get viewport dimensions and orientation
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isPortrait = viewportHeight > viewportWidth;
        
        // Calculate total available height
        const totalHeight = document.querySelector('.categories-container').offsetHeight;
        const categoryCount = categories.length;
        
        // Calculate target height per category (accounting for borders)
        const targetHeight = (totalHeight / categoryCount) - 1; // -1px for borders
        
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            
            // Reset text properties to measure natural size
            textElement.style.fontSize = '';
            textElement.style.fontVariationSettings = '';
            textElement.style.letterSpacing = '';
            textElement.style.wordSpacing = '';
            textElement.style.transform = '';
            textElement.classList.remove('multi-line');
            
            // Clear any previously created line spans
            while (textElement.querySelector('span')) {
                const span = textElement.querySelector('span');
                textElement.textContent = span.textContent;
            }
            
            // Set category height to target height
            category.style.height = `${targetHeight}px`;
            
            // Calculate max available width (accounting for padding)
            const containerWidth = category.offsetWidth - (isPortrait ? 40 : 20); // Account for padding
            
            // Set initial font size based on container height
            // Use 80% of container height as starting point
            let fontSize = Math.floor(targetHeight * 0.8);
            textElement.style.fontSize = `${fontSize}px`;
            
            // Switch between landscape and portrait handling
            if (isPortrait) {
                handlePortraitText(textElement, targetHeight, containerWidth);
            } else {
                handleLandscapeText(textElement, targetHeight, containerWidth);
            }
        });
    }
    
    // Handle text for portrait orientation
    function handlePortraitText(textElement, containerHeight, containerWidth) {
        // Enable line breaks for narrow screens
        textElement.style.whiteSpace = 'normal';
        
        // Check if text needs to be split into multiple lines
        const originalText = textElement.textContent;
        const singleLineWidth = getTextWidth(textElement);
        
        if (singleLineWidth > containerWidth * 1.1) { // More aggressive line breaking at 1.1 instead of 1.2
            // Text needs to be split into multiple lines
            handleMultiLineText(textElement, originalText, containerHeight, containerWidth);
            return;
        }
        
        // Start with a substantial weight that works for line breaks
        let weight = 500;
        textElement.style.fontVariationSettings = `'wght' ${weight}`;
        textElement.style.setProperty('--calculated-weight', weight);
        
        // Get initial measurements
        let textHeight = textElement.scrollHeight;
        let textWidth = textElement.scrollWidth;
        
        // First adjust font size to fit height
        let currentFontSize = parseFloat(getComputedStyle(textElement).fontSize);
        let sizeFactor = 1;
        
        if (textHeight > containerHeight * 0.9) {
            // Text too tall, reduce size
            sizeFactor = (containerHeight * 0.9) / textHeight;
            currentFontSize = currentFontSize * sizeFactor;
            textElement.style.fontSize = `${currentFontSize}px`;
        }
        
        // Now check width
        textWidth = textElement.scrollWidth;
        
        // If text is too wide, adjust letter-spacing first
        if (textWidth > containerWidth) {
            let letterSpacing = 0;
            // Decrease letter spacing to make it fit
            while (textWidth > containerWidth && letterSpacing > -0.03) {
                letterSpacing -= 0.01;
                textElement.style.letterSpacing = `${letterSpacing}em`;
                textWidth = textElement.scrollWidth;
            }
            
            // If still too wide, use scaling as last resort
            if (textWidth > containerWidth) {
                const scaleX = Math.max(0.85, containerWidth / textWidth);
                textElement.style.setProperty('--text-scale-x', scaleX);
            }
        }
        
        // Set a decent scale for Y to ensure it fits
        textElement.style.setProperty('--text-scale-y', 0.95);
    }
    
    // Handle text for landscape orientation (prioritize filling width)
    function handleLandscapeText(textElement, containerHeight, containerWidth) {
        // Keep text on a single line in landscape
        textElement.style.whiteSpace = 'nowrap';
        
        // Use 80% of container height for font size
        let fontSize = Math.floor(containerHeight * 0.85);
        textElement.style.fontSize = `${fontSize}px`;
        
        // Start with a middle weight
        let weight = 400;
        textElement.style.fontVariationSettings = `'wght' ${weight}`;
        textElement.style.setProperty('--calculated-weight', weight);
        
        // Get initial text width
        let textWidth = textElement.offsetWidth;
        
        // Use binary search to find optimal weight for filling width
        // This is much more efficient than incrementing by fixed amounts
        let minWeight = 100;
        let maxWeight = 900;
        let bestWeight = weight;
        let bestDiff = Math.abs(textWidth - containerWidth);
        
        // 10 iterations is typically enough to get very close
        for (let i = 0; i < 10; i++) {
            if (textWidth < containerWidth) {
                // Text too narrow, try a heavier weight
                minWeight = weight;
                weight = Math.min(900, Math.floor((weight + maxWeight) / 2));
            } else {
                // Text too wide, try a lighter weight
                maxWeight = weight;
                weight = Math.max(100, Math.floor((weight + minWeight) / 2));
            }
            
            textElement.style.fontVariationSettings = `'wght' ${weight}`;
            textElement.style.setProperty('--calculated-weight', weight);
            textWidth = textElement.offsetWidth;
            
            // Keep track of best result
            const diff = Math.abs(textWidth - containerWidth);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestWeight = weight;
            }
        }
        
        // Use the weight that got us closest to target width
        textElement.style.fontVariationSettings = `'wght' ${bestWeight}`;
        textElement.style.setProperty('--calculated-weight', bestWeight);
        textWidth = textElement.offsetWidth;
        
        // Fine-tune with letter spacing if needed
        if (Math.abs(textWidth - containerWidth) > containerWidth * 0.05) {
            const letterSpacing = (textWidth < containerWidth) ? 0.02 : -0.02;
            textElement.style.letterSpacing = `${letterSpacing}em`;
            textWidth = textElement.offsetWidth;
        }
        
        // Use precise scaling as the final adjustment
        const scaleX = containerWidth / textWidth;
        textElement.style.setProperty('--text-scale-x', scaleX.toFixed(3));
    }
    
    // Track active elements
    let activeCategory = null;
    let activeProjectsContainer = null;
    
    // Handle click on category
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.getAttribute('data-category');
            const projectsContainer = document.querySelector(`.projects-container[data-for="${categoryId}"]`);
            
            // If another category is active, deactivate it
            if (activeCategory && activeCategory !== category) {
                activeCategory.classList.remove('active');
                activeProjectsContainer.classList.remove('active');
            }
            
            // Toggle active state
            category.classList.toggle('active');
            projectsContainer.classList.toggle('active');
            
            // Update active elements
            if (category.classList.contains('active')) {
                activeCategory = category;
                activeProjectsContainer = projectsContainer;
                
                // Add subtle motion effect
                categories.forEach(cat => {
                    if (cat !== category) {
                        const offset = Math.random() * 5 - 2.5;
                        cat.style.transform = `translateY(${offset}px)`;
                        setTimeout(() => {
                            cat.style.transform = '';
                        }, 500);
                    }
                });
            } else {
                activeCategory = null;
                activeProjectsContainer = null;
            }
        });
    });
    
    // Function to open project details
    function openProjectDetails(projectId) {
        projectDetails.classList.remove('hidden');
        projectDetails.classList.add('active');
        
        // Create content for project details
        projectDetails.innerHTML = `
            <div class="project-header">
                <h2>${projectId.replace(/-/g, ' ')}</h2>
                <button class="close-button">×</button>
            </div>
            <div class="project-content">
                <div class="project-images">
                    <div class="image-placeholder" style="background-color: hsl(${Math.random() * 360}, 80%, 70%)"></div>
                    <div class="image-placeholder" style="background-color: hsl(${Math.random() * 360}, 80%, 70%)"></div>
                </div>
                <div class="project-description">
                    <p>This is an experimental project by Nicholas Tate Park. Super dynamic responsive layout demonstration.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                </div>
            </div>
        `;
        
        // Add close button functionality
        const closeButton = projectDetails.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            projectDetails.classList.remove('active');
            setTimeout(() => {
                projectDetails.classList.add('hidden');
            }, 500);
        });
        
        // Styling for new elements
        const imagePlaceholders = projectDetails.querySelectorAll('.image-placeholder');
        imagePlaceholders.forEach(placeholder => {
            placeholder.style.height = '200px';
            placeholder.style.marginBottom = '20px';
            placeholder.style.borderRadius = '4px';
        });
    }
    
    // Debounce function to prevent excessive calculations
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Add subtle interactive typography effects
    document.addEventListener('mousemove', debounce((e) => {
        if (!activeCategory) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            categories.forEach((category) => {
                const textElement = category.querySelector('.category-text');
                
                // Get category position
                const rect = category.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                
                // Calculate normalized distance (0-1)
                const distanceY = Math.abs(e.clientY - centerY) / (window.innerHeight / 2);
                const normalizedDistance = Math.min(1, distanceY);
                
                // Get stored weight and scales
                const baseWeight = parseInt(textElement.style.getPropertyValue('--calculated-weight') || 400);
                const scaleX = parseFloat(textElement.style.getPropertyValue('--text-scale-x') || 1);
                const scaleY = parseFloat(textElement.style.getPropertyValue('--text-scale-y') || 1);
                
                // Calculate hover effect - increase weight for nearby text
                // This achieves a subtle "magnetic" effect
                let hoverWeight = baseWeight;
                if (normalizedDistance < 0.5) {
                    // Boost weight for categories close to cursor (max +200 weight)
                    const boost = 200 * (1 - normalizedDistance * 2);
                    hoverWeight = Math.min(900, Math.round(baseWeight + boost));
                }
                
                // Set the hover-influenced weight
                textElement.style.fontVariationSettings = `'wght' ${hoverWeight}`;
                
                // Subtle horizontal shift based on mouse position
                const maxShift = 2; // max pixels to shift
                const shiftX = (mouseX - 0.5) * maxShift;
                
                // Apply transform with original scaling preserved
                textElement.style.transform = `translateX(${shiftX}px) scale(${scaleX}, ${scaleY})`;
            });
        }
    }, 50)); // Increased debounce for smoother performance
    
    // Double-click anywhere to go back to main view
    document.addEventListener('dblclick', () => {
        if (activeCategory) {
            activeCategory.classList.remove('active');
            activeProjectsContainer.classList.remove('active');
            activeCategory = null;
            activeProjectsContainer = null;
        }
        
        projectDetails.classList.remove('active');
        setTimeout(() => {
            projectDetails.classList.add('hidden');
        }, 500);
    });
    
    // Handle scroll events - add class to prevent jittering
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        document.documentElement.classList.add('is-scrolling');
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.documentElement.classList.remove('is-scrolling');
            // Recalculate after scrolling stops
            adjustTextSize();
        }, 150);
    });
    
    // Call adjustTextSize on load and resize - but debounced
    const debouncedResize = debounce(() => {
        // Add resize animation transition temporarily
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            textElement.style.transition = 'all 0.3s ease';
        });
        
        adjustTextSize();
        
        setTimeout(() => {
            categories.forEach(category => {
                const textElement = category.querySelector('.category-text');
                textElement.style.transition = '';
            });
        }, 300);
    }, 100);
    
    window.addEventListener('resize', debouncedResize);
    
    // Initial adjustment
    adjustTextSize();
    
    // Create a ResizeObserver for precise size tracking
    const resizeObserver = new ResizeObserver(entries => {
        if (!document.documentElement.classList.contains('is-scrolling')) {
            adjustTextSize();
        }
    });
    
    // Observe the categories container
    resizeObserver.observe(document.querySelector('.categories-container'));
    
    // Track viewport changes
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let isAdjusting = false;
    
    // Throttled resize handler for better performance
    window.addEventListener('resize', () => {
        if (isAdjusting) return;
        
        isAdjusting = true;
        requestAnimationFrame(() => {
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            
            // Only adjust if dimensions actually changed
            if (lastWidth !== currentWidth || lastHeight !== currentHeight) {
                adjustTextSize();
                lastWidth = currentWidth;
                lastHeight = currentHeight;
            }
            
            isAdjusting = false;
        });
    });
    
    // Clean up observer on page unload
    window.addEventListener('beforeunload', () => {
        resizeObserver.disconnect();
    });
});