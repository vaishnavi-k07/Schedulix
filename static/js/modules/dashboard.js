import { api } from '../api.js';
import { showNotification } from '../components/notification.js';

export class DashboardModule {
    constructor(appState) {
        this.appState = appState;
    }
    
    async render() {
        const main = document.getElementById('mainContent');
        
        const stats = [
            { 
                name: 'Subjects', 
                count: this.appState.subjects.length, 
                color: 'blue', 
                icon: '📘',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-600'
            },
            { 
                name: 'Faculty', 
                count: this.appState.teachers.length, 
                color: 'green', 
                icon: '👩‍🏫',
                bgColor: 'bg-green-50',
                textColor: 'text-green-600'
            },
            { 
                name: 'Classrooms', 
                count: this.appState.classrooms.length, 
                color: 'purple', 
                icon: '🏫',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-600'
            },
            { 
                name: 'Time Slots', 
                count: this.appState.timeslots.length, 
                color: 'orange', 
                icon: '⏱',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-600'
            }
        ];
        
        main.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p class="text-gray-600">Welcome to Schedulix Automatic Timetable Generator</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                ${stats.map(stat => `
                    <div class="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600 mb-1">${stat.name}</p>
                                <p class="text-3xl font-bold ${stat.textColor}">${stat.count}</p>
                            </div>
                            <div class="${stat.bgColor} w-12 h-12 rounded-full flex items-center justify-center">
                                <span class="text-2xl">${stat.icon}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800">Quick Start Guide</h3>
                    <div class="space-y-3">
                        <div class="flex items-start gap-3">
                            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div class="text-sm text-gray-600">Add Subjects from the Subjects section</div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div class="text-sm text-gray-600">Add Faculty members and assign them subjects</div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div class="text-sm text-gray-600">Add Classrooms with their capacities and types</div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div class="text-sm text-gray-600">Set up Time Slots and Break times for each day</div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                            <div class="text-sm text-gray-600">Generate your timetable automatically!</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800">System Status</h3>
                    <div class="space-y-3">
                        ${this.getStatusItem('Subjects', this.appState.subjects.length, 1)}
                        ${this.getStatusItem('Faculty', this.appState.teachers.length, 1)}
                        ${this.getStatusItem('Classrooms', this.appState.classrooms.length, 1)}
                        ${this.getStatusItem('Time Slots', this.appState.timeslots.length, 5)}
                    </div>
                    ${this.isSystemReady() ? `
                        <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p class="text-sm text-green-800 font-medium">✓ System is ready to generate timetables</p>
                        </div>
                    ` : `
                        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p class="text-sm text-yellow-800 font-medium">⚠ Please complete the setup to generate timetables</p>
                        </div>
                    `}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onclick="location.hash='#/timetable'" class="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-medium text-lg shadow-sm hover:shadow-md transition-all">
                    🗓 Generate Timetable
                </button>
                <button onclick="window.app.clearAllData()" class="bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 font-medium text-lg shadow-sm hover:shadow-md transition-all">
                    🗑 Clear All Data
                </button>
            </div>
        `;
    }
    
    getStatusItem(label, count, minimum) {
        const isReady = count >= minimum;
        const icon = isReady ? '✓' : '○';
        const color = isReady ? 'text-green-600' : 'text-gray-400';
        
        return `
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">${label}</span>
                <span class="${color} font-medium">
                    <span class="text-lg mr-1">${icon}</span>
                    ${count} / ${minimum}
                </span>
            </div>
        `;
    }
    
    isSystemReady() {
        return this.appState.subjects.length >= 1 &&
               this.appState.teachers.length >= 1 &&
               this.appState.classrooms.length >= 1 &&
               this.appState.timeslots.length >= 5;
    }
}
