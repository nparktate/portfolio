/**
 * slider.js - Handles panel sliding interactions between categories and projects
 * For Nicholas Tate Park's portfolio website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Main elements
    const sliderContainer = document.querySelector('.slider-container');
    const categoriesPanel = document.querySelector('.categories-panel');
    const projectsPanel = document.querySelector('.projects-panel');
    const projectDetails = document.getElementById('project-details');
    const backButton = document.querySelector('.back-to-categories');
    const categories = document.querySelectorAll('.category');
    
    // State tracking
    let currentCategory = null;
    let currentProjects = [];
    
    // Configuration (matching main.js settings)
    const CONFIG = {
        horizontalFill: 0.95,
        minFontSize: 20,
        minHeight: 80,
        abbreviationLevels: 5,
        standardScreenWidth: 1024
    };
    
    // Initialize system
    function init() {
        // Setup category click handlers
        setupCategoryHandlers();
        
        // Setup back button
        setupBackButton();
        
        // Handle URL parameters
        checkUrlForDirectLink();
        
        // Handle browser navigation
        window.addEventListener('popstate', handleBrowserNavigation);
        
        // Set up resize handling
        window.addEventListener('resize', debounce(adjustTextSizes, 100));
        
        // Initial text size adjustment
        adjustTextSizes();
    }
    
    // Set up category click handlers
    function setupCategoryHandlers() {
        categories.forEach(category => {
            category.addEventListener('click', () => {
                const categoryId = category.getAttribute('data-category');
                showProjectsForCategory(categoryId);
            });
        });
    }
    
    // Handle back button click
    function setupBackButton() {
        backButton.addEventListener('click', () => {
            goBackToCategories();
        });
    }
    
    // Show projects for a specific category
    function showProjectsForCategory(categoryId) {
        // Update state
        currentCategory = categoryId;
        
        // Update URL to allow direct linking
        history.pushState(
            { view: 'projects', category: categoryId }, 
            '', 
            `${window.location.pathname}?category=${encodeURIComponent(categoryId)}`
        );
        
        // Update document title
        document.title = `${categoryId} | Nicholas Tate Park`;
        
        // Set category on projects panel for styling
        projectsPanel.setAttribute('data-category', categoryId);
        
        // Clear existing projects
        projectsPanel.innerHTML = '';
        
        // Add back button if not present
        if (!document.querySelector('.back-to-categories')) {
            const backBtn = document.createElement('button');
            backBtn.className = 'back-to-categories';
            backBtn.innerHTML = '← Back to Categories';
            backBtn.addEventListener('click', goBackToCategories);
            document.body.appendChild(backBtn);
        }
        
        // Generate projects for this category
        generateProjects(categoryId);
        
        // Slide to projects panel
        sliderContainer.classList.add('show-projects');
        
        // Adjust text sizes after transition
        setTimeout(adjustTextSizes, 600);
    }
    
    // Generate project items for the selected category
    function generateProjects(categoryId) {
        // In a real application, these would come from an API or database
        // For demo purposes, we'll create 6 projects per category
        currentProjects = [];
        
        for (let i = 1; i <= 6; i++) {
            const project = document.createElement('div');
            project.className = 'project';
            
            const projectInner = document.createElement('div');
            projectInner.className = 'project-inner';
            
            const projectText = document.createElement('div');
            projectText.className = 'project-text';
            
            // Create project name
            const projectName = `${categoryId} Project ${i}`;
            projectText.textContent = projectName;
            
            // Add abbreviation data attributes for responsive text
            projectText.setAttribute('data-full-text', projectName);
            projectText.setAttribute('data-abbr-1', `${categoryId.split(' ')[0]} Proj ${i}`);
            projectText.setAttribute('data-abbr-2', `${categoryId.substring(0, 6)} ${i}`);
            projectText.setAttribute('data-abbr-3', `Proj ${i}`);
            projectText.setAttribute('data-abbr-4', `P${i}`);
            projectText.setAttribute('data-abbr-5', `${i}`);
            
            // Set project ID for linking
            const projectId = `${categoryId.replace(/\s+/g, '-')}-${i}`;
            project.setAttribute('data-project-id', projectId);
            
            // Add click handler
            project.addEventListener('click', () => {
                openProjectDetails(projectId);
            });
            
            // Assemble DOM
            projectInner.appendChild(projectText);
            project.appendChild(projectInner);
            projectsPanel.appendChild(project);
            
            // Track projects
            currentProjects.push(project);
        }
    }
    
    // Go back to categories view
    function goBackToCategories() {
        // Update URL
        history.pushState({}, '', window.location.pathname);
        
        // Update title
        document.title = 'Nicholas Tate Park | Portfolio';
        
        // Slide back to categories
        sliderContainer.classList.remove('show-projects');
        
        // Reset state
        setTimeout(() => {
            currentCategory = null;
            currentProjects = [];
        }, 600);
    }
    
    // Open project details
    function openProjectDetails(projectId) {
        // Update URL
        history.pushState(
            { view: 'project', id: projectId }, 
            '', 
            `${window.location.pathname}?project=${encodeURIComponent(projectId)}`
        );
        
        // Update title
        document.title = `${projectId.replace(/-/g, ' ')} | Nicholas Tate Park`;
        
        // In a real implementation, you would fetch project details here
        // For now, we'll just show a placeholder
        
        // Clear existing content
        projectDetails.innerHTML = `
            <div class="project-header">
                <button class="back-button">← Back</button>
                <h2>${projectId.replace(/-/g, ' ')}</h2>
            </div>
            <div class="project-content">
                <div class="project-hero">
                    <div class="hero-content">
                        <h1>${projectId.replace(/-/g, ' ')}</h1>
                        <div class="hero-image"></div>
                    </div>
                </div>
                <div class="project-description">
                    <h3>About this project</h3>
                    <p>This is a portfolio project by Nicholas Tate Park.</p>
                    <p>This demonstrates the sliding panel navigation pattern.</p>
                </div>
            </div>
        `;
        
        // Add back button handler
        const backButton = projectDetails.querySelector('.back-button');
        backButton.addEventListener('click', () => {
            closeProjectDetails();
        });
        
        // Show project details
        projectDetails.classList.remove('hidden');
        projectDetails.classList.add('active');
    }
    
    // Close project details
    function closeProjectDetails() {
        // Update URL to return to category view
        if (currentCategory) {
            history.pushState(
                { view: 'projects', category: currentCategory }, 
                '', 
                `${window.location.pathname}?category=${encodeURIComponent(currentCategory)}`
            );
            document.title = `${currentCategory} | Nicholas Tate Park`;
        } else {
            history.pushState({}, '', window.location.pathname);
            document.title = 'Nicholas Tate Park | Portfolio';
        }
        
        // Hide project details
        projectDetails.classList.remove('active');
        setTimeout(() => {
            projectDetails.classList.add('hidden');
        }, 500);
    }
    
    // Check URL for direct links to category or project
    function checkUrlForDirectLink() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for project parameter
        const projectId = urlParams.get('project');
        if (projectId) {
            // Extract category from project ID
            const categoryId = projectId.substring(0, projectId.lastIndexOf('-')).replace(/-/g, ' ');
            currentCategory = categoryId;
            
            // Show projects panel first
            showProjectsForCategory(categoryId);
            
            // Then open project details
            setTimeout(() => {
                openProjectDetails(projectId);
            }, 100);
            return;
        }
        
        // Check for category parameter
        const categoryId = urlParams.get('category');
        if (categoryId) {
            showProjectsForCategory(categoryId);
        }
    }
    
    // Handle browser navigation
    function handleBrowserNavigation(event) {
        if (event.state) {
            if (event.state.view === 'project') {
                // Navigate to project
                const projectId = event.state.id;
                const categoryId = projectId.substring(0, projectId.lastIndexOf('-')).replace(/-/g, ' ');
                
                if (currentCategory !== categoryId) {
                    showProjectsForCategory(categoryId);
                }
                
                setTimeout(() => {
                    openProjectDetails(projectId);
                }, 100);
            } else if (event.state.view === 'projects') {
                // Navigate to category projects
                const categoryId = event.state.category;
                
                // Close project details if open
                if (projectDetails.classList.contains('active')) {
                    projectDetails.classList.remove('active');
                    setTimeout(() => {
                        projectDetails.classList.add('hidden');
                    }, 500);
                }
                
                // Show projects for this category
                showProjectsForCategory(categoryId);
            } else {
                // Navigate to main categories
                goBackToCategories();
            }
        } else {
            // Default to main categories view
            goBackToCategories();
            
            // Close project details if open
            if (projectDetails.classList.contains('active')) {
                projectDetails.classList.remove('active');
                setTimeout(() => {
                    projectDetails.classList.add('hidden');
                }, 500);
            }
        }
    }
    
    // Adjust text sizes for responsive typography
    function adjustTextSizes() {
        // Only adjust projects if we're in projects view
        if (currentCategory && currentProjects.length > 0) {
            const projectTexts = document.querySelectorAll('.project-text');
            projectTexts.forEach(textElement => {
                adjustTextSize(textElement);
            });
        }
    }
    
    // Adjust single text element size based on available width
    function adjustTextSize(textElement) {
        // Get container dimensions
        const container = textElement.closest('.project') || textElement.parentElement;
        const containerWidth = container.offsetWidth;
        
        // Get original text
        const fullText = textElement.getAttribute('data-full-text') || textElement.textContent;
        
        // Check if full text fits
        if (textFitsContainer(textElement, fullText, containerWidth)) {
            textElement.textContent = fullText;
            return;
        }
        
        // Try each abbreviation level
        for (let i = 1; i <= CONFIG.abbreviationLevels; i++) {
            const abbrText = textElement.getAttribute(`data-abbr-${i}`);
            if (!abbrText) continue;
            
            if (textFitsContainer(textElement, abbrText, containerWidth)) {
                textElement.textContent = abbrText;
                return;
            }
        }
        
        // If nothing fits, use the shortest abbreviation
        const shortestAbbr = textElement.getAttribute(`data-abbr-${CONFIG.abbreviationLevels}`);
        if (shortestAbbr) {
            textElement.textContent = shortestAbbr;
        }
    }
    
    // Check if text fits in container
    function textFitsContainer(element, text, containerWidth) {
        // Temporarily set the text to measure
        const originalText = element.textContent;
        element.textContent = text;
        
        // Measure text width
        const textWidth = element.offsetWidth;
        
        // Restore original text
        element.textContent = originalText;
        
        // Check if it fits (with some margin)
        return textWidth <= containerWidth * 0.95;
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
    
    // Initialize
    init();
});