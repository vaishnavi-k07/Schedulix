export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.defaultRoute = null;
        
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
    
    register(path, handler, options = {}) {
        this.routes.set(path, {
            handler,
            ...options
        });
    }
    
    setDefault(path) {
        this.defaultRoute = path;
    }
    
    navigate(path) {
        window.location.hash = path;
    }
    
    handleRoute() {
        const hash = window.location.hash || '#/dashboard';
        const path = hash.replace('#', '');
        
        this.updateActiveLinks(hash);
        
        const route = this.routes.get(path);
        
        if (route) {
            this.currentRoute = path;
            try {
                route.handler();
            } catch (error) {
                console.error(`Error handling route ${path}:`, error);
                this.showError('An error occurred while loading this page.');
            }
        } else if (this.defaultRoute) {
            this.navigate(this.defaultRoute);
        } else {
            this.show404();
        }
    }
    
    updateActiveLinks(hash) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === hash) {
                link.classList.add('active-link', 'bg-blue-50', 'text-blue-600');
            } else {
                link.classList.remove('active-link', 'bg-blue-50', 'text-blue-600');
            }
        });
    }
    
    show404() {
        const main = document.getElementById('mainContent');
        main.innerHTML = `
            <div class="text-center py-20">
                <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <p class="text-xl text-gray-600 mb-4">Page not found</p>
                <button onclick="location.hash='#/dashboard'" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Go to Dashboard
                </button>
            </div>
        `;
    }
    
    showError(message) {
        const main = document.getElementById('mainContent');
        main.innerHTML = `
            <div class="text-center py-20">
                <p class="text-xl text-red-600 mb-4">${message}</p>
                <button onclick="location.reload()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Reload Page
                </button>
            </div>
        `;
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
}
