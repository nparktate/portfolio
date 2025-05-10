document.addEventListener('DOMContentLoaded', () => {
    // Get categories and project elements
    const categories = document.querySelectorAll('.category');
    const projectGrid = document.getElementById('project-grid');
    const projectDetails = document.getElementById('project-details');
    
    // Configuration
    const CONFIG = {
        horizontalFill: 0.95,   // Fill 95% of available width
        minFontSize: 20,        // Minimum font size in pixels
        minCategoryHeight: 80,  // Minimum category height in pixels
        transitionDuration: 300, // Transition duration in ms for smooth text changes
        abbreviationLevels: 5,   // Number of abbreviation levels (excluding full text)
        abbreviationBuffer: 0.35, // Even larger buffer to prevent flickering between states (35%)
        hysteresisBuffer: 0.2, // Much larger buffer when growing vs shrinking (20%)
        standardScreenWidth: 1024, // Minimum width considered a "standard" screen
        throttleDelay: 200, // Longer delay for throttling resize events
        resizeThreshold: 40 // Much larger minimum px change before recalculating abbreviations
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
        
        // Create a temporary element to measure text widths
        const tempElement = document.createElement('div');
        tempElement.style.fontFamily = getComputedStyle(textElement).fontFamily;
        tempElement.style.fontSize = getComputedStyle(textElement).fontSize;
        tempElement.style.fontWeight = getComputedStyle(textElement).fontWeight;
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.whiteSpace = 'nowrap';
        document.body.appendChild(tempElement);
        
        // Get current abbreviation level if any
        const currentAbbr = textElement.getAttribute('data-current-abbr') || 'full-text';
        
        // Check if we're on a standard or large screen
        const isStandardScreen = window.innerWidth >= CONFIG.standardScreenWidth;
        
        // Large buffer to prevent rapid switching, asymmetric for growing vs shrinking
        const fitThreshold = isStandardScreen ? 0.8 : 0.85; // Base threshold
        const bufferSize = CONFIG.abbreviationBuffer;
        
        // Apply different buffers depending on whether we're growing or shrinking text
        // Larger buffer when growing (harder to grow) vs shrinking (harder to shrink)
        // This creates a hysteresis effect to prevent flickering at boundary points
        const growingText = i => currentAbbr !== 'full-text' && (
            (currentAbbr === 'full-text' && i > 0) || 
            (currentAbbr.startsWith('abbr-') && parseInt(currentAbbr.split('-')[1]) > i)
        );
        const shrinkingText = i => currentAbbr !== `abbr-${CONFIG.abbreviationLevels}` && (
            (currentAbbr === 'full-text' && i > 0) ||
            (currentAbbr.startsWith('abbr-') && parseInt(currentAbbr.split('-')[1]) < i)
        );
        
        // Store current level for hysteresis calculation
        const currentLevel = currentAbbr === 'full-text' ? 0 : 
                            parseInt(currentAbbr.split('-')[1]);
        
        // Measure full text width
        tempElement.textContent = fullText;
        let textWidth = tempElement.offsetWidth;
        
        // Special handling for large screens - prefer full text with much larger buffer
        if (isStandardScreen && currentLevel <= 1) {
            // On standard screens, give full text extra room
            if (textWidth <= containerWidth * (fitThreshold + 0.4)) {
                document.body.removeChild(tempElement);
                
                // Only change if not already at full text
                if (currentAbbr !== 'full-text') {
                    // Set full text without transitions
                    textElement.textContent = fullText;
                    textElement.removeAttribute('data-current-abbr');
                    textElement.setAttribute('data-current-abbr', 'full-text');
                }
                
                return fullText;
            }
        }
        // Regular check if full text fits (with large growing buffer)
        else if (textWidth <= containerWidth * (fitThreshold + bufferSize + CONFIG.hysteresisBuffer)) {
            // Full text fits, use it
            document.body.removeChild(tempElement);
            
            // Only change if not already at full text
            if (currentAbbr !== 'full-text') {
                // Set full text without transitions
                textElement.textContent = fullText;
                textElement.removeAttribute('data-current-abbr');
                textElement.setAttribute('data-current-abbr', 'full-text');
            }
            
            return fullText;
        }
        
        // Try each abbreviation level
        for (let i = 1; i <= CONFIG.abbreviationLevels; i++) {
            const abbrText = textElement.getAttribute(`data-abbr-${i}`);
            if (!abbrText) continue;
            
            tempElement.textContent = abbrText;
            textWidth = tempElement.offsetWidth;
            
            // Apply strong hysteresis to prevent flickering
            // Make it much harder to change states when near boundaries
            let effectiveThreshold = fitThreshold;
            
            // Apply extreme hysteresis - create a massive dead zone at boundaries to prevent flickering
                if (currentLevel < i) { // Growing - make it much harder to grow
                    effectiveThreshold += bufferSize + (CONFIG.hysteresisBuffer * 2);
                } else if (currentLevel > i) { // Shrinking - make it much harder to shrink
                    effectiveThreshold += bufferSize - (CONFIG.hysteresisBuffer / 2);
                } else { // Staying the same - huge buffer
                    effectiveThreshold += bufferSize * 1.5;
                }
            
            // Special case for standard screens - avoid early abbreviations for "3D ANIMATION & DESIGN"
            if (isStandardScreen && fullText.includes("3D ANIMATION") && (i <= 2) && textWidth <= containerWidth) {
                continue;
            }
            
            // If this abbreviation fits, use it
            if (textWidth <= containerWidth * effectiveThreshold) {
                document.body.removeChild(tempElement);
                
                // Only change if not already at this level
                if (currentAbbr !== `abbr-${i}`) {
                    // Set abbreviation without transitions
                    textElement.textContent = abbrText;
                    textElement.removeAttribute('data-current-abbr');
                    textElement.setAttribute('data-current-abbr', `abbr-${i}`);
                }
                
                return abbrText;
            }
        }
        
        // If nothing fits, use the shortest abbreviation
        const shortestAbbr = textElement.getAttribute(`data-abbr-${CONFIG.abbreviationLevels}`) || fullText;
        document.body.removeChild(tempElement);
        
        // Only change if not already at shortest level
        if (currentAbbr !== `abbr-${CONFIG.abbreviationLevels}`) {
            // Set shortest abbreviation without transitions
            textElement.textContent = shortestAbbr;
            textElement.removeAttribute('data-current-abbr');
            textElement.setAttribute('data-current-abbr', `abbr-${CONFIG.abbreviationLevels}`);
        }
        
        return shortestAbbr;
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
                
                // Reset previous category appearance
                activeCategory.style.width = '';
                const prevText = activeCategory.querySelector('.category-text');
                if (prevText && prevText.getAttribute('data-full-text')) {
                    prevText.textContent = prevText.getAttribute('data-full-text');
                    prevText.setAttribute('data-current-abbr', 'full-text');
                }
            }
            
            // Toggle active state
            category.classList.toggle('active');
            projectsContainer.classList.toggle('active');
            
            // Update active elements and adjust appearance
            if (category.classList.contains('active')) {
                activeCategory = category;
                activeProjectsContainer = projectsContainer;
                
                // Set category width (instead of transform)
                const isMobile = window.innerWidth <= 768;
                category.style.width = isMobile ? '40%' : '50%';
                
                // Use a more abbreviated form and bolder weight for the active category
                const textElement = category.querySelector('.category-text');
                if (textElement) {
                    const abbrText = textElement.getAttribute('data-abbr-1') || textElement.textContent;
                    textElement.textContent = abbrText;
                    textElement.setAttribute('data-current-abbr', 'abbr-1');
                    textElement.style.fontVariationSettings = `'wght' 700`;
                }
                
                // Apply variable font styling to projects
                styleProjectsWithVariableFont(projectsContainer);
            } else {
                // Reset category appearance
                category.style.width = '';
                const textElement = category.querySelector('.category-text');
                if (textElement && textElement.getAttribute('data-full-text')) {
                    textElement.textContent = textElement.getAttribute('data-full-text');
                    textElement.setAttribute('data-current-abbr', 'full-text');
                }
                
                activeCategory = null;
                activeProjectsContainer = null;
            }
        });
    });
    
    // Apply variable font styling to projects
    function styleProjectsWithVariableFont(container) {
        if (!container) return;
        
        const projects = container.querySelectorAll('.project-item');
        const containerWidth = container.offsetWidth - 40; // Account for padding
        
        // Stagger animation for projects
        projects.forEach((project, index) => {
            // Reset style first
            project.style.opacity = '0';
            project.style.transform = 'translateX(20px)';
            
            // Calculate available height
            const projectHeight = Math.floor(container.offsetHeight / projects.length) - 20;
            project.style.height = `${projectHeight}px`;
            
            // Set font size based on height
            const fontSize = Math.floor(projectHeight * 0.4);
            project.style.fontSize = `${fontSize}px`;
            
            // Get text width
            const textWidth = project.offsetWidth;
            
            // Apply scaling to fill width
            if (textWidth > 0) {
                const scaleX = (containerWidth * 0.9) / textWidth;
                const scale = scaleX < 1 ? scaleX : 1;
                project.style.transform = `translateX(20px) scaleX(${scale})`;
                project.style.transformOrigin = 'left center';
            }
            
            // Apply variable weight - slightly more variation
            const weight = 300 + (index * 75) % 400; // Vary weights between projects
            project.style.fontVariationSettings = `'wght' ${weight}`;
            
            // Staggered entrance animation
            setTimeout(() => {
                project.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                project.style.opacity = '1';
                
                // Extract current scale if it exists
                const currentTransform = project.style.transform;
                let scale = '1';
                if (currentTransform && currentTransform.includes('scaleX')) {
                    const match = currentTransform.match(/scaleX\(([0-9.]+)\)/);
                    if (match && match[1]) {
                        scale = match[1];
                    }
                }
                
                project.style.transform = `translateX(0) scaleX(${scale})`;
            }, 100 + (index * 50)); // Stagger by 50ms per item
        });
    }
    
    // Function to open project details
    function openProjectDetails(projectId) {
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
    
    // Debounce function to prevent excessive calculations
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Completely removed interactive typography effects that cause stuttering
    // Only keep simple hover states managed by CSS
    
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
    
    // Heavily throttled resize handler with large width threshold to prevent micro-adjustments
    let lastRecordedWidth = window.innerWidth;
    let resizeCounter = 0;
    
    window.addEventListener('resize', () => {
        // Only recalculate if width changed by significant amount
        const currentWidth = window.innerWidth;
        const widthDiff = Math.abs(currentWidth - lastRecordedWidth);
        
        // Skip more aggressively during rapid resizing
        resizeCounter++;
        if (widthDiff < CONFIG.resizeThreshold || (resizeCounter % 3 !== 0 && widthDiff < 100)) {
            return; // Skip if change is too small or during rapid resize
        }
        
        if (throttleTimer === null) {
            lastRecordedWidth = currentWidth;
            handleResize();
            
            // Reset throttle timer with longer delay
            throttleTimer = setTimeout(() => {
                throttleTimer = null;
                resizeCounter = 0;
                // Final adjustment after throttle
                if (!isAdjusting) {
                    lastRecordedWidth = window.innerWidth;
                    adjustTextSize();
                }
            }, CONFIG.throttleDelay * 2);
        }
    });
    
    // Clean up observer on page unload
    window.addEventListener('beforeunload', () => {
        resizeObserver.disconnect();
    });
    
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
    
    // Final sanity check - make sure all categories are visible after everything else
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
            // Ensure no horizontal scrolling
            document.body.style.overflowX = 'hidden';
            document.documentElement.style.overflowX = 'hidden';
            container.style.width = '100%';
            container.style.maxWidth = '100vw';
            container.style.overflowX = 'hidden';
            
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
                    body, html { max-width: 100vw; overflow-x: hidden; }
                    .categories-container { max-width: 100vw; overflow-x: hidden; }
                    .projects-container { max-width: 60vw; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // One last adjustment
        adjustTextSize();
    }, 1500);
});