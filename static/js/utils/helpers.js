/**
 * Helper utilities for Schedulix
 */

export const formatTime = (timeStr) => {
    if (!timeStr) return '';
    // timeStr is usually "HH:MM:SS" or "HH:MM"
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};

export const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

export const escapeHTML = (str) => {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
};
