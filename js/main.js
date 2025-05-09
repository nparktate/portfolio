document.addEventListener('DOMContentLoaded', () => {
    // Get categories and project elements
    const categories = document.querySelectorAll('.category');
    const projectGrid = document.getElementById('project-grid');
    const projectDetails = document.getElementById('project-details');
    
    // Configuration
    const CONFIG = {
        multiLineSpacing: 0.2, // 20% of height for spacing between lines
        lineScaleMargin: 0.98, // Scale lines to 98% of container width for better fill
        maxLines: 2,           // Maximum number of lines to break text into
        earlyBreakThreshold: 0.85, // Break lines when text exceeds 85% of width
        minLineMargin: 10,     // Minimum pixels between lines
        minFontSize: 20,       // Minimum font size in pixels
        minCategoryHeight: 80,  // Minimum category height in pixels
        horizontalFill: 0.95   // How much of the horizontal space to fill (95%)
    };
    
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
    
    // Function to handle multi-line text with guaranteed spacing
    function handleMultiLineText(textElement, originalText, containerHeight, containerWidth) {
        // IMPORTANT - Make sure we don't cut off text
        const parentCategory = textElement.closest('.category');
        
        // Mark as multi-line
        textElement.classList.add('multi-line');
        
        // Clear current content
        textElement.innerHTML = '';
        
        // Get special break data for 3D ANIMATION & DESIGN case
        let dataLine1 = textElement.getAttribute('data-line1');
        let dataLine2 = textElement.getAttribute('data-line2');
        
        // Prepare lines array - handle special cases first
        let lines = [];
        
        if (dataLine1 && dataLine2) {
            // Special case with predetermined lines (like 3D ANIMATION & DESIGN)
            lines = [dataLine1, dataLine2];
        } else {
            // Standard case - split intelligently
            const words = originalText.split(' ');
            
            if (words.length === 1) {
                // Just one word - keep it on one line
                lines = [words[0]];
            } else if (words.length === 2) {
                // Two words - one per line
                lines = [words[0], words[1]];
            } else if (words.length === 3) {
                // Three words - try to balance
                if (words[0].length + words[1].length < words[2].length) {
                    lines = [words[0] + ' ' + words[1], words[2]];
                } else {
                    lines = [words[0], words[1] + ' ' + words[2]];
                }
            } else {
                // For longer text, try to balance the characters
                let totalLength = originalText.length;
                let line1 = '';
                let line2 = '';
                let i = 0;
                
                // Try to make first line ~50% of total characters
                while (i < words.length && line1.length < totalLength / 2) {
                    line1 += (line1 ? ' ' : '') + words[i];
                    i++;
                }
                
                // Put remaining words on second line
                while (i < words.length) {
                    line2 += (line2 ? ' ' : '') + words[i];
                    i++;
                }
                
                lines = [line1, line2];
            }
        }
        
        // Always ensure we have content for all lines
        if (lines.length === 1) {
            lines.push('');
        }
        
        // Calculate sizing for available container
        const availableHeight = Math.max(containerHeight - 20, CONFIG.minCategoryHeight);
        const lineHeight = Math.max(CONFIG.minFontSize, Math.floor(availableHeight * 0.4)); // Each line gets 40% of height
        const marginTop = Math.floor(availableHeight * 0.1); // 10% top margin
        const marginBottom = Math.floor(availableHeight * 0.1); // 10% bottom margin
        
        // Create container for lines with proper sizing
        const lineContainer = document.createElement('div');
        lineContainer.style.width = '100%';
        lineContainer.style.display = 'flex';
        lineContainer.style.flexDirection = 'column';
        lineContainer.style.alignItems = 'center';
        lineContainer.style.justifyContent = 'center';
        lineContainer.style.height = `${availableHeight}px`;
        lineContainer.style.margin = '0';
        lineContainer.style.padding = '0';
        lineContainer.style.overflow = 'visible';
        textElement.appendChild(lineContainer);
        
        // Create and style each line
        lines.forEach((line, index) => {
            if (!line.trim() && index > 0) return; // Skip empty lines except first line
            
            const lineSpan = document.createElement('span');
            lineSpan.textContent = line;
            lineSpan.style.fontSize = `${lineHeight}px`;
            lineSpan.style.fontVariationSettings = `'wght' 500`;
            lineSpan.style.margin = `${index === 0 ? marginTop : 0}px 0 ${index === lines.length - 1 ? marginBottom : 0}px 0`;
            lineSpan.style.padding = '0';
            lineSpan.style.height = `${lineHeight}px`;
            lineSpan.style.lineHeight = `${lineHeight}px`;
            lineSpan.style.display = 'block';
            lineSpan.style.width = '100%';
            lineSpan.style.textAlign = 'center';
            lineSpan.style.whiteSpace = 'nowrap';
            lineSpan.style.overflow = 'visible';
            
            lineContainer.appendChild(lineSpan);
            
            // Calculate and apply horizontal scaling to fill width
            const lineWidth = lineSpan.offsetWidth;
            const availableWidth = containerWidth * CONFIG.horizontalFill;
            let scaleX = 1;
            
            if (lineWidth > 0 && line.trim()) { // Only scale non-empty lines
                if (lineWidth > availableWidth) {
                    // Scale down if too wide
                    scaleX = availableWidth / lineWidth;
                } else {
                    // Always scale up to fill width
                    scaleX = availableWidth / lineWidth;
                }
                
                // Apply horizontal scaling
                lineSpan.style.transform = `scaleX(${scaleX.toFixed(3)})`;
                lineSpan.style.transformOrigin = 'center';
            }
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
        const containerElement = document.querySelector('.categories-container');
        const totalAvailableHeight = viewportHeight; // Use full viewport height
        
        // Force container to take full viewport height
        containerElement.style.height = '100vh';
        containerElement.style.overflow = 'auto'; // Make sure we can scroll if needed
        
        const categoryCount = categories.length;
        
        // Calculate target height per category - ensure all are visible
        // For portrait, make each category taller
        const targetHeight = isPortrait 
            ? Math.max(80, Math.floor(totalAvailableHeight / (categoryCount * 0.7))) // 70% of equal division
            : Math.floor(totalAvailableHeight / categoryCount) - 1; // -1px for borders
        
        // Track total used height to ensure we fill viewport
        let totalUsedHeight = 0;
        
        categories.forEach((category, index) => {
            const textElement = category.querySelector('.category-text');
            
            // Reset text properties to get a clean start
            textElement.style.fontSize = '';
            textElement.style.fontVariationSettings = '';
            textElement.style.letterSpacing = '';
            textElement.style.wordSpacing = '';
            textElement.style.transform = '';
            
            // Remove multi-line class and clear spans
            textElement.classList.remove('multi-line');
            while (textElement.querySelector('span')) {
                const span = textElement.querySelector('span');
                if (span && span.textContent) {
                    textElement.textContent = span.textContent;
                } else {
                    textElement.innerHTML = '';
                    break;
                }
            }
            
            // Make sure we have original text
            if (!textElement.textContent && textElement.getAttribute('data-original-text')) {
                textElement.textContent = textElement.getAttribute('data-original-text');
            } else if (textElement.textContent) {
                // Save original text for future resets
                textElement.setAttribute('data-original-text', textElement.textContent);
            }
            
            // Set category height and ensure visibility
            category.style.height = `${targetHeight}px`;
            category.style.minHeight = `${Math.max(CONFIG.minCategoryHeight, targetHeight * 0.8)}px`;
            category.style.display = 'flex';
            category.style.visibility = 'visible';
            category.style.opacity = '1';
            
            // Calculate available width (accounting for padding)
            const containerWidth = category.offsetWidth - (isPortrait ? 40 : 20);
            
            // Set initial font size based on container height
            const fontSize = Math.floor(targetHeight * 0.8);
            textElement.style.fontSize = `${fontSize}px`;
            
            // Handle text based on orientation
            if (isPortrait) {
                handlePortraitText(textElement, targetHeight, containerWidth);
            } else {
                handleLandscapeText(textElement, targetHeight, containerWidth);
            }
            
            // Track used height
            totalUsedHeight += targetHeight;
        });
        
        // Ensure the last category is visible by scrolling if needed
        if (totalUsedHeight > viewportHeight) {
            containerElement.style.overflow = 'auto';
        }
    }
    
    // Handle text for portrait orientation
    function handlePortraitText(textElement, containerHeight, containerWidth) {
        // Always enable line breaks in portrait mode
        textElement.style.whiteSpace = 'normal';
        
        // Get original text
        const originalText = textElement.textContent;
        
        // Measure single-line width
        const singleLineWidth = getTextWidth(textElement);
        
        // ALWAYS break these specific texts or any text that's too long
        if (originalText.includes("3D ANIMATION") || 
            originalText.includes("&") || 
            originalText.length > 12 ||
            singleLineWidth > containerWidth * 0.7) {
            // Handle multi-line text with guaranteed spacing
            handleMultiLineText(textElement, originalText, containerHeight, containerWidth);
            return;
        }
        
        // For short text, use standard variable font approach
        let weight = 500; // Start with medium weight
        textElement.style.fontVariationSettings = `'wght' ${weight}`;
        textElement.style.setProperty('--calculated-weight', weight);
        
        // Adjust font size to fit height
        const maxFontSize = containerHeight * 0.8;
        let currentFontSize = parseFloat(getComputedStyle(textElement).fontSize);
        currentFontSize = Math.min(currentFontSize, maxFontSize);
        textElement.style.fontSize = `${currentFontSize}px`;
        
        // Measure text width
        const textWidth = textElement.scrollWidth;
        
        // Scale to fill width
        if (textWidth > 0) {
            const scaleX = (containerWidth * CONFIG.horizontalFill) / textWidth;
            textElement.style.setProperty('--text-scale-x', scaleX.toFixed(3));
            textElement.style.transform = `scale(${scaleX.toFixed(3)}, 1)`;
        }
    }
    
    // Handle text for landscape orientation (prioritize filling width)
    function handleLandscapeText(textElement, containerHeight, containerWidth) {
        // Keep text on a single line in landscape
        textElement.style.whiteSpace = 'nowrap';
        
        // Save original text for reference
        const originalText = textElement.textContent;
        
        // Check if this is a long text that might need to be broken on narrow screens
        const isLongText = originalText.length > 15 || originalText.includes("&");
        
        // Use 80% of container height for font size
        let fontSize = Math.floor(containerHeight * 0.85);
        textElement.style.fontSize = `${fontSize}px`;
        
        // Start with a middle weight
        let weight = 400;
        textElement.style.fontVariationSettings = `'wght' ${weight}`;
        textElement.style.setProperty('--calculated-weight', weight);
        
        // Get initial text width
        let textWidth = textElement.offsetWidth;
        
        // Check if we need to break to multiple lines even in landscape
        if (isLongText && textWidth > containerWidth * 1.2) {
            handleMultiLineText(textElement, originalText, containerHeight, containerWidth);
            return;
        }
        
        // Binary search for optimal weight
        let minWeight = 100;
        let maxWeight = 900;
        let bestWeight = weight;
        let bestDiff = Math.abs(textWidth - containerWidth);
        
        // 8 iterations is typically enough to get very close
        for (let i = 0; i < 8; i++) {
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
            
            // Track best result
            const diff = Math.abs(textWidth - containerWidth);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestWeight = weight;
            }
        }
        
        // Apply best weight
        textElement.style.fontVariationSettings = `'wght' ${bestWeight}`;
        textElement.style.setProperty('--calculated-weight', bestWeight);
        
        // Final measurement
        textWidth = textElement.offsetWidth;
        
        // Always apply scaling for consistent width filling
        const scaleX = (containerWidth * CONFIG.horizontalFill) / textWidth;
        textElement.style.setProperty('--text-scale-x', scaleX.toFixed(3));
        textElement.style.transform = `scale(${scaleX.toFixed(3)}, 1)`;
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
    
    // Create a ResizeObserver for precise size tracking
    const resizeObserver = new ResizeObserver(entries => {
        if (!document.documentElement.classList.contains('is-scrolling')) {
            adjustTextSize();
        }
    });
    
    // Observe the categories container
    resizeObserver.observe(document.querySelector('.categories-container'));
    
    // Run multiple adjustments to ensure everything renders correctly
    function runInitialAdjustments() {
        // First pass
        adjustTextSize();
        
        // Additional passes with delays to catch rendering issues
        setTimeout(adjustTextSize, 100);
        setTimeout(adjustTextSize, 500);
        setTimeout(adjustTextSize, 1000);
    }
    
    // Initial adjustment
    runInitialAdjustments();
    
    // Perform continuous adjustment when tab is visible and not scrolling
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let isAdjusting = false;
    
    // Throttled resize handler for better performance
    window.addEventListener('resize', () => {
        if (isAdjusting) return;
        
        isAdjusting = true;
        
        // Clear any existing line breaks during resize
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            if (textElement && textElement.classList.contains('multi-line')) {
                // Store the original text
                const originalText = textElement.textContent.trim();
                
                // Reset to single line temporarily
                textElement.classList.remove('multi-line');
                textElement.innerHTML = originalText;
                textElement.style.whiteSpace = 'nowrap';
            }
        });
        
        // Use double RAF for better rendering
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const currentWidth = window.innerWidth;
                const currentHeight = window.innerHeight;
                
                // Always adjust on resize to handle orientation changes properly
                adjustTextSize();
                lastWidth = currentWidth;
                lastHeight = currentHeight;
                
                isAdjusting = false;
            });
        });
    });
    
    // Clean up observer on page unload
    window.addEventListener('beforeunload', () => {
        resizeObserver.disconnect();
    });
    
    // Add orientation change listener for mobile devices
    window.addEventListener('orientationchange', () => {
        // Reset all text elements
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            if (textElement) {
                const originalText = textElement.innerText.trim();
                textElement.classList.remove('multi-line');
                textElement.innerHTML = originalText;
            }
        });
        
        // Wait for orientation change to complete
        setTimeout(() => {
            adjustTextSize();
            // Force a second adjustment after browser has settled
            setTimeout(adjustTextSize, 200);
            // And a third adjustment after everything is really settled
            setTimeout(adjustTextSize, 500);
        }, 100);
    });
    
    // Final sanity check - make sure all categories are visible after everything else
    setTimeout(() => {
        // Ensure container is scrollable
        const container = document.querySelector('.categories-container');
        container.style.overflowY = 'auto';
        
        // Force all categories to be visible
        categories.forEach(category => {
            category.style.display = 'flex';
            category.style.visibility = 'visible';
            category.style.opacity = '1';
            category.style.minHeight = '80px';
        });
        
        // One last adjustment
        adjustTextSize();
    }, 1500);
});