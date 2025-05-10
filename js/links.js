// url-handler.js - Simple URL handler for project linking
// This module enables direct linking to portfolio projects without modifying existing code

(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Elements
        const projectDetails = document.getElementById('project-details');
        
        // Check for direct project link on page load
        setTimeout(checkUrlForProject, 500);
        
        // Handle browser navigation (back/forward buttons)
        window.addEventListener('popstate', handleNavigation);
        
        // Add click handlers to all project items
        setupProjectItems();
        
        // Add click handler to back buttons
        setupBackButtons();
        
        /**
         * Check URL for project parameter
         */
        function checkUrlForProject() {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('project');
            
            if (projectId) {
                // Find the project item by ID and click it
                const projectItem = document.querySelector(`[data-project-id="${projectId}"]`);
                if (projectItem) {
                    projectItem.click();
                }
            }
        }
        
        /**
         * Handle browser navigation
         */
        function handleNavigation(event) {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('project');
            
            if (projectId) {
                // Going to a project - if not already viewing it
                if (!projectDetails.classList.contains('active')) {
                    const projectItem = document.querySelector(`[data-project-id="${projectId}"]`);
                    if (projectItem) {
                        projectItem.click();
                    }
                }
            } else {
                // Going back to main view - if viewing a project
                if (projectDetails.classList.contains('active')) {
                    const backButton = projectDetails.querySelector('.back-button');
                    if (backButton) {
                        backButton.click();
                    } else {
                        // Fallback if no back button
                        projectDetails.classList.remove('active');
                        setTimeout(() => {
                            projectDetails.classList.add('hidden');
                        }, 500);
                    }
                }
            }
        }
        
        /**
         * Setup click handlers for project items
         */
        function setupProjectItems() {
            document.querySelectorAll('.project-item').forEach(item => {
                // Save original click handler
                const originalClick = item.onclick;
                
                // Add URL handling
                item.addEventListener('click', function(e) {
                    const projectId = this.getAttribute('data-project-id');
                    if (!projectId) return;
                    
                    // Update URL
                    history.pushState(
                        { projectId: projectId }, 
                        '', 
                        `${window.location.pathname}?project=${encodeURIComponent(projectId)}`
                    );
                    
                    // Update document title
                    document.title = `${projectId.replace(/-/g, ' ')} | Nicholas Tate Park`;
                }, true); // Use capturing to run before other handlers
            });
        }
        
        /**
         * Setup click handlers for back buttons
         */
        function setupBackButtons() {
            document.addEventListener('click', function(e) {
                // Check if click was on a back button
                if (e.target.classList.contains('back-button') || 
                    e.target.closest('.back-button')) {
                    
                    // Update URL and title
                    history.pushState({}, '', window.location.pathname);
                    document.title = 'Nicholas Tate Park | Portfolio';
                }
            });
        }
    });
})();