document.addEventListener('DOMContentLoaded', () => {
    // Get all category elements
    const categories = document.querySelectorAll('.category');
    const projectGrid = document.getElementById('project-grid');
    const projectDetails = document.getElementById('project-details');
    
    // Create text elements inside categories
    categories.forEach(category => {
        const text = document.createElement('div');
        text.classList.add('category-text');
        text.textContent = category.textContent;
        category.textContent = ''; // Clear the original content
        category.appendChild(text);
        
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
    
    // Function to adjust text size to fill container - hyper responsive
    function adjustTextSize() {
        // Check if we're in portrait mode for different text handling
        const isPortrait = window.innerHeight > window.innerWidth;
        
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            const containerHeight = category.offsetHeight;
            const containerWidth = category.offsetWidth;
            
            // Start with a base size based on container height
            let fontSize = Math.floor(containerHeight * (isPortrait ? 0.7 : 0.85)); // Adjust for portrait mode
            textElement.style.fontSize = `${fontSize}px`;
            
            // Set minimum weight to prevent super thin text
            let weight = 300; // Start with a more substantial weight
            
            // In portrait mode, handle line breaks differently
            if (isPortrait) {
                textElement.style.whiteSpace = 'normal';
                // For portrait/vertical orientation, prioritize readability over filling width
                weight = 500; // Use a more readable weight
                textElement.style.fontVariationSettings = `'wght' ${weight}`;
                // Skip the complex scaling/transformation
                textElement.style.transform = 'none';
                return;
            }
            
            // For landscape, continue with responsive sizing
            textElement.style.whiteSpace = 'nowrap';
            textElement.style.fontVariationSettings = `'wght' ${weight}`;
            
            // Measure and adjust
            let textWidth = textElement.offsetWidth;
            const targetWidth = containerWidth * 0.95; // Target 95% of container width
            
            // Increase weight until optimal filling
            while (textWidth < targetWidth && weight < 900) {
                weight += 25;
                textElement.style.fontVariationSettings = `'wght' ${weight}`;
                textElement.style.setProperty('--calculated-weight', weight);
                textWidth = textElement.offsetWidth;
                
                if (weight >= 900) break;
                if (textWidth > targetWidth) {
                    // We went too far, step back
                    weight -= 25;
                    textElement.style.fontVariationSettings = `'wght' ${weight}`;
                    textElement.style.setProperty('--calculated-weight', weight);
                    break;
                }
            }
            
            // Fine-tune letter spacing if needed
            if (textWidth < targetWidth * 0.9) {
                // Text is too small, add letter spacing
                let letterSpacing = 0;
                while (textWidth < targetWidth * 0.95 && letterSpacing < 0.1) { // Reduced max letter spacing
                    letterSpacing += 0.01;
                    textElement.style.letterSpacing = `${letterSpacing}em`;
                    textWidth = textElement.offsetWidth;
                }
            } else if (textWidth > targetWidth) {
                // Text is too large, reduce letter spacing
                let letterSpacing = 0;
                while (textWidth > targetWidth && letterSpacing > -0.03) { // Less aggressive negative spacing
                    letterSpacing -= 0.01;
                    textElement.style.letterSpacing = `${letterSpacing}em`;
                    textWidth = textElement.offsetWidth;
                }
            }
            
            // Add a slight scale effect for perfect fitting - but limit the shrinking
            if (textWidth > targetWidth) {
                const scale = Math.max(0.9, targetWidth / textWidth); // Don't scale below 90%
                textElement.style.transform = `scaleX(${scale.toFixed(3)})`;
            } else {
                textElement.style.transform = 'scaleX(1)';
            }
        });
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
    
    // Add additional experimental interaction - mouse movement affects typography
    document.addEventListener('mousemove', debounce((e) => {
        if (!activeCategory) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            categories.forEach((category, index) => {
                const textElement = category.querySelector('.category-text');
                
                // Calculate distance from mouse to this category (simplified)
                const rect = category.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const distanceY = Math.abs(e.clientY - centerY) / window.innerHeight;
                
                // Apply subtle typographic effects based on mouse position
                // Increased minimum weight to prevent too-thin text
                const weightVariation = Math.max(350, Math.min(900, 500 + (1 - distanceY) * 300));
                textElement.style.fontVariationSettings = `'wght' ${Math.round(weightVariation)}`;
                textElement.style.setProperty('--calculated-weight', Math.round(weightVariation));
                
                // Add subtle movement - but less aggressive
                const offsetX = (mouseX - 0.5) * 5; // Reduced from 10 to 5 for less movement
                
                // Get current scale if it exists
                let currentScale = '1';
                if (textElement.style.transform) {
                    const scaleMatch = textElement.style.transform.match(/scaleX\(([0-9.]+)\)/);
                    if (scaleMatch && scaleMatch[1]) {
                        currentScale = scaleMatch[1];
                    }
                }
                
                textElement.style.transform = `translateX(${offsetX}px) scaleX(${currentScale})`;
            });
        }
    }, 20)); // 20ms debounce for smoother performance
    
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
    
    // Less frequent updates to prevent jittering
    setInterval(() => {
        if (document.visibilityState === 'visible' && !document.documentElement.classList.contains('is-scrolling')) {
            adjustTextSize();
        }
    }, 5000); // Reduced frequency from 2s to 5s
});