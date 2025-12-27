import { generateId } from '../utils/helpers.js';

const notifications = new Map();

export function showNotification(message, type = 'success', duration = 4000) {
    const id = generateId();
    
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `notification notification-${type} fixed top-4 right-4 z-50 
        min-w-[300px] max-w-md px-4 py-3 rounded-lg shadow-lg flex items-center justify-between 
        transform transition-all duration-300 translate-x-0 opacity-100`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.classList.add(...colors[type].split(' '));
    
    notification.innerHTML = `
        <div class="flex items-center gap-3 flex-1">
            <span class="text-xl font-bold">${icons[type]}</span>
            <span class="text-sm">${message}</span>
        </div>
        <button class="ml-4 text-xl opacity-70 hover:opacity-100" onclick="window.closeNotification('${id}')">
            ×
        </button>
    `;
    
    const container = getOrCreateContainer();
    container.appendChild(notification);
    notifications.set(id, notification);
    
    if (duration > 0) {
        setTimeout(() => closeNotification(id), duration);
    }
    
    return id;
}

export function closeNotification(id) {
    const notification = notifications.get(id);
    if (notification) {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
            notifications.delete(id);
        }, 300);
    }
}

function getOrCreateContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
    }
    return container;
}

window.closeNotification = closeNotification;
