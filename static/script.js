/**
 * Schedulix - Main Entry Point
 * This file bootstraps the application by importing the App module.
 */

import { app } from './js/app.js';

// Global error handling for the application
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // You could add a notification here if desired
});

console.log('Schedulix Main Script Loaded');
