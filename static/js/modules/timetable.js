/**
 * Timetable module for Schedulix
 */
import { api } from '../api.js';
import { notifications } from '../components/notification.js';
import { openModal, showConfirm } from '../components/modal.js';

export const timetable = {
    async render(app) {
        const main = document.getElementById('mainContent');
        const activeTimetable = app.state.activeTimetable;
        const allTimetables = app.state.timetables;

        main.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Timetable Management</h2>
                    <p class="text-sm text-gray-500">Generate, view, and export schedules</p>
                </div>
                <button id="generateNewBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-lg shadow-blue-100">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Generate Timetable
                </button>
            </div>

            <div class="grid grid-cols-1 gap-8">
                <!-- Active Timetable View -->
                <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/30">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">🗓</div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">${activeTimetable ? activeTimetable.name : 'No Active Timetable'}</h3>
                                <p class="text-sm text-gray-500">${activeTimetable ? `Generated on ${new Date(activeTimetable.created_at).toLocaleString()}` : 'Generate a new schedule to get started'}</p>
                            </div>
                        </div>
                        ${activeTimetable ? `
                            <div class="flex gap-2">
                                <button onclick="window.printTimetable()" class="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    Print
                                </button>
                                <button onclick="window.exportToCSV(${activeTimetable.id})" class="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                                    Export
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div id="timetableDisplay" class="p-6 overflow-x-auto">
                        ${activeTimetable ? '<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>' : `
                            <div class="text-center py-20">
                                <p class="text-gray-400 italic mb-4">You haven't activated any timetable yet.</p>
                                <button onclick="document.getElementById('generateNewBtn').click()" class="text-blue-600 font-bold hover:underline">Create your first schedule &rarr;</button>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Timetable History -->
                <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-gray-100 bg-gray-50/30">
                        <h3 class="text-lg font-bold text-gray-800">Saved Timetables</h3>
                    </div>
                    <div class="divide-y divide-gray-100">
                        ${allTimetables.length > 0 ? allTimetables.map(tt => `
                            <div class="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full ${tt.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center">
                                        ${tt.is_active ? '✓' : '•'}
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-700">${tt.name}</h4>
                                        <p class="text-xs text-gray-400">${new Date(tt.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    ${!tt.is_active ? `<button onclick="window.activateTimetable(${tt.id})" class="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1">Activate</button>` : ''}
                                    <button onclick="window.viewTimetable(${tt.id})" class="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-1">View</button>
                                    <button onclick="window.deleteTimetable(${tt.id})" class="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-1">Delete</button>
                                </div>
                            </div>
                        `).join('') : '<div class="p-8 text-center text-gray-400 italic">No saved timetables found.</div>'}
                    </div>
                </div>
            </div>
        `;

        if (activeTimetable) {
            this.loadTimetableEntries(activeTimetable.id);
        }

        this.setupEvents(app);
    },

    async loadTimetableEntries(id) {
        try {
            const entries = await api.timetables.get(id);
            // Wait, api.timetables.get returns the timetable object with entries if serializer includes them
            // Let's check serializer
            const container = document.getElementById('timetableDisplay');
            if (!entries || !entries.entries || entries.entries.length === 0) {
                container.innerHTML = '<div class="text-center py-10 text-gray-500 italic">No entries found for this timetable.</div>';
                return;
            }
            this.renderFullGrid(container, entries.entries);
        } catch (error) {
            notifications.error('Failed to load timetable details');
        }
    },

    renderFullGrid(container, entries) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Group entries by day
        const byDay = {};
        days.forEach(day => {
            byDay[day] = entries.filter(e => e.time_slot.day === day)
                .sort((a, b) => a.time_slot.start_time.localeCompare(b.time_slot.start_time));
        });

        container.innerHTML = `
            <div class="space-y-8">
                ${days.map(day => {
                    if (byDay[day].length === 0) return '';
                    return `
                        <div>
                            <h4 class="font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">${day}</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                ${byDay[day].map(entry => `
                                    <div class="p-4 rounded-xl border ${entry.time_slot.is_break ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100 shadow-sm'}">
                                        <div class="text-xs font-bold ${entry.time_slot.is_break ? 'text-green-600' : 'text-blue-600'} mb-1 uppercase">
                                            ${entry.time_slot.start_time.substring(0, 5)} - ${entry.time_slot.end_time.substring(0, 5)}
                                        </div>
                                        ${entry.time_slot.is_break ? `
                                            <div class="font-bold text-green-800">${entry.time_slot.break_name || 'Break'}</div>
                                        ` : `
                                            <div class="font-bold text-gray-800 truncate">${entry.subject.name}</div>
                                            <div class="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                                <span>👨‍🏫</span> ${entry.teacher.name}
                                            </div>
                                            <div class="text-sm text-gray-600 flex items-center gap-1">
                                                <span>🏫</span> ${entry.classroom.number}
                                            </div>
                                        `}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    setupEvents(app) {
        document.getElementById('generateNewBtn').onclick = () => this.openGenerateForm(app);
        
        window.activateTimetable = async (id) => {
            try {
                await api.timetables.activate(id);
                notifications.success('Timetable activated');
                await app.refreshData();
            } catch (error) {
                notifications.error('Failed to activate timetable');
            }
        };

        window.viewTimetable = (id) => {
            const container = document.getElementById('timetableDisplay');
            container.innerHTML = '<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>';
            this.loadTimetableEntries(id);
            // Scroll to top of timetable display
            container.scrollIntoView({ behavior: 'smooth' });
        };

        window.deleteTimetable = (id) => {
            showConfirm('Delete Timetable', 'Are you sure? This will permanently remove this schedule.', async () => {
                try {
                    await api.timetables.delete(id);
                    notifications.success('Timetable deleted');
                    await app.refreshData();
                } catch (error) {
                    notifications.error('Failed to delete timetable');
                }
            });
        };

        window.printTimetable = () => {
            window.print();
        };

        window.exportToCSV = (id) => {
            notifications.info('Exporting to CSV...');
            window.open(api.timetables.exportCsv(id), '_blank');
        };
    },

    openGenerateForm(app) {
        // Validation before showing form
        const issues = [];
        if (app.state.subjects.length === 0) issues.push('Add at least one subject');
        if (app.state.teachers.length === 0) issues.push('Register faculty members');
        if (app.state.classrooms.length === 0) issues.push('Define classrooms');
        if (app.state.timeslots.length === 0) issues.push('Set up time slots');
        
        if (issues.length > 0) {
            openModal('Missing Requirements', `
                <div class="text-red-600 space-y-2">
                    <p class="font-bold">Cannot generate timetable yet:</p>
                    <ul class="list-disc ml-5">
                        ${issues.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            `);
            return;
        }

        openModal('Generate New Timetable', `
            <form id="generateForm" class="space-y-4">
                <p class="text-sm text-gray-600">This will automatically create a conflict-free schedule based on your current data.</p>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Schedule Name</label>
                    <input type="text" name="name" value="Semester Schedule - ${new Date().getFullYear()}" required
                           class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
            </form>
        `, {
            showConfirm: true,
            confirmText: 'Start Generation',
            onConfirm: async (close) => {
                const form = document.getElementById('generateForm');
                const name = new FormData(form).get('name');
                
                notifications.info('Generating timetable, please wait...');
                
                try {
                    const result = await api.timetables.generate({ name });
                    notifications.success('New timetable generated and activated!');
                    await app.refreshData();
                    close();
                } catch (error) {
                    notifications.error(error.message || 'Generation failed. Check if you have enough time slots and teacher availability.');
                }
            }
        });
    }
};
