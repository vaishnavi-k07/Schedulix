/**
 * Time Slots module for Schedulix
 */
import { api } from '../api.js';
import { notifications } from '../components/notification.js';
import { openModal, showConfirm } from '../components/modal.js';

export const timeslots = {
    render(app) {
        const main = document.getElementById('mainContent');
        const list = app.state.timeslots;
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        main.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Time Slots</h2>
                    <p class="text-sm text-gray-500">Define daily schedule and breaks</p>
                </div>
                <button id="addTimeSlotBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <span>+</span> Add Time Slot
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${days.map(day => `
                    <div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="font-bold text-gray-700 text-sm uppercase tracking-wider">${day}</h3>
                            <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                ${list.filter(s => s.day === day).length} Slots
                            </span>
                        </div>
                        <div class="p-2 space-y-2">
                            ${this.renderDaySlots(list.filter(s => s.day === day), app)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.setupEvents(app);
    },

    renderDaySlots(slots, app) {
        if (slots.length === 0) {
            return `<p class="text-center py-4 text-xs text-gray-400 italic">No slots defined</p>`;
        }

        // Sort by start time
        const sortedSlots = [...slots].sort((a, b) => a.start_time.localeCompare(b.start_time));

        return sortedSlots.map(slot => `
            <div class="flex items-center justify-between p-3 rounded-lg border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-700">
                        ${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(0, 5)}
                    </span>
                    <span class="text-[10px] font-medium uppercase ${slot.is_break ? 'text-green-600' : 'text-blue-500'}">
                        ${slot.is_break ? `Break (${slot.break_name || 'Generic'})` : 'Regular Class'}
                    </span>
                </div>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="window.editTimeSlot(${slot.id})" class="text-blue-600 hover:text-blue-800 p-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L11.707 15.513a1 1 0 01-.393.287l-4.243 1.414 1.414-4.243a1 1 0 01.287-.393L16.5 3.5z"></path></svg>
                    </button>
                    <button onclick="window.deleteTimeSlot(${slot.id})" class="text-red-600 hover:text-red-800 p-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');
    },

    setupEvents(app) {
        document.getElementById('addTimeSlotBtn').onclick = () => this.openForm(app);
        window.editTimeSlot = (id) => this.openForm(app, id);
        window.deleteTimeSlot = (id) => this.handleDelete(app, id);
    },

    openForm(app, id = null) {
        const slot = id ? app.state.timeslots.find(s => s.id === id) : null;
        const title = id ? 'Edit Time Slot' : 'Add New Time Slot';
        
        const content = `
            <form id="timeslotForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                        <select name="day" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option value="Monday" ${slot?.day === 'Monday' ? 'selected' : ''}>Monday</option>
                            <option value="Tuesday" ${slot?.day === 'Tuesday' ? 'selected' : ''}>Tuesday</option>
                            <option value="Wednesday" ${slot?.day === 'Wednesday' ? 'selected' : ''}>Wednesday</option>
                            <option value="Thursday" ${slot?.day === 'Thursday' ? 'selected' : ''}>Thursday</option>
                            <option value="Friday" ${slot?.day === 'Friday' ? 'selected' : ''}>Friday</option>
                            <option value="Saturday" ${slot?.day === 'Saturday' ? 'selected' : ''}>Saturday</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input type="time" name="start_time" value="${slot ? slot.start_time.substring(0, 5) : '09:00'}" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input type="time" name="end_time" value="${slot ? slot.end_time.substring(0, 5) : '10:00'}" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                    <input type="checkbox" name="is_break" id="isBreakCheckbox" ${slot?.is_break ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded" />
                    <label for="isBreakCheckbox" class="text-sm font-medium text-gray-700">Is this a break? (Recess, Lunch, etc.)</label>
                </div>
                <div id="breakNameContainer" class="${slot?.is_break ? '' : 'hidden'}">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Break Name</label>
                    <input type="text" name="break_name" value="${slot?.break_name || ''}" placeholder="e.g., Lunch Break" 
                           class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
            </form>
        `;

        openModal(title, content, {
            showConfirm: true,
            confirmText: id ? 'Update Slot' : 'Create Slot',
            onRender: () => {
                const checkbox = document.getElementById('isBreakCheckbox');
                const container = document.getElementById('breakNameContainer');
                checkbox.onchange = () => container.classList.toggle('hidden', !checkbox.checked);
            },
            onConfirm: async (close) => {
                const form = document.getElementById('timeslotForm');
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                data.is_break = formData.get('is_break') === 'on';
                if (!data.is_break) delete data.break_name;
                
                if (data.start_time >= data.end_time) {
                    notifications.warning('Start time must be before end time');
                    return;
                }
                
                try {
                    if (id) {
                        await api.timeslots.update(id, data);
                        notifications.success('Time slot updated successfully');
                    } else {
                        await api.timeslots.create(data);
                        notifications.success('Time slot created successfully');
                    }
                    await app.refreshData();
                    close();
                } catch (error) {
                    notifications.error(error.message || 'Failed to save time slot');
                }
            }
        });
    },

    async handleDelete(app, id) {
        showConfirm('Delete Time Slot', 'Are you sure you want to remove this time slot? It will be removed from all days if recurring.', async () => {
            try {
                await api.timeslots.delete(id);
                notifications.success('Time slot removed');
                await app.refreshData();
            } catch (error) {
                notifications.error('Failed to delete time slot');
            }
        });
    }
};
