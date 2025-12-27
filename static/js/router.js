/**
 * Router for Schedulix SPA
 */

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = null;
        
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash || '#/dashboard';
        const path = hash.slice(1) || '/dashboard';
        
        this.currentPath = path;
        
        // Update active links in sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === hash || (hash === '' && href === '#/dashboard')) {
                link.classList.add('bg-blue-50', 'text-blue-600');
            } else {
                link.classList.remove('bg-blue-50', 'text-blue-600');
            }
        });

        const route = this.routes[path] || this.routes['/dashboard'];
        if (route) {
            route();
        }
    }

    navigate(path) {
        window.location.hash = path;
    }
}
