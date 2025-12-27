import { api } from './api.js';
import { Router } from './router.js';
import { showNotification } from './components/notification.js';
import { DashboardModule } from './modules/dashboard.js';
import { SubjectsModule } from './modules/subjects.js';
import { TeachersModule } from './modules/teachers.js';
import { ClassroomsModule } from './modules/classrooms.js';
import { TimeslotsModule } from './modules/timeslots.js';
import { TimetableModule } from './modules/timetable.js';

class App {
    constructor() {
        this.state = {
            subjects: [],
            teachers: [],
            classrooms: [],
            timeslots: [],
            timetables: []
        };
        
        this.router = new Router();
        this.modules = {};
        
        this.initModules();
        this.setupRoutes();
        this.setupEventListeners();
    }
    
    initModules() {
        this.modules.dashboard = new DashboardModule(this.state);
        this.modules.subjects = new SubjectsModule(this.state);
        this.modules.teachers = new TeachersModule(this.state);
        this.modules.classrooms = new ClassroomsModule(this.state);
        this.modules.timeslots = new TimeslotsModule(this.state);
        this.modules.timetable = new TimetableModule(this.state);
    }
    
    setupRoutes() {
        this.router.register('/dashboard', () => this.modules.dashboard.render());
        this.router.register('/subjects', () => this.modules.subjects.render());
        this.router.register('/teachers', () => this.modules.teachers.render());
        this.router.register('/classrooms', () => this.modules.classrooms.render());
        this.router.register('/timeslots', () => this.modules.timeslots.render());
        this.router.register('/timetable', () => this.modules.timetable.render());
        
        this.router.setDefault('/dashboard');
    }
    
    setupEventListeners() {
        const generateBtn = document.getElementById('generateTimetableBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                window.location.hash = '#/timetable';
            });
        }
        
        const clearBtn = document.getElementById('clearDataBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }
        
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('hidden');
            });
            
            sidebar.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    setTimeout(() => {
                        sidebar.classList.add('hidden');
                    }, 100);
                }
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('modalRoot');
                if (modal && modal.innerHTML) {
                    modal.innerHTML = '';
                }
                
                const sidebar = document.getElementById('sidebar');
                if (sidebar && window.innerWidth < 768) {
                    sidebar.classList.add('hidden');
                }
            }
        });
    }
    
    async loadAllData() {
        try {
            const [subjects, teachers, classrooms, timeslots] = await Promise.all([
                api.subjects.list(),
                api.teachers.list(),
                api.classrooms.list(),
                api.timeslots.list()
            ]);
            
            this.state.subjects = subjects;
            this.state.teachers = teachers;
            this.state.classrooms = classrooms;
            this.state.timeslots = timeslots;
            
            const currentRoute = this.router.getCurrentRoute();
            if (currentRoute) {
                this.router.handleRoute();
            }
            
        } catch (error) {
            console.error('Error loading data:', error);
            showNotification('Error loading data from server', 'error');
        }
    }
    
    async clearAllData() {
        if (!confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
            return;
        }
        
        if (!confirm('This will delete all subjects, faculty, classrooms, time slots, and timetables. Are you absolutely sure?')) {
            return;
        }
        
        try {
            const deletePromises = [];
            
            this.state.timeslots.forEach(slot => {
                deletePromises.push(api.timeslots.delete(slot.id));
            });
            
            this.state.teachers.forEach(teacher => {
                deletePromises.push(api.teachers.delete(teacher.id));
            });
            
            this.state.classrooms.forEach(classroom => {
                deletePromises.push(api.classrooms.delete(classroom.id));
            });
            
            this.state.subjects.forEach(subject => {
                deletePromises.push(api.subjects.delete(subject.id));
            });
            
            await Promise.all(deletePromises);
            
            showNotification('All data cleared successfully!', 'success');
            await this.loadAllData();
            
            window.location.hash = '#/dashboard';
            
        } catch (error) {
            console.error('Error clearing data:', error);
            showNotification('Error clearing data', 'error');
        }
    }
    
    async init() {
        try {
            showNotification('Loading application...', 'info', 2000);
            await this.loadAllData();
            showNotification('Application loaded successfully!', 'success', 2000);
        } catch (error) {
            console.error('Error initializing app:', error);
            showNotification('Error initializing application', 'error');
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    window.app = app;
    await app.init();
});
