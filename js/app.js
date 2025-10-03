// Main application controller
class GupAIApp {
    constructor() {
        this.isSidebarOpen = window.innerWidth >= 1024;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupResponsiveBehavior();
        this.initializeModules();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Close sidebar when clicking on overlay (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1024 && this.isSidebarOpen) {
                const sidebar = document.querySelector('.sidebar');
                const toggleBtn = document.getElementById('sidebar-toggle');
                
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Prevent form submission
        document.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    setupResponsiveBehavior() {
        this.handleResize();
    }

    handleResize() {
        const sidebar = document.querySelector('.sidebar');
        const isMobile = window.innerWidth < 1024;

        if (isMobile) {
            sidebar.classList.remove('active');
            this.isSidebarOpen = false;
        } else {
            sidebar.classList.add('active');
            this.isSidebarOpen = true;
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
        this.isSidebarOpen = sidebar.classList.contains('active');
    }

    openSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.add('active');
        this.isSidebarOpen = true;
    }

    closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('active');
        this.isSidebarOpen = false;
    }

    initializeModules() {
        // Modules are initialized in their respective files
        console.log('Gup.ai Application Initialized');
        
        // Show welcome notification
        setTimeout(() => {
            Utils.showNotification('Welcome to Gup.ai! Start by typing a message or using voice input.', 'info', 5000);
        }, 1000);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + / to focus input
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            document.getElementById('user-input').focus();
        }

        // Ctrl/Cmd + K to new chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            window.chatManager.createNewChat();
        }

        // Escape to clear input or close sidebar
        if (e.key === 'Escape') {
            const userInput = document.getElementById('user-input');
            if (document.activeElement === userInput && userInput.value) {
                userInput.value = '';
                Utils.autoResizeTextarea(userInput);
                window.chatManager.updateSendButton();
            } else if (window.innerWidth < 1024 && this.isSidebarOpen) {
                this.closeSidebar();
            }
        }
    }

    // Application lifecycle methods
    destroy() {
        // Cleanup if needed
        window.chatManager.saveCurrentChat();
    }
}

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gupAIApp = new GupAIApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.gupAIApp) {
        window.gupAIApp.destroy();
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You can register a service worker here for offline functionality
        console.log('Service Worker support detected');
    });
}
