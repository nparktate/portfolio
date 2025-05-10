/**
 * coordinator.js
 * Coordinates interaction between main page and project view functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const categories = document.querySelectorAll('.category');
    const projectsContainers = document.querySelectorAll('.projects-container');
    const projectDetails = document.getElementById('project-details');
    
    // State tracking
    let activeCategory = null;
    let activeProjectsContainer = null;
    
    // Initialize
    function init() {
        // Set up project item click handlers
        setupProjectItemHandlers();
        
        // Handle direct linking via URL
        checkUrlForDirectLink();
        
        // Handle browser navigation events
        window.addEventListener('popstate', handleBrowserNavigation);
    }
    
    // Set up click handlers for all project items
    function setupProjectItemHandlers() {
        document.querySelectorAll('.project-item').forEach(projectItem => {
            projectItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const projectId = projectItem.getAttribute('data-project-id');
                if (projectId && window.ProjectManager) {
                    // Save current state for returning
                    saveCurrentState();
                    
                    // Open the project
                    window.ProjectManager.open(projectId);
                }
            });
        });
    }
    
    // Check URL for direct project link
    function checkUrlForDirectLink() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project');
        
        if (projectId && window.ProjectManager) {
            // Delay slightly to ensure everything is loaded
            setTimeout(() => {
                window.ProjectManager.open(projectId, true);
            }, 100);
        }
    }
    
    // Handle browser back/forward navigation
    function handleBrowserNavigation(event) {
        if (event.state) {
            if (event.state.projectId) {
                // Going to a project
                if (window.ProjectManager) {
                    window.ProjectManager.open(event.state.projectId, true);
                }
            } else if (event.state.categoryId) {
                // Going to a category
                restoreState(event.state.categoryId);
                
                // Make sure project view is closed
                if (window.ProjectManager) {
                    window.ProjectManager.close(true);
                } else {
                    closeProjectView(true);
                }
            } else {
                // Going to main view
                resetMainView();
                
                // Close project view
                if (window.ProjectManager) {
                    window.ProjectManager.close(true);
                } else {
                    closeProjectView(true);
                }
            }
        } else {
            // Going to main view (no state)
            resetMainView();
            
            // Close project view
            if (window.ProjectManager) {
                window.ProjectManager.close(true);
            } else {
                closeProjectView(true);
            }
        }
    }
    
    // Save current state for returning later
    function saveCurrentState() {
        if (activeCategory) {
            const categoryId = activeCategory.getAttribute('data-category');
            history.pushState({ categoryId }, '', window.location.pathname);
        } else {
            history.pushState({}, '', window.location.pathname);
        }
    }
    
    // Restore a previous category state
    function restoreState(categoryId) {
        if (!categoryId) return resetMainView();
        
        // Find matching category and activate it
        categories.forEach(category => {
            const thisCategoryId = category.getAttribute('data-category');
            
            if (thisCategoryId === categoryId) {
                // Activate this category
                activateCategory(category);
            } else if (category.classList.contains('active')) {
                // Deactivate others
                deactivateCategory(category);
            }
        });
    }
    
    // Reset to main view (no active category)
    function resetMainView() {
        // Close any open category
        if (activeCategory) {
            deactivateCategory(activeCategory);
            activeCategory = null;
            activeProjectsContainer = null;
        }
    }
    
    // Activate a category
    function activateCategory(category) {
        const categoryId = category.getAttribute('data-category');
        const projectsContainer = document.querySelector(`.projects-container[data-for="${categoryId}"]`);
        
        if (!projectsContainer) return;
        
        // Set active state
        category.classList.add('active');
        projectsContainer.classList.add('active');
        
        // Set width with transition
        const isMobile = window.innerWidth <= 768;
        category.style.transition = 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        category.style.width = isMobile ? '40%' : '50%';
        
        // Update abbreviation state
        const textElement = category.querySelector('.category-text');
        if (textElement) {
            const abbrText = textElement.getAttribute('data-abbr-1') || textElement.textContent;
            textElement.textContent = abbrText;
            textElement.setAttribute('data-current-abbr', 'abbr-1');
            textElement.style.fontVariationSettings = `'wght' 700`;
        }
        
        // Update tracking variables
        activeCategory = category;
        activeProjectsContainer = projectsContainer;
    }
    
    // Deactivate a category
    function deactivateCategory(category) {
        const categoryId = category.getAttribute('data-category');
        const projectsContainer = document.querySelector(`.projects-container[data-for="${categoryId}"]`);
        
        if (projectsContainer) {
            category.classList.remove('active');
            projectsContainer.classList.remove('active');
        }
        
        // Reset width
        category.style.width = '';
        
        // Reset text
        const textElement = category.querySelector('.category-text');
        if (textElement && textElement.getAttribute('data-full-text')) {
            textElement.textContent = textElement.getAttribute('data-full-text');
            textElement.setAttribute('data-current-abbr', 'full-text');
            textElement.style.fontVariationSettings = `'wght' 400`;
        }
    }
    
    // Close project view (fallback if ProjectManager not available)
    function closeProjectView(skipHistory = false) {
        if (!skipHistory) {
            history.pushState({}, '', window.location.pathname);
        }
        
        projectDetails.classList.remove('active');
        setTimeout(() => {
            projectDetails.classList.add('hidden');
        }, 500);
        
        document.title = "Nicholas Tate Park | Portfolio";
    }
    
    // Make functions available globally for other scripts
    window.Coordinator = {
        saveState: saveCurrentState,
        restoreState: restoreState,
        resetView: resetMainView
    };
    
    // Initialize
    init();
});