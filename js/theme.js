// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = Storage.get('theme', 'light');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Storage.set('theme', theme);
        this.updateThemeIcon(theme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        Utils.showNotification(`Switched to ${this.currentTheme} mode`, 'info', 2000);
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    // Get system preference
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Sync with system theme
    syncWithSystem() {
        const systemTheme = this.getSystemTheme();
        if (!Storage.get('theme')) {
            this.applyTheme(systemTheme);
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.themeManager.syncWithSystem();
});