import { api } from '../api.js';
import { showNotification } from '../components/notification.js';
import { openModal, closeModal } from '../components/modal.js';
import { formatTime } from '../utils/helpers.js';

export class TimetableModule {
    constructor(appState) {
        this.appState = appState;
        this.currentTimetable = null;
        this.timetables = [];
    }
    
    async render() {
        const main = document.getElementById('mainContent');
        
        await this.loadTimetables();
        
        const validationErrors = this.validatePrerequisites();
        
        main.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Timetable Generation</h2>
                <p class="text-gray-600">Automatically generate conflict-free timetables</p>
            </div>

            ${validationErrors.length > 0 ? `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 class="font-semibold text-red-800 mb-2">⚠ Cannot Generate Timetable</h3>
                    <ul class="text-sm text-red-700 space-y-1">
                        ${validationErrors.map(error => `<li>• ${error}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="bg-white border rounded-lg p-6 mb-6 shadow-sm">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">System Status</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${this.renderStatusCard('Subjects', this.appState.subjects.length, 1)}
                    ${this.renderStatusCard('Faculty', this.appState.teachers.length, 1)}
                    ${this.renderStatusCard('Classrooms', this.appState.classrooms.length, 1)}
                    ${this.renderStatusCard('Time Slots', this.appState.timeslots.length, 5)}
                </div>
            </div>

            <div class="bg-white border rounded-lg p-6 mb-6 shadow-sm">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Generate New Timetable</h3>
                <div class="flex gap-4 items-end">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Timetable Name</label>
                        <input type="text" 
                               id="timetableName" 
                               placeholder="e.g., Fall 2024 Timetable" 
                               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                    </div>
                    <button onclick="window.app.modules.timetable.generate()" 
                            ${validationErrors.length > 0 ? 'disabled' : ''}
                            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm
                                   ${validationErrors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                        Generate Timetable
                    </button>
                </div>
            </div>

            ${this.timetables.length > 0 ? `
                <div class="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800">Generated Timetables</h3>
                    <div class="space-y-3">
                        ${this.timetables.map(tt => this.renderTimetableItem(tt)).join('')}
                    </div>
                </div>
            ` : ''}

            ${this.currentTimetable ? `
                <div class="mt-6 bg-white border rounded-lg p-6 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">${this.currentTimetable.name}</h3>
                        <div class="flex gap-2">
                            <button onclick="window.app.modules.timetable.exportToPDF()" 
                                    class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                                📄 Export PDF
                            </button>
                            <button onclick="window.app.modules.timetable.print()" 
                                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                                🖨 Print
                            </button>
                        </div>
                    </div>
                    ${this.renderTimetableGrid()}
                </div>
            ` : ''}
        `;
    }
    
    renderStatusCard(label, count, minimum) {
        const isOk = count >= minimum;
        return `
            <div class="text-center p-4 ${isOk ? 'bg-green-50' : 'bg-red-50'} rounded-lg">
                <div class="text-2xl font-bold ${isOk ? 'text-green-600' : 'text-red-600'}">${count}</div>
                <div class="text-sm text-gray-600">${label}</div>
                <div class="text-xs ${isOk ? 'text-green-600' : 'text-red-600'} mt-1">
                    ${isOk ? '✓' : `Need ${minimum}`}
                </div>
            </div>
        `;
    }
    
    renderTimetableItem(timetable) {
        const createdDate = new Date(timetable.created_at).toLocaleDateString();
        return `
            <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                    <h4 class="font-medium text-gray-800">${timetable.name}</h4>
                    <p class="text-sm text-gray-600">Created: ${createdDate}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.app.modules.timetable.view(${timetable.id})" 
                            class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View
                    </button>
                    <button onclick="window.app.modules.timetable.deleteTimetable(${timetable.id})" 
                            class="text-red-600 hover:text-red-800 font-medium text-sm">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    validatePrerequisites() {
        const errors = [];
        
        if (this.appState.subjects.length === 0) {
            errors.push('No subjects found. Please add at least one subject.');
        }
        
        if (this.appState.teachers.length === 0) {
            errors.push('No faculty members found. Please add at least one faculty member.');
        }
        
        if (this.appState.classrooms.length === 0) {
            errors.push('No classrooms found. Please add at least one classroom.');
        }
        
        if (this.appState.timeslots.length < 5) {
            errors.push('Not enough time slots. Please add at least 5 time slots.');
        }
        
        const teachersWithSubjects = this.appState.teachers.filter(t => 
            t.subjects && t.subjects.length > 0
        );
        
        if (teachersWithSubjects.length === 0 && this.appState.teachers.length > 0) {
            errors.push('No faculty members have subjects assigned. Please assign subjects to faculty.');
        }
        
        return errors;
    }
    
    async loadTimetables() {
        try {
            this.timetables = await api.timetables.list();
            this.timetables.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            console.error('Error loading timetables:', error);
        }
    }
    
    async generate() {
        const nameInput = document.getElementById('timetableName');
        const name = nameInput.value.trim() || `Timetable ${new Date().toLocaleDateString()}`;
        
        const errors = this.validatePrerequisites();
        if (errors.length > 0) {
            showNotification('Cannot generate timetable. Please check the requirements.', 'error');
            return;
        }
        
        try {
            showNotification('Generating timetable... This may take a moment.', 'info', 0);
            
            const result = await api.timetables.generate({ name });
            
            this.currentTimetable = result;
            nameInput.value = '';
            
            showNotification('Timetable generated successfully!', 'success');
            await this.render();
            
        } catch (error) {
            console.error('Error generating timetable:', error);
            const message = error.data?.error || error.message || 'Failed to generate timetable';
            showNotification(message, 'error');
        }
    }
    
    async view(id) {
        try {
            const timetable = await api.timetables.get(id);
            const entries = await api.timetables.getEntries(id);
            
            this.currentTimetable = {
                ...timetable,
                entries
            };
            
            await this.render();
            
            setTimeout(() => {
                const timetableElement = document.querySelector('.mt-6.bg-white.border');
                if (timetableElement) {
                    timetableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
            
        } catch (error) {
            console.error('Error viewing timetable:', error);
            showNotification('Error loading timetable', 'error');
        }
    }
    
    async deleteTimetable(id) {
        const timetable = this.timetables.find(tt => tt.id === id);
        if (!timetable) return;
        
        if (!confirm(`Are you sure you want to delete "${timetable.name}"?`)) {
            return;
        }
        
        try {
            await api.timetables.delete(id);
            showNotification('Timetable deleted successfully!', 'success');
            
            if (this.currentTimetable && this.currentTimetable.id === id) {
                this.currentTimetable = null;
            }
            
            await this.render();
        } catch (error) {
            console.error('Error deleting timetable:', error);
            showNotification('Error deleting timetable', 'error');
        }
    }
    
    renderTimetableGrid() {
        if (!this.currentTimetable || !this.currentTimetable.entries) {
            return '<div class="text-center py-8 text-gray-500">No timetable data available.</div>';
        }

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const entries = this.currentTimetable.entries;
        
        const timeSlots = [...new Set(entries
            .filter(entry => entry.time_slot)
            .map(entry => entry.time_slot.id))]
            .map(id => entries.find(entry => entry.time_slot && entry.time_slot.id === id).time_slot)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));

        return `
            <div class="overflow-x-auto">
                <table class="w-full border-collapse border">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="border border-gray-300 p-3 font-semibold text-gray-700 min-w-[120px]">Time</th>
                            ${days.map(day => `
                                <th class="border border-gray-300 p-3 font-semibold text-gray-700 min-w-[150px]">${day}</th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${timeSlots.map(timeSlot => `
                            <tr>
                                <td class="border border-gray-300 p-3 font-medium bg-gray-50 text-sm">
                                    ${formatTime(timeSlot.start_time)}<br/>
                                    ${formatTime(timeSlot.end_time)}
                                </td>
                                ${days.map(day => {
                                    const entry = entries.find(e => 
                                        e.time_slot && e.day === day && e.time_slot.id === timeSlot.id
                                    );
                                    
                                    if (entry && entry.is_break) {
                                        return `
                                            <td class="border border-gray-300 p-3 bg-yellow-50">
                                                <div class="text-sm text-yellow-700 font-semibold text-center">
                                                    ${entry.time_slot.break_type === 'short' ? 'SHORT BREAK' : 'LONG BREAK'}
                                                </div>
                                            </td>
                                        `;
                                    }
                                    
                                    if (entry) {
                                        return `
                                            <td class="border border-gray-300 p-3 bg-blue-50">
                                                <div class="text-sm">
                                                    <div class="font-semibold text-blue-900">${entry.subject_name || 'N/A'}</div>
                                                    <div class="text-gray-700 text-xs mt-1">${entry.teacher_name || 'N/A'}</div>
                                                    <div class="text-gray-600 text-xs mt-1">Room: ${entry.classroom_number || 'N/A'}</div>
                                                </div>
                                            </td>
                                        `;
                                    }
                                    
                                    return `<td class="border border-gray-300 p-3 bg-white text-center text-gray-400">-</td>`;
                                }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    exportToPDF() {
        if (!this.currentTimetable) {
            showNotification('No timetable to export', 'warning');
            return;
        }
        
        window.print();
    }
    
    print() {
        if (!this.currentTimetable) {
            showNotification('No timetable to print', 'warning');
            return;
        }
        
        window.print();
    }
}
