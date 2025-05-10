/**
 * project.js - Dedicated handling for project pages
 * Manages loading, displaying, and navigating between portfolio projects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Project container element
    const projectDetails = document.getElementById('project-details');
    
    // Track project state
    let currentProject = null;
    
    // Cache for loaded projects
    const projectCache = {};
    
    /**
     * Initialize project functionality
     */
    function init() {
        // Check URL for direct project link
        checkUrlForProject();
        
        // Setup back button event delegation
        projectDetails.addEventListener('click', (e) => {
            if (e.target.classList.contains('back-button') || 
                e.target.closest('.back-button')) {
                closeProject();
                e.preventDefault();
            }
        });
        
        // Handle browser navigation
        window.addEventListener('popstate', handlePopState);
    }
    
    /**
     * Check URL for direct project linking
     */
    function checkUrlForProject() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project');
        
        if (projectId) {
            openProject(projectId, true);
        }
    }
    
    /**
     * Handle browser back/forward navigation
     */
    function handlePopState(event) {
        if (event.state) {
            if (event.state.projectId) {
                openProject(event.state.projectId, true);
            } else {
                closeProject(true);
            }
        } else {
            closeProject(true);
        }
    }
    
    /**
     * Open a project and display its details
     * @param {string} projectId - Project identifier
     * @param {boolean} skipHistory - Skip adding to browser history if true
     */
    function openProject(projectId, skipHistory = false) {
        currentProject = projectId;
        
        // Update URL for direct linking if not skipping history
        if (!skipHistory) {
            const newUrl = `${window.location.pathname}?project=${encodeURIComponent(projectId)}`;
            history.pushState({ projectId }, '', newUrl);
        }
        
        // Update document title
        document.title = `${projectId.replace(/-/g, ' ')} | Nicholas Tate Park`;
        
        // Show loading animation
        showLoading();
        
        // Check cache or load content
        if (projectCache[projectId]) {
            renderProject(projectCache[projectId]);
        } else {
            // In a real app, this would fetch project data from an API
            // For demo purposes, we'll generate content based on the ID
            const projectData = generateProjectData(projectId);
            projectCache[projectId] = projectData;
            renderProject(projectData);
        }
    }
    
    /**
     * Generate sample project data based on ID
     * In a real app, this would be replaced with API calls
     */
    function generateProjectData(projectId) {
        // Generate a deterministic color based on project ID
        const projectHue = (projectId.charCodeAt(0) * projectId.length) % 360;
        const secondaryHue = (projectHue + 180) % 360;
        
        // Extract category and project number from ID
        const parts = projectId.split('-');
        const category = parts.slice(0, -1).join(' ');
        const projectNumber = parts[parts.length - 1];
        
        return {
            id: projectId,
            title: `${category} Project ${projectNumber}`,
            category: category,
            year: new Date().getFullYear(),
            description: `This is a portfolio project demonstrating work in the "${category}" category.`,
            extendedDescription: `This project demonstrates the capabilities of responsive design and typography. It's part of an experimental portfolio showcasing dynamic visual treatments and computational aesthetics.
            
The approach combines variable typography with motion design principles to create a uniquely responsive experience across devices and viewports.`,
            tools: ['After Effects', 'Blender', 'JavaScript'],
            role: category,
            primaryColor: `hsl(${projectHue}, 70%, 15%)`,
            secondaryColor: `hsl(${secondaryHue}, 70%, 15%)`,
            accentColor: `hsl(${projectHue + 60}, 70%, 50%)`
        };
    }
    
    /**
     * Show loading animation while project loads
     */
    function showLoading() {
        // Create loading overlay
        const loader = document.createElement('div');
        loader.className = 'project-loader';
        loader.innerHTML = `
            <div class="loader-spinner">
                <div class="spinner-inner"></div>
            </div>
        `;
        
        // Style the loader
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(10, 10, 10, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(loader);
        
        // Fade in loader
        setTimeout(() => {
            loader.style.opacity = '1';
        }, 10);
        
        // Store reference for removal
        window.currentLoader = loader;
    }
    
    /**
     * Hide loading animation
     */
    function hideLoading() {
        if (window.currentLoader) {
            window.currentLoader.style.opacity = '0';
            setTimeout(() => {
                if (window.currentLoader && window.currentLoader.parentNode) {
                    window.currentLoader.parentNode.removeChild(window.currentLoader);
                }
                window.currentLoader = null;
            }, 300);
        }
    }
    
    /**
     * Render project content to the DOM
     */
    function renderProject(project) {
        // Generate HTML content
        const content = `
            <div class="project-header">
                <button class="back-button">← Back</button>
                <h2>${project.title}</h2>
            </div>
            <div class="project-content">
                <div class="project-hero" style="background-color: ${project.primaryColor}">
                    <div class="hero-content">
                        <h1>${project.title}</h1>
                        <div class="hero-image" style="background-color: ${project.accentColor}"></div>
                    </div>
                </div>
                <div class="project-description">
                    <h3>About this project</h3>
                    <p>${project.description}</p>
                    <p>${project.extendedDescription}</p>
                    
                    <div class="project-details-grid">
                        <div class="detail-item" style="background-color: ${project.primaryColor}">
                            <h4>Role</h4>
                            <p>${project.role}</p>
                        </div>
                        <div class="detail-item" style="background-color: ${project.secondaryColor}">
                            <h4>Year</h4>
                            <p>${project.year}</p>
                        </div>
                        <div class="detail-item" style="background-color: ${project.accentColor}">
                            <h4>Tools</h4>
                            <p>${project.tools.join(', ')}</p>
                        </div>
                    </div>
                    
                    <div class="project-gallery">
                        <div class="gallery-item" style="background-color: ${project.primaryColor}"></div>
                        <div class="gallery-item" style="background-color: ${project.secondaryColor}"></div>
                        <div class="gallery-item" style="background-color: ${project.accentColor}"></div>
                    </div>
                    
                    <a href="#" class="project-link">View Live Project</a>
                </div>
            </div>
        `;
        
        // Show project container if hidden
        projectDetails.classList.remove('hidden');
        
        // Update content with animation
        projectDetails.innerHTML = content;
        setTimeout(() => {
            projectDetails.classList.add('active');
            hideLoading();
        }, 100);
        
        // Add transition animations to elements
        animateProjectElements();
    }
    
    /**
     * Add entrance animations to project elements
     */
    function animateProjectElements() {
        const elements = projectDetails.querySelectorAll('.project-hero, h3, p, .detail-item, .gallery-item');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }
    
    /**
     * Close the current project and return to main view
     * @param {boolean} skipHistory - Skip history manipulation if true
     */
    function closeProject(skipHistory = false) {
        // Update URL to remove project parameter if not skipping history
        if (!skipHistory) {
            history.pushState({}, '', window.location.pathname);
        }
        
        // Reset document title
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
                
                // Complete transition and remove overlay
                setTimeout(() => {
                    projectDetails.classList.add('hidden');
                    transitionOut.style.transform = 'translateY(-100%)';
                    
                    // Remove transition element after animation completes
                    setTimeout(() => {
                        if (transitionOut.parentNode) {
                            transitionOut.parentNode.removeChild(transitionOut);
                        }
                    }, 500);
                    
                    // Reset current project
                    currentProject = null;
                }, 300);
            }, 250);
        }, 10);
    }
    
    /**
     * Navigate to a specific project from another project
     * @param {string} projectId - Target project ID
     */
    function navigateToProject(projectId) {
        if (currentProject === projectId) return;
        
        // Create transition effect
        const transition = document.createElement('div');
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0a0a0a;
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(transition);
        
        // Fade in transition
        setTimeout(() => {
            transition.style.opacity = '1';
            
            // Switch projects
            setTimeout(() => {
                openProject(projectId);
                
                // Fade out transition
                setTimeout(() => {
                    transition.style.opacity = '0';
                    setTimeout(() => {
                        if (transition.parentNode) {
                            transition.parentNode.removeChild(transition);
                        }
                    }, 300);
                }, 100);
            }, 300);
        }, 10);
    }
    
    // Add project.js methods to window for external access
    window.ProjectManager = {
        open: openProject,
        close: closeProject,
        navigate: navigateToProject
    };
    
    // Initialize
    init();
});