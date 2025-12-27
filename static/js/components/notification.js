/**
 * Notification component for Schedulix
 */

class NotificationSystem {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(this.container);
    }

    show(message, type = 'success', duration = 4000) {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            info: 'bg-blue-600',
            warning: 'bg-yellow-500'
        };

        toast.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] transform transition-all duration-300 translate-x-full`;
        
        toast.innerHTML = `
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200 focus:outline-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        this.container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.remove('translate-x-full'), 10);

        const dismiss = () => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        };

        toast.querySelector('button').onclick = dismiss;

        if (duration > 0) {
            setTimeout(dismiss, duration);
        }
    }

    success(message) { this.show(message, 'success'); }
    error(message) { this.show(message, 'error'); }
    info(message) { this.show(message, 'info'); }
    warning(message) { this.show(message, 'warning'); }
}

export const notifications = new NotificationSystem();
