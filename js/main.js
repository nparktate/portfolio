document.addEventListener('DOMContentLoaded', () => {
    // Get categories and project elements
    const categories = document.querySelectorAll('.category');
    const projectGrid = document.getElementById('project-grid');
    const projectDetails = document.getElementById('project-details');
    
    // Check URL for direct project link
    function checkUrlForProject() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project');
        
        if (projectId) {
            // Open the project directly if specified in URL
            setTimeout(() => openProjectDetails(projectId, true), 300);
        }
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.projectId) {
            // Open the project without adding to history
            openProjectDetails(event.state.projectId, true);
        } else {
            // Close any open category first
            if (activeCategory && activeProjectsContainer) {
                activeCategory.classList.remove('active');
                activeProjectsContainer.classList.remove('active');
                
                // Reset category appearance
                activeCategory.style.width = '';
                const textElement = activeCategory.querySelector('.category-text');
                if (textElement) {
                    textElement.textContent = textElement.getAttribute('data-full-text');
                    textElement.setAttribute('data-current-abbr', 'full-text');
                }
                
                activeCategory = null;
                activeProjectsContainer = null;
            }
            
            // Go back to main view
            projectDetails.classList.remove('active');
            setTimeout(() => {
                projectDetails.classList.add('hidden');
            }, 400);
            
            // Reset title
            document.title = "Nicholas Tate Park | Portfolio";
        }
    });
    
    // Check for direct links on page load
    checkUrlForProject();
    
    // Check URL for direct project link
    function checkUrlForProject() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project');
        
        if (projectId) {
            // Open the project directly if specified in URL
            setTimeout(() => openProjectDetails(projectId, true), 500);
        }
    }
    // Function to detect touch devices
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }
    
    // Store touch capability
    const IS_TOUCH_DEVICE = isTouchDevice();
    // Configuration
    const CONFIG = {
        horizontalFill: 0.95,   // Fill 95% of available width
        minFontSize: 20,        // Minimum font size in pixels
        minCategoryHeight: 80,  // Minimum category height in pixels
        transitionDuration: 200, // Faster transition for smoother changes
        abbreviationLevels: 5,   // Number of abbreviation levels (excluding full text)
        abbreviationBuffer: 0.15, // Reduced buffer size (15%)
        hysteresisBuffer: 0.1,   // Smaller hysteresis buffer (10%) for more responsive changes
        standardScreenWidth: 1024, // Minimum width considered a "standard" screen
        throttleDelay: 100,      // Faster throttling for better response
        resizeThreshold: 20      // Smaller threshold for more responsive recalculation
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
            
            // Store original full text if not already saved
            if (!textElement.getAttribute('data-full-text')) {
                textElement.setAttribute('data-full-text', textElement.textContent);
            }
            
            // Reset to full text for measurement
            if (textElement.getAttribute('data-full-text')) {
                textElement.textContent = textElement.getAttribute('data-full-text');
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
    
    // Function to select the appropriate text abbreviation based on available width
    function selectTextAbbreviation(textElement, containerWidth) {
        // Get the full text as baseline
        const fullText = textElement.getAttribute('data-full-text') || textElement.textContent;
        
        // Use cached temp element if it exists or create a new one
        let tempElement = document.getElementById('text-measure-temp');
        if (!tempElement) {
            tempElement = document.createElement('div');
            tempElement.id = 'text-measure-temp';
            tempElement.style.fontFamily = getComputedStyle(textElement).fontFamily;
            tempElement.style.position = 'absolute';
            tempElement.style.visibility = 'hidden';
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.style.pointerEvents = 'none';
            document.body.appendChild(tempElement);
        }
        
        // Update dynamic styles
        tempElement.style.fontSize = getComputedStyle(textElement).fontSize;
        tempElement.style.fontWeight = getComputedStyle(textElement).fontWeight;
        
        // Get current abbreviation level if any
        const currentAbbr = textElement.getAttribute('data-current-abbr') || 'full-text';
        const currentLevel = currentAbbr === 'full-text' ? 0 : parseInt(currentAbbr.split('-')[1]);
        
        // Check if we're on a standard or large screen
        const isStandardScreen = window.innerWidth >= CONFIG.standardScreenWidth;
        const fitThreshold = isStandardScreen ? 0.85 : 0.9;
        const bufferSize = CONFIG.abbreviationBuffer;
        
        // Simple function to check if text fits
        const doesTextFit = (text, level) => {
            tempElement.textContent = text;
            const width = tempElement.offsetWidth;
            
            // Apply different threshold based on current vs target level
            let threshold = fitThreshold;
            if (currentLevel < level) { // Going to more abbreviated
                threshold += bufferSize;
            } else if (currentLevel > level) { // Going to less abbreviated
                threshold += CONFIG.hysteresisBuffer;
            }
            
            return width <= containerWidth * threshold;
        };
        
        // Optimize by caching abbreviation texts
        const textOptions = [fullText];
        for (let i = 1; i <= CONFIG.abbreviationLevels; i++) {
            textOptions.push(textElement.getAttribute(`data-abbr-${i}`) || fullText);
        }
        
        // Check if we can use full text (level 0)
        if (doesTextFit(textOptions[0], 0)) {
            if (currentAbbr !== 'full-text') {
                textElement.textContent = textOptions[0];
                textElement.setAttribute('data-current-abbr', 'full-text');
            }
            return textOptions[0];
        }
        
        // Try each abbreviation level efficiently
        for (let i = 1; i <= CONFIG.abbreviationLevels; i++) {
            if (!textOptions[i]) continue;
            
            // Skip early abbreviations for "3D ANIMATION & DESIGN" on larger screens
            if (isStandardScreen && fullText.includes("3D ANIMATION") && (i <= 2) && 
                doesTextFit(textOptions[i], i)) {
                continue;
            }
            
            if (doesTextFit(textOptions[i], i)) {
                if (currentAbbr !== `abbr-${i}`) {
                    textElement.textContent = textOptions[i];
                    textElement.setAttribute('data-current-abbr', `abbr-${i}`);
                }
                return textOptions[i];
            }
        }
        
        // If nothing fits, use the shortest abbreviation
        const shortestLevel = CONFIG.abbreviationLevels;
        if (currentAbbr !== `abbr-${shortestLevel}`) {
            textElement.textContent = textOptions[shortestLevel];
            textElement.setAttribute('data-current-abbr', `abbr-${shortestLevel}`);
        }
        
        return textOptions[shortestLevel];
    }
    
    // Handle text for portrait orientation
    function handlePortraitText(textElement, containerHeight, containerWidth) {
        // Always keep text on a single line
        textElement.style.whiteSpace = 'nowrap';
        
        // Select appropriate abbreviation based on available width
        const selectedText = selectTextAbbreviation(textElement, containerWidth);
        textElement.textContent = selectedText;
        
        // Start with a substantial weight
        let weight = 500; // Medium weight
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
        // Always keep text on a single line
        textElement.style.whiteSpace = 'nowrap';
        
        // Select appropriate abbreviation based on available width
        const selectedText = selectTextAbbreviation(textElement, containerWidth);
        textElement.textContent = selectedText;
        
        // Use 80% of container height for font size
        let fontSize = Math.floor(containerHeight * 0.85);
        textElement.style.fontSize = `${fontSize}px`;
        
        // Start with a middle weight
        let weight = 400;
        textElement.style.fontVariationSettings = `'wght' ${weight}`;
        textElement.style.setProperty('--calculated-weight', weight);
        
        // Get initial text width
        let textWidth = textElement.offsetWidth;
        
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
                
                // Reset previous category appearance with animation
                activeCategory.style.transition = 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                activeCategory.style.width = '';
                
                // Use requestAnimationFrame for better performance
                requestAnimationFrame(() => {
                    const prevText = activeCategory.querySelector('.category-text');
                    if (prevText && prevText.getAttribute('data-full-text')) {
                        prevText.style.transition = 'font-variation-settings 0.3s ease';
                        prevText.textContent = prevText.getAttribute('data-full-text');
                        prevText.setAttribute('data-current-abbr', 'full-text');
                    }
                });
            }
            
            // Handle mobile differently for better experience
            const isMobile = window.innerWidth <= 768;
            
            // Add immediate transition for responsive feel
            category.style.transition = 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
            
            // Don't toggle on touch if we already clicked - prevents double-tap issues
            if (IS_TOUCH_DEVICE && category.classList.contains('active')) {
                return;
            }
            
            // Toggle active state
            category.classList.toggle('active');
            
            // Update active elements and adjust appearance
            if (category.classList.contains('active')) {
                // Activate projects container with slight delay for smoother sequence
                setTimeout(() => {
                    projectsContainer.classList.add('active');
                    
                    // Apply variable font styling to projects
                    styleProjectsWithVariableFont(projectsContainer);
                }, isMobile ? 50 : 20);
                
                activeCategory = category;
                activeProjectsContainer = projectsContainer;
                
                // Set category width immediately
                category.style.width = isMobile ? '40%' : '50%';
                
                // Use a more abbreviated form and bolder weight for the active category
                const textElement = category.querySelector('.category-text');
                if (textElement) {
                    textElement.style.transition = 'font-variation-settings 0.25s ease';
                    const abbrText = textElement.getAttribute('data-abbr-1') || textElement.textContent;
                    textElement.textContent = abbrText;
                    textElement.setAttribute('data-current-abbr', 'abbr-1');
                    textElement.style.fontVariationSettings = `'wght' 700`;
                }
            } else {
                // Deactivate projects container immediately
                projectsContainer.classList.remove('active');
                
                // Reset category appearance
                category.style.width = '';
                
                const textElement = category.querySelector('.category-text');
                if (textElement && textElement.getAttribute('data-full-text')) {
                    textElement.style.transition = 'font-variation-settings 0.25s ease';
                    textElement.textContent = textElement.getAttribute('data-full-text');
                    textElement.setAttribute('data-current-abbr', 'full-text');
                    textElement.style.fontVariationSettings = `'wght' 400`;
                }
                
                activeCategory = null;
                activeProjectsContainer = null;
                
                // Re-adjust text size to ensure correct display
                requestAnimationFrame(adjustTextSize);
            }
        });
    });
    
    // Apply variable font styling to projects - optimized for performance
    function styleProjectsWithVariableFont(container) {
        if (!container) return;
        
        const projects = container.querySelectorAll('.project-item');
        const containerWidth = container.offsetWidth - 40; // Account for padding
        
        // Pre-calculate common values
        const totalProjects = projects.length;
        const baseDelay = 50; // Shorter base delay for more responsive feel
        
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            // Stagger animation for projects
            projects.forEach((project, index) => {
                // Reset style
                project.style.opacity = '0';
                project.style.transform = 'translateX(10px)'; // Smaller initial offset
                
                // Set consistent height without complex calculation
                project.style.height = 'auto'; // Let content determine height
                
                // Set consistent font size
                project.style.fontSize = 'clamp(0.9rem, 1.5vw, 1.2rem)'; // Responsive font size using CSS
                
                // Simplified weight variation
                const weight = 400 + (index * 20) % 200; // Lighter weight variation
                project.style.fontVariationSettings = `'wght' ${weight}`;
                
                // Queue entrance animation with staggered delay
                setTimeout(() => {
                    project.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                    project.style.opacity = '1';
                    project.style.transform = 'translateX(0)';
                }, baseDelay + (index * 30)); // Faster, shorter staggered delay
            });
        });
    }
    
    // Function to open project details
    function openProjectDetails(projectId, skipHistory = false) {
        // Update URL for direct linking
        if (!skipHistory) {
            const newUrl = `${window.location.pathname}?project=${encodeURIComponent(projectId)}`;
            history.pushState({ projectId }, '', newUrl);
        } else if (window.UrlHandler) {
            // Update URL without adding to history if using UrlHandler
            window.UrlHandler.setProject(projectId);
        }
    
        // Create portal effect when navigating to project
        const portalEffect = () => {
            // First hide any active category panels with animation
            if (activeCategory && activeProjectsContainer) {
                // Animate category width back to full first
                activeCategory.style.transition = 'width 0.3s ease-out';
                activeCategory.style.width = '';
            
                // After width animation, remove active class
                setTimeout(() => {
                    activeCategory.classList.remove('active');
                    activeProjectsContainer.classList.remove('active');
                
                    // Reset category text
                    const textElement = activeCategory.querySelector('.category-text');
                    if (textElement && textElement.getAttribute('data-full-text')) {
                        textElement.textContent = textElement.getAttribute('data-full-text');
                        textElement.setAttribute('data-current-abbr', 'full-text');
                    }
                }, 300);
            }
        
            // Show loading effect before project details
            const loaderElement = document.createElement('div');
            loaderElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
        
            const loaderInner = document.createElement('div');
            loaderInner.style.cssText = `
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255,255,255,0.2);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s ease-in-out infinite;
            `;
        
            // Add keyframes for loader animation
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleElement);
        
            loaderElement.appendChild(loaderInner);
            document.body.appendChild(loaderElement);
        
            // Fade in loader
            setTimeout(() => {
                loaderElement.style.opacity = '1';
            
                // Show project details with animation after short delay
                setTimeout(() => {
                    loaderElement.style.opacity = '0';
                    document.title = `${projectId.replace(/-/g, ' ')} | Nicholas Tate Park`;
                    projectDetails.classList.remove('hidden');
                    projectDetails.classList.add('active');
                    
                    // Remove loader after transition
                    setTimeout(() => {
                        document.body.removeChild(loaderElement);
                    }, 300);
                }, 400);
            }, 10);
        };
    
        // Start portal transition
        portalEffect();
        
        // Generate dynamic color based on project ID
        const projectHue = (projectId.charCodeAt(0) * projectId.length) % 360;
        const secondaryHue = (projectHue + 180) % 360;
        
        // Create content for project details
        projectDetails.innerHTML = `
            <div class="project-header">
                <button class="back-button">← Back</button>
                <h2>${projectId.replace(/-/g, ' ')}</h2>
            </div>
            <div class="project-content">
                <div class="project-hero" style="background-color: hsl(${projectHue}, 70%, 10%)">
                    <div class="hero-content">
                        <h1>${projectId.split('-').pop()}</h1>
                        <div class="hero-image" style="background-color: hsl(${projectHue}, 80%, 70%)"></div>
                    </div>
                </div>
                <div class="project-description">
                    <h3>About this project</h3>
                    <p>This is an experimental project by Nicholas Tate Park. Super dynamic responsive layout demonstration.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                    
                    <div class="project-details-grid">
                        <div class="detail-item" style="background-color: hsl(${projectHue}, 40%, 20%)">
                            <h4>Role</h4>
                            <p>Motion Design</p>
                        </div>
                        <div class="detail-item" style="background-color: hsl(${secondaryHue}, 40%, 20%)">
                            <h4>Year</h4>
                            <p>2024</p>
                        </div>
                        <div class="detail-item" style="background-color: hsl(${projectHue + 60}, 40%, 20%)">
                            <h4>Tools</h4>
                            <p>After Effects, Blender</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Style the project page elements
        const projectHeader = projectDetails.querySelector('.project-header');
        projectHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        `;
        
        const projectHero = projectDetails.querySelector('.project-hero');
        projectHero.style.cssText = `
            width: 100%;
            height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            border-radius: 8px;
            overflow: hidden;
        `;
        
        const heroContent = projectDetails.querySelector('.hero-content');
        heroContent.style.cssText = `
            width: 80%;
            height: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;
        
        const heroImage = projectDetails.querySelector('.hero-image');
        heroImage.style.cssText = `
            width: 100%;
            height: 400px;
            border-radius: 4px;
            margin-top: 2rem;
        `;
        
        const projectGrid = projectDetails.querySelector('.project-details-grid');
        projectGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        `;
        
        const detailItems = projectDetails.querySelectorAll('.detail-item');
        detailItems.forEach(item => {
            item.style.cssText = `
                padding: 1.5rem;
                border-radius: 4px;
                transition: transform 0.3s ease;
            `;
            
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
            });
        });
        
        // Add back button functionality
        const backButton = projectDetails.querySelector('.back-button');
        backButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background 0.3s ease;
        `;
        
        backButton.addEventListener('mouseenter', () => {
            backButton.style.background = 'rgba(255,255,255,0.1)';
        });
        
        backButton.addEventListener('mouseleave', () => {
            backButton.style.background = 'none';
        });
        
        backButton.addEventListener('click', () => {
            // Update URL to remove project parameter
            if (window.UrlHandler) {
                window.UrlHandler.clearProject();
            } else {
                history.pushState({}, '', window.location.pathname);
            }
            document.title = "Nicholas Tate Park | Portfolio";
            
            // Create transition effect for going back
            const transitionOut = document.createElement('div');
            transitionOut.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #0a0a0a;
                z-index: 9998;
                transform: translateY(100%);
                transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            `;
            document.body.appendChild(transitionOut);
            
            // Start transition animation
            setTimeout(() => {
                transitionOut.style.transform = 'translateY(0)';
                
                // Hide project details during transition
                setTimeout(() => {
                    projectDetails.classList.remove('active');
                    projectDetails.classList.add('hidden');
                    
                    // Complete transition and remove overlay
                    setTimeout(() => {
                        // Reactivate previous category and project container if they exist
                        if (activeCategory && activeProjectsContainer) {
                            activeCategory.classList.add('active');
                            activeProjectsContainer.classList.add('active');
                            
                            // Set category width with animation
                            const isMobile = window.innerWidth <= 768;
                            activeCategory.style.width = isMobile ? '40%' : '50%';
                            
                            // Use abbreviation for active category
                            const textElement = activeCategory.querySelector('.category-text');
                            if (textElement) {
                                const abbrText = textElement.getAttribute('data-abbr-1') || textElement.textContent;
                                textElement.textContent = abbrText;
                                textElement.setAttribute('data-current-abbr', 'abbr-1');
                            }
                            
                            // Apply variable font styling to projects again
                            styleProjectsWithVariableFont(activeProjectsContainer);
                        }
                        
                        // Complete transition
                        transitionOut.style.transform = 'translateY(-100%)';
                        setTimeout(() => {
                            document.body.removeChild(transitionOut);
                        }, 500);
                    }, 300);
                }, 250);
            }, 10);
        });
    }
    
    // Debounce function with immediate flag for more responsive UI
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Throttle function for smooth performance during continuous events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
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
    
    // Handle scroll events with throttling for smoother performance
    const throttledScroll = throttle(() => {
        document.documentElement.classList.add('is-scrolling');
    }, 50);
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        throttledScroll();
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.documentElement.classList.remove('is-scrolling');
            // Recalculate after scrolling stops
            requestAnimationFrame(adjustTextSize);
        }, 100);
    });
    
    // Handle resize with both immediate response and cleanup
    const debouncedResize = debounce(() => {
        requestAnimationFrame(() => {
            adjustTextSize();
            
            // Remove transitions after adjustment
            setTimeout(() => {
                categories.forEach(category => {
                    const textElement = category.querySelector('.category-text');
                    textElement.style.transition = '';
                });
            }, CONFIG.transitionDuration);
        });
    }, 60, true); // Execute immediately for responsive feel
    
    window.addEventListener('resize', () => {
        // Add transition temporarily for smooth resizing
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            textElement.style.transition = `all ${CONFIG.transitionDuration/1000}s ease`;
        });
        
        debouncedResize();
    });
    
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
    
    // Improved resize handler with throttling to prevent jank
    let resizeTimeout;
    let throttleTimer = null;
    
    function handleResize() {
        if (isAdjusting) return;
        
        isAdjusting = true;
        
        // Cancel previous timeout
        clearTimeout(resizeTimeout);
        
        // Get current dimensions
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
            
        // Prevent text selection on mobile
        if (IS_TOUCH_DEVICE) {
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.msUserSelect = 'none';
            document.body.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
        }
            
        // Perform adjustment without any transitions
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            if (textElement) {
                // Remove any transition classes
                textElement.classList.remove(CONFIG.transitionClass);
            }
        });
        
        // Adjust text sizing
        adjustTextSize();
        lastWidth = currentWidth;
        lastHeight = currentHeight;
        
        // Set a timeout to release the adjustment lock with longer delay
        resizeTimeout = setTimeout(() => {
            isAdjusting = false;
        }, 200);
    }
    
    // Use ResizeObserver instead of multiple resize handlers for better performance
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(throttle(() => {
            if (!document.documentElement.classList.contains('is-scrolling')) {
                requestAnimationFrame(adjustTextSize);
            }
        }, 100));
        
        // Observe the categories container only
        resizeObserver.observe(document.querySelector('.categories-container'));
        
        // Clean up observer on page unload
        window.addEventListener('beforeunload', () => {
            resizeObserver.disconnect();
        });
    }
    
    // Clean up observer on page unload
    window.addEventListener('beforeunload', () => {
        resizeObserver.disconnect();
    });
    
    // Fix mobile overflow issues
    function fixMobileOverflow() {
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            
            const container = document.querySelector('.categories-container');
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';
            container.style.right = '0';
            container.style.bottom = '0';
            container.style.width = '100%';
            container.style.maxWidth = '100%';
            container.style.height = '100%';
            container.style.overflow = 'auto';
            
            // Ensure projects containers don't overflow
            document.querySelectorAll('.projects-container').forEach(container => {
                container.style.maxWidth = '60%';
                container.style.width = '60%';
            });
            
            // Prevent text selection on mobile
            document.querySelectorAll('.category-text').forEach(text => {
                text.style.userSelect = 'none';
                text.style.webkitUserSelect = 'none';
                text.style.msUserSelect = 'none';
                text.style.cursor = 'pointer';
            });
        }
    }
    
    // Run fix on load and resize
    if (IS_TOUCH_DEVICE) {
        fixMobileOverflow();
        window.addEventListener('resize', fixMobileOverflow);
    }
    
    // Add orientation change listener for mobile devices
    window.addEventListener('orientationchange', () => {
        // Show orientation change animation
        const orientationTransition = document.createElement('div');
        orientationTransition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const transitionText = document.createElement('div');
        transitionText.textContent = 'Adjusting layout...';
        transitionText.style.cssText = `
            color: white;
            font-family: 'Archivo', sans-serif;
            font-size: 18px;
            font-variation-settings: 'wght' 400;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        
        orientationTransition.appendChild(transitionText);
        document.body.appendChild(orientationTransition);
        
        // Show transition
        setTimeout(() => {
            orientationTransition.style.opacity = '1';
            setTimeout(() => {
                transitionText.style.opacity = '1';
                transitionText.style.transform = 'translateY(0)';
            }, 100);
        }, 10);
        
        // Reset all text elements
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            if (textElement) {
                // Reset to full text from data attribute
                const fullText = textElement.getAttribute('data-full-text');
                if (fullText) {
                    textElement.textContent = fullText;
                }
                // Remove any transition markers
                textElement.removeAttribute('data-current-abbr');
            }
            
            // Close any open categories on orientation change to prevent layout issues
            if (category.classList.contains('active')) {
                category.classList.remove('active');
                category.style.width = '';
                
                // Find and close the related projects container
                const categoryId = category.getAttribute('data-category');
                const projectsContainer = document.querySelector(`.projects-container[data-for="${categoryId}"]`);
                if (projectsContainer) {
                    projectsContainer.classList.remove('active');
                }
            }
        });
        
        // Reset active state tracking
        activeCategory = null;
        activeProjectsContainer = null;
        
        // Hide project details if visible
        if (projectDetails && !projectDetails.classList.contains('hidden')) {
            projectDetails.classList.remove('active');
            projectDetails.classList.add('hidden');
        }
        
        // Wait for orientation change to fully complete before adjusting
        setTimeout(() => {
            // Record new width for threshold checks
            lastRecordedWidth = window.innerWidth;
            
            // Apply specific fixes for mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflowX = 'hidden';
                document.documentElement.style.overflowX = 'hidden';
                const container = document.querySelector('.categories-container');
                container.style.width = '100%';
                container.style.maxWidth = '100vw';
                container.style.overflowX = 'hidden';
            }
            
            // Single adjustment with longer delay to ensure layout is settled
            adjustTextSize();
            
            // Hide transition with delay
            setTimeout(() => {
                orientationTransition.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(orientationTransition);
                }, 300);
            }, 300);
        }, 500);
    });
    
    // Register touch events for better mobile interaction
    if (IS_TOUCH_DEVICE) {
        categories.forEach(category => {
            // Prevent default touch behaviors
            category.addEventListener('touchstart', (e) => {
                // Allow scrolling but prevent other behaviors
                if (e.touches.length === 1) {
                    e.stopPropagation();
                }
            }, { passive: true });
            
            // Use touchend instead of click for more responsive feel on touch devices
            category.addEventListener('touchend', (e) => {
                if (!category.classList.contains('active')) {
                    // Only prevent default if we're activating (allow scrolling otherwise)
                    e.preventDefault();
                    // Trigger click programmatically
                    category.click();
                }
            });
        });
        
        // Disable text selection on mobile
        document.addEventListener('selectstart', (e) => {
            const target = e.target;
            // Don't prevent selection in input fields
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // Final sanity check - make sure all categories are visible after everything else
    // Fix mobile overflow issues
    function fixMobileOverflow() {
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            
            const container = document.querySelector('.categories-container');
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';
            container.style.right = '0';
            container.style.bottom = '0';
            container.style.width = '100%';
            container.style.maxWidth = '100%';
            container.style.height = '100%';
            container.style.overflow = 'auto';
            
            // Ensure projects containers don't overflow
            document.querySelectorAll('.projects-container').forEach(container => {
                container.style.maxWidth = '60%';
                container.style.width = '60%';
            });
            
            // Prevent text selection on mobile
            document.querySelectorAll('.category-text').forEach(text => {
                text.style.userSelect = 'none';
                text.style.webkitUserSelect = 'none';
                text.style.msUserSelect = 'none';
                text.style.cursor = 'pointer';
            });
        }
    }
    
    // Run fix on load and resize
    if (isTouchDevice()) {
        fixMobileOverflow();
        window.addEventListener('resize', fixMobileOverflow);
    }
    
    setTimeout(() => {
        // Ensure container is scrollable
        const container = document.querySelector('.categories-container');
        container.style.overflowY = 'auto';
        
        // Fix for mobile - ensure NO categories are active on initial load
        if (window.innerWidth <= 768) {
            activeCategory = null;
            activeProjectsContainer = null;
        }
        
        // Force all categories to be visible
        categories.forEach(category => {
            category.style.display = 'flex';
            category.style.visibility = 'visible';
            category.style.opacity = '1';
            category.style.minHeight = '80px';
            
            // Reset ALL categories on mobile to prevent accidental open state
            if (window.innerWidth <= 768) {
                category.classList.remove('active');
                category.style.width = '';
                    
                // Find and close the related projects container
                const categoryId = category.getAttribute('data-category');
                const projectsContainer = document.querySelector(`.projects-container[data-for="${categoryId}"]`);
                if (projectsContainer) {
                    projectsContainer.classList.remove('active');
                }
            } else if (category.classList.contains('active')) {
                // On desktop, only allow one active category
                if (activeCategory && activeCategory !== category) {
                    category.classList.remove('active');
                    category.style.width = '';
                    
                    // Find and close the related projects container
                    const categoryId = category.getAttribute('data-category');
                    const projectsContainer = document.querySelector(`.projects-container[data-for="${categoryId}"]`);
                    if (projectsContainer) {
                        projectsContainer.classList.remove('active');
                    }
                }
            }
            
            // Make sure we're using less abbreviation on larger screens
            if (window.innerWidth >= CONFIG.standardScreenWidth) {
                const textElement = category.querySelector('.category-text');
                if (textElement && textElement.getAttribute('data-current-abbr') &&
                    textElement.getAttribute('data-current-abbr').startsWith('abbr-') &&
                    parseInt(textElement.getAttribute('data-current-abbr').split('-')[1]) <= 2) {
                    // Reset to full text on standard screens
                    textElement.textContent = textElement.getAttribute('data-full-text');
                    textElement.setAttribute('data-current-abbr', 'full-text');
                }
            }
        });
        
        // Fix mobile specific issues
        if (window.innerWidth <= 768) {
            // Apply comprehensive mobile fixes
            fixMobileOverflow();
            
            // Ensure all projects containers are closed on mobile load
            document.querySelectorAll('.projects-container').forEach(container => {
                container.classList.remove('active');
                container.style.transform = 'translateX(100%)';
                container.style.opacity = '0';
            });
            
            // Add necessary CSS to prevent horizontal overflow
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    body, html {
                        max-width: 100%;
                        width: 100%;
                        overflow-x: hidden;
                        position: fixed;
                        touch-action: pan-y;
                        -webkit-overflow-scrolling: touch;
                    }
                    .categories-container {
                        max-width: 100%;
                        width: 100%;
                        overflow-x: hidden;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                    .projects-container {
                        max-width: 60%;
                        width: 60%;
                    }
                    .category, .category-text {
                        user-select: none;
                        -webkit-user-select: none;
                        -ms-user-select: none;
                        -webkit-tap-highlight-color: rgba(0,0,0,0);
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Fix for devices with notches and safe areas
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
            }
        }
        
        // One last adjustment with a slight delay for better initial rendering
        adjustTextSize();
        
        // Additional adjustment for mobile after everything has settled
        if (IS_TOUCH_DEVICE) {
            setTimeout(adjustTextSize, 300);
            setTimeout(fixMobileOverflow, 500);
        }
    }, 1000);
});