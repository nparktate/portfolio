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
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            const containerHeight = category.offsetHeight;
            const containerWidth = category.offsetWidth;
            
            // Start with a base size based on container height
            let fontSize = Math.floor(containerHeight * 0.85); // 85% of container height
            textElement.style.fontSize = `${fontSize}px`;
            
            // Adjust font weight based on available width
            let weight = 100; // Start with lightest weight
            textElement.style.fontVariationSettings = `'wght' ${weight}`;
            
            // Measure and adjust
            let textWidth = textElement.offsetWidth;
            const targetWidth = containerWidth * 0.95; // Target 95% of container width
            
            // Increase weight until optimal filling
            while (textWidth < targetWidth && weight < 900) {
                weight += 25;
                textElement.style.fontVariationSettings = `'wght' ${weight}`;
                textWidth = textElement.offsetWidth;
                
                if (weight >= 900) break;
                if (textWidth > targetWidth) {
                    // We went too far, step back
                    weight -= 25;
                    textElement.style.fontVariationSettings = `'wght' ${weight}`;
                    break;
                }
            }
            
            // Fine-tune letter spacing if needed
            if (textWidth < targetWidth * 0.9) {
                // Text is too small, add letter spacing
                let letterSpacing = 0;
                while (textWidth < targetWidth * 0.95 && letterSpacing < 0.2) {
                    letterSpacing += 0.01;
                    textElement.style.letterSpacing = `${letterSpacing}em`;
                    textWidth = textElement.offsetWidth;
                }
            } else if (textWidth > targetWidth) {
                // Text is too large, reduce letter spacing
                let letterSpacing = 0;
                while (textWidth > targetWidth && letterSpacing > -0.05) {
                    letterSpacing -= 0.01;
                    textElement.style.letterSpacing = `${letterSpacing}em`;
                    textWidth = textElement.offsetWidth;
                }
            }
            
            // Add a slight scale effect for perfect fitting
            if (textWidth > targetWidth) {
                const scale = targetWidth / textWidth;
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
    
    // Add additional experimental interaction - mouse movement affects typography
    document.addEventListener('mousemove', (e) => {
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
                const weightVariation = Math.max(100, Math.min(900, 400 + (1 - distanceY) * 300));
                textElement.style.fontVariationSettings = `'wght' ${Math.round(weightVariation)}`;
                
                // Add subtle movement
                const offsetX = (mouseX - 0.5) * 10;
                textElement.style.transform = `translateX(${offsetX}px) scaleX(${textElement.style.transform ? textElement.style.transform.split('(')[1].split(')')[0] : '1'})`;
            });
        }
    });
    
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
    
    // Call adjustTextSize on load and resize
    window.addEventListener('resize', () => {
        adjustTextSize();
        
        // Add resize animation transition temporarily
        categories.forEach(category => {
            const textElement = category.querySelector('.category-text');
            textElement.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                textElement.style.transition = '';
            }, 300);
        });
    });
    
    // Initial adjustment
    adjustTextSize();
    
    // Get super dynamic with setInterval to constantly check and adjust text
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            adjustTextSize();
        }
    }, 2000);
});