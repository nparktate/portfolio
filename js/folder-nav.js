// folder-nav.js - Folder-based navigation system for Nicholas Tate Park's portfolio
// Works alongside main.js without conflicts

(function() {
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Core elements
        const mainContainer = document.querySelector('.categories-container');
        const projectDetails = document.getElementById('project-details');
        const categories = document.querySelectorAll('.category');
        
        // State tracking
        let currentView = 'categories'; // categories, projects, or project
        let currentCategory = null;
        let projectsContainer = null;
        
        // Initialize after a short delay to let main.js initialize first
        setTimeout(initFolderNavigation, 100);
        
        // Main initialization
        function initFolderNavigation() {
            // Override existing category click handlers
            setupCategoryHandlers();
            
            // Add browser history handling
            window.addEventListener('popstate', handleBrowserNavigation);
            
            // Check URL for direct links
            checkURLParameters();
        }
        
        // Setup category handlers that work with main.js
        function setupCategoryHandlers() {
            categories.forEach(category => {
                // Get original click handler
                const originalClick = category.onclick;
                
                // Add our click handler
                category.addEventListener('click', function(e) {
                    // Prevent other handlers from firing
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // Get category ID
                    const categoryId = this.getAttribute('data-category');
                    
                    // Navigate to projects view
                    navigateToProjects(categoryId);
                    
                    // Since we're stopping propagation, also call adjustTextSize
                    // to ensure proper text sizing
                    if (window.adjustTextSize) {
                        setTimeout(window.adjustTextSize, 50);
                    }
                    
                    return false;
                }, true); // Use capturing to run before other handlers
            });
        }
        
        // Navigate to projects view for a specific category
        function navigateToProjects(categoryId) {
            // Update state
            currentView = 'projects';
            currentCategory = categoryId;
            
            // Update URL for direct linking
            const url = `${window.location.pathname}?category=${encodeURIComponent(categoryId)}`;
            history.pushState({ view: 'projects', category: categoryId }, '', url);
            
            // Update document title
            document.title = `${categoryId} | Nicholas Tate Park`;
            
            // Fade out main container
            fadeOut(mainContainer, function() {
                // Create or update projects container
                if (!projectsContainer) {
                    createProjectsContainer();
                } else {
                    // Clear existing projects
                    projectsContainer.innerHTML = '';
                }
                
                // Add back button
                addBackButton();
                
                // Create project items for this category
                createProjectItems(categoryId);
                
                // Show projects container
                projectsContainer.style.display = 'flex';
                fadeIn(projectsContainer);
                
                // Apply text sizing from main.js
                if (window.adjustTextSize) {
                    setTimeout(window.adjustTextSize, 50);
                }
            });
        }
        
        // Create the projects container
        function createProjectsContainer() {
            projectsContainer = document.createElement('div');
            projectsContainer.className = 'categories-container projects-view';
            projectsContainer.setAttribute('data-view', 'projects');
            projectsContainer.style.display = 'none'; // Hidden initially
            document.body.appendChild(projectsContainer);
        }
        
        // Add back navigation button
        function addBackButton() {
            // Remove existing back button if present
            const existingButton = document.querySelector('.navigation-back-button');
            if (existingButton) {
                existingButton.remove();
            }
            
            // Create back button
            const backButton = document.createElement('button');
            backButton.className = 'navigation-back-button';
            backButton.textContent = '← Back to Categories';
            backButton.addEventListener('click', navigateToCategories);
            
            // Add to body
            document.body.appendChild(backButton);
        }
        
        // Create project items that look like categories
        function createProjectItems(categoryId) {
            // Define color mapping for different categories
            const colors = {
                'MOTION DESIGN': 'rgba(255, 99, 71, 0.8)', // Tomato red
                'STATIC DESIGN': 'rgba(65, 105, 225, 0.8)', // Royal blue
                '3D ANIMATION & DESIGN': 'rgba(50, 205, 50, 0.8)', // Lime green
                'WEB DEVELOPMENT': 'rgba(255, 165, 0, 0.8)', // Orange
                'MISC DEVELOPMENT': 'rgba(186, 85, 211, 0.8)', // Medium orchid
                'TRASH / TESTING': 'rgba(178, 34, 34, 0.8)' // Firebrick
            };
            
            // Default color if category not found
            const projectColor = colors[categoryId] || 'rgba(255, 255, 255, 0.8)';
            
            // Set category attribute on container for CSS targeting
            projectsContainer.setAttribute('data-category', categoryId);
            
            // Create project items (in a real app, these would come from an API/database)
            for (let i = 1; i <= 6; i++) {
                // Create project element that looks like a category
                const project = document.createElement('div');
                project.className = 'category project';
                
                // Set project ID for navigation
                const projectId = `${categoryId.replace(/\s+/g, '-')}-${i}`;
                project.setAttribute('data-project-id', projectId);
                
                // Create inner structure to match categories
                const projectInner = document.createElement('div');
                projectInner.className = 'category-inner';
                
                const projectText = document.createElement('div');
                projectText.className = 'category-text';
                
                // Set project name
                const projectName = `${categoryId} Project ${i}`;
                projectText.textContent = projectName;
                projectText.style.color = projectColor;
                
                // Add abbreviation data attributes for responsive typography
                projectText.setAttribute('data-full-text', projectName);
                projectText.setAttribute('data-abbr-1', `${categoryId.split(' ')[0]} Proj ${i}`);
                projectText.setAttribute('data-abbr-2', `${categoryId.substring(0, 6)} ${i}`);
                projectText.setAttribute('data-abbr-3', `Proj ${i}`);
                projectText.setAttribute('data-abbr-4', `P${i}`);
                projectText.setAttribute('data-abbr-5', `${i}`);
                
                // Assemble DOM
                projectInner.appendChild(projectText);
                project.appendChild(projectInner);
                projectsContainer.appendChild(project);
                
                // Add click handler
                project.addEventListener('click', function() {
                    navigateToProject(projectId, categoryId);
                });
            }
        }
        
        // Navigate from projects back to categories
        function navigateToCategories() {
            // Update state
            currentView = 'categories';
            
            // Update URL
            history.pushState({}, '', window.location.pathname);
            
            // Update title
            document.title = 'Nicholas Tate Park | Portfolio';
            
            // Fade out projects container
            fadeOut(projectsContainer, function() {
                // Show main container
                mainContainer.style.display = 'flex';
                fadeIn(mainContainer);
                
                // Hide projects container
                projectsContainer.style.display = 'none';
                
                // Remove back button
                const backButton = document.querySelector('.navigation-back-button');
                if (backButton) {
                    backButton.remove();
                }
                
                // Apply text sizing from main.js
                if (window.adjustTextSize) {
                    setTimeout(window.adjustTextSize, 50);
                }
            });
            
            // Reset state
            currentCategory = null;
        }
        
        // Navigate to a specific project
        function navigateToProject(projectId, categoryId) {
            // Update state
            currentView = 'project';
            
            // Update URL for direct linking
            const url = `${window.location.pathname}?project=${encodeURIComponent(projectId)}`;
            history.pushState({ view: 'project', id: projectId, category: categoryId }, '', url);
            
            // Update document title
            document.title = `${projectId.replace(/-/g, ' ')} | Nicholas Tate Park`;
            
            // Fade out projects container
            fadeOut(projectsContainer, function() {
                // Prepare project details content
                renderProjectDetails(projectId, categoryId);
                
                // Show project details
                projectDetails.classList.remove('hidden');
                setTimeout(function() {
                    projectDetails.classList.add('active');
                }, 10);
            });
        }
        
        // Render project details content
        function renderProjectDetails(projectId, categoryId) {
            // Generate project colors based on category
            const colors = {
                'MOTION DESIGN': { primary: '#ff6347', secondary: '#ff8c7a' },
                'STATIC DESIGN': { primary: '#4169e1', secondary: '#6a8be8' },
                '3D ANIMATION & DESIGN': { primary: '#32cd32', secondary: '#5edb5e' },
                'WEB DEVELOPMENT': { primary: '#ffa500', secondary: '#ffc04d' },
                'MISC DEVELOPMENT': { primary: '#ba55d3', secondary: '#cd82e3' },
                'TRASH / TESTING': { primary: '#b22222', secondary: '#cf4545' }
            };
            
            // Get colors or use default
            const color = colors[categoryId] || { primary: '#4ecdc4', secondary: '#ff6b6b' };
            
            // Generate project content
            projectDetails.innerHTML = `
                <div class="project-header">
                    <button class="back-button">← Back to Projects</button>
                    <h2>${projectId.replace(/-/g, ' ')}</h2>
                </div>
                <div class="project-content">
                    <div class="project-hero" style="background-color: ${color.primary}22">
                        <div class="hero-content">
                            <h1>${projectId.replace(/-/g, ' ')}</h1>
                            <div class="hero-image" style="background-color: ${color.secondary}33"></div>
                        </div>
                    </div>
                    <div class="project-description">
                        <h3>About this project</h3>
                        <p>This is a portfolio project in the ${categoryId} category.</p>
                        <p>Using clean folder-based navigation between categories and projects.</p>
                        
                        <div class="project-details-grid">
                            <div class="detail-item" style="background-color: ${color.primary}22">
                                <h4>Role</h4>
                                <p>${categoryId}</p>
                            </div>
                            <div class="detail-item" style="background-color: ${color.secondary}22">
                                <h4>Year</h4>
                                <p>${new Date().getFullYear()}</p>
                            </div>
                            <div class="detail-item" style="background-color: ${color.primary}33">
                                <h4>Tools</h4>
                                <p>After Effects, Blender, JavaScript</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add back button handler
            const backButton = projectDetails.querySelector('.back-button');
            backButton.addEventListener('click', function() {
                navigateFromProjectToProjects(categoryId);
            });
        }
        
        // Navigate from project back to projects view
        function navigateFromProjectToProjects(categoryId) {
            // Update state
            currentView = 'projects';
            
            // Update URL
            const url = `${window.location.pathname}?category=${encodeURIComponent(categoryId)}`;
            history.pushState({ view: 'projects', category: categoryId }, '', url);
            
            // Update document title
            document.title = `${categoryId} | Nicholas Tate Park`;
            
            // Hide project details
            projectDetails.classList.remove('active');
            
            // After animation completes, show projects
            setTimeout(function() {
                projectDetails.classList.add('hidden');
                
                // Show projects container
                projectsContainer.style.display = 'flex';
                fadeIn(projectsContainer);
            }, 500);
        }
        
        // Check URL for direct links to project or category
        function checkURLParameters() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // Check for project parameter
            const projectId = urlParams.get('project');
            if (projectId) {
                // Extract category from project ID (assumes format: CATEGORY-CATEGORY-NUMBER)
                const categoryId = projectId.substring(0, projectId.lastIndexOf('-')).replace(/-/g, ' ');
                
                // Hide main container immediately
                mainContainer.style.display = 'none';
                
                // Create projects container if needed
                if (!projectsContainer) {
                    createProjectsContainer();
                    createProjectItems(categoryId);
                    addBackButton();
                }
                
                // Set current state
                currentView = 'project';
                currentCategory = categoryId;
                
                // Render and show project details
                renderProjectDetails(projectId, categoryId);
                projectDetails.classList.remove('hidden');
                setTimeout(function() {
                    projectDetails.classList.add('active');
                }, 10);
                
                return;
            }
            
            // Check for category parameter
            const categoryId = urlParams.get('category');
            if (categoryId) {
                navigateToProjects(categoryId);
            }
        }
        
        // Handle browser navigation
        function handleBrowserNavigation(event) {
            if (event.state) {
                if (event.state.view === 'project') {
                    // Navigate to project
                    const projectId = event.state.id;
                    const categoryId = event.state.category || 
                                     projectId.substring(0, projectId.lastIndexOf('-')).replace(/-/g, ' ');
                    
                    if (currentCategory !== categoryId || !projectsContainer) {
                        // First navigate to the right category if needed
                        navigateToProjects(categoryId);
                        setTimeout(function() {
                            navigateToProject(projectId, categoryId);
                        }, 100);
                    } else {
                        navigateToProject(projectId, categoryId);
                    }
                } else if (event.state.view === 'projects') {
                    // Navigate to category projects
                    navigateToProjects(event.state.category);
                    
                    // Close project details if open
                    if (projectDetails.classList.contains('active')) {
                        projectDetails.classList.remove('active');
                        setTimeout(function() {
                            projectDetails.classList.add('hidden');
                        }, 500);
                    }
                } else {
                    // Navigate to main categories
                    navigateToCategories();
                }
            } else {
                // Default to main categories view
                navigateToCategories();
                
                // Close project details if open
                if (projectDetails.classList.contains('active')) {
                    projectDetails.classList.remove('active');
                    setTimeout(function() {
                        projectDetails.classList.add('hidden');
                    }, 500);
                }
            }
        }
        
        // Helper function to fade out an element
        function fadeOut(element, callback) {
            if (!element) return callback && callback();
            
            element.style.opacity = '1';
            element.style.transition = 'opacity 0.3s ease';
            
            setTimeout(function() {
                element.style.opacity = '0';
                
                setTimeout(function() {
                    if (callback) callback();
                }, 300);
            }, 10);
        }
        
        // Helper function to fade in an element
        function fadeIn(element, callback) {
            if (!element) return callback && callback();
            
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.3s ease';
            
            setTimeout(function() {
                element.style.opacity = '1';
                
                setTimeout(function() {
                    if (callback) callback();
                }, 300);
            }, 10);
        }
        
        // Expose public methods
        window.FolderNav = {
            goToCategories: navigateToCategories,
            goToProjects: navigateToProjects,
            goToProject: navigateToProject
        };
    });
})();