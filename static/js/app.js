/**
 * Application Core for Schedulix
 */

import { Router } from './router.js';
import { api } from './api.js';
import { notifications } from './components/notification.js';
import { dashboard } from './modules/dashboard.js';
import { subjects } from './modules/subjects.js';
import { teachers } from './modules/teachers.js';
import { classrooms } from './modules/classrooms.js';
import { timeslots } from './modules/timeslots.js';
import { timetable } from './modules/timetable.js';

class App {
    constructor() {
        this.state = {
            subjects: [],
            teachers: [],
            classrooms: [],
            timeslots: [],
            timetables: [],
            activeTimetable: null,
            stats: {}
        };

        this.router = new Router({
            '/dashboard': () => dashboard.render(this),
            '/subjects': () => subjects.render(this),
            '/teachers': () => teachers.render(this),
            '/classrooms': () => classrooms.render(this),
            '/timeslots': () => timeslots.render(this),
            '/timetable': () => timetable.render(this)
        });

        this.init();
    }

    async init() {
        try {
            await this.refreshData();
            this.setupGlobalEvents();
            console.log('Schedulix SPA Initialized');
        } catch (error) {
            notifications.error('Failed to initialize application');
            console.error(error);
        }
    }

    async refreshData() {
        try {
            const [subjects, teachers, classrooms, timeslots, timetables, stats] = await Promise.all([
                api.subjects.getAll(),
                api.teachers.getAll(),
                api.classrooms.getAll(),
                api.timeslots.getAll(),
                api.timetables.getAll(),
                api.bulk.getStats()
            ]);

            this.state.subjects = subjects;
            this.state.teachers = teachers;
            this.state.classrooms = classrooms;
            this.state.timeslots = timeslots;
            this.state.timetables = timetables;
            this.state.stats = stats;
            this.state.activeTimetable = timetables.find(t => t.is_active);

            // Re-render current view if needed
            this.router.handleRoute();
        } catch (error) {
            notifications.error('Error fetching data from server');
            throw error;
        }
    }

    setupGlobalEvents() {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        mobileMenuBtn?.addEventListener('click', () => {
            sidebar?.classList.toggle('hidden');
        });

        // Close sidebar when clicking a link on mobile
        sidebar?.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link') && window.innerWidth < 1024) {
                sidebar.classList.add('hidden');
            }
        });

        document.getElementById('generateTimetableBtn')?.addEventListener('click', () => {
            this.router.navigate('#/timetable');
        });

        document.getElementById('clearDataBtn')?.addEventListener('click', async () => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                try {
                    await api.bulk.clearAll(this);
                    notifications.success('All data cleared');
                    await this.refreshData();
                    this.router.navigate('#/dashboard');
                } catch (error) {
                    notifications.error('Failed to clear data');
                }
            }
        });
    }
}

export const app = new App();
