import { api } from '../api.js';
import { showNotification } from '../components/notification.js';
import { openModal, closeModal } from '../components/modal.js';
import { createForm, getFormData, setFormLoading } from '../components/forms.js';
import { formatTime } from '../utils/helpers.js';
import { validateTime } from '../utils/validation.js';

export class TimeslotsModule {
    constructor(appState) {
        this.appState = appState;
        this.filterDay = '';
    }
    
    async render() {
        const main = document.getElementById('mainContent');
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const filteredSlots = this.filterSlots();
        
        const slotsByDay = days.reduce((acc, day) => {
            acc[day] = filteredSlots.filter(slot => slot.day === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));
            return acc;
        }, {});
        
        main.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Time Slots & Breaks</h2>
                    <p class="text-sm text-gray-600">Manage weekly schedule slots</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.app.modules.timeslots.openForm(false)" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm">
                        + Add Time Slot
                    </button>
                    <button onclick="window.app.modules.timeslots.openForm(true)" 
                            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm">
                        + Add Break
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <select class="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        onchange="window.app.modules.timeslots.setDayFilter(this.value)">
                    <option value="">All Days</option>
                    ${days.map(day => `<option value="${day}">${day}</option>`).join('')}
                </select>
            </div>
            
            ${filteredSlots.length > 0 ? `
                <div class="grid grid-cols-1 gap-4">
                    ${days.map(day => {
                        const daySlots = slotsByDay[day];
                        if (daySlots.length === 0 && this.filterDay) return '';
                        
                        return `
                            <div class="bg-white border rounded-lg overflow-hidden shadow-sm">
                                <div class="bg-gray-50 px-4 py-3 border-b">
                                    <h3 class="font-semibold text-gray-800">${day}</h3>
                                </div>
                                <div class="p-4">
                                    ${daySlots.length > 0 ? `
                                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            ${daySlots.map(slot => this.renderSlotCard(slot)).join('')}
                                        </div>
                                    ` : `
                                        <p class="text-sm text-gray-400 text-center py-4">No time slots for this day</p>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div class="bg-white border rounded-lg shadow-sm">
                    <div class="text-center py-12">
                        <div class="text-4xl mb-4">⏱</div>
                        <p class="text-gray-500 mb-2">No time slots found</p>
                        <p class="text-sm text-gray-400">
                            ${this.filterDay ? 'Try a different day' : 'Click "Add Time Slot" or "Add Break" to get started'}
                        </p>
                    </div>
                </div>
            `}
            
            ${filteredSlots.length > 0 ? `
                <div class="mt-4 text-sm text-gray-600">
                    Total: ${filteredSlots.length} time slots (${filteredSlots.filter(s => !s.is_break).length} lectures, ${filteredSlots.filter(s => s.is_break).length} breaks)
                </div>
            ` : ''}
        `;
    }
    
    renderSlotCard(slot) {
        const isBreak = slot.is_break;
        const bgColor = isBreak ? (slot.break_type === 'short' ? 'bg-green-50' : 'bg-blue-50') : 'bg-gray-50';
        const borderColor = isBreak ? (slot.break_type === 'short' ? 'border-green-200' : 'border-blue-200') : 'border-gray-200';
        const textColor = isBreak ? (slot.break_type === 'short' ? 'text-green-800' : 'text-blue-800') : 'text-gray-800';
        
        return `
            <div class="${bgColor} border ${borderColor} rounded-lg p-3">
                <div class="flex justify-between items-start mb-2">
                    <div class="font-medium ${textColor}">
                        ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}
                    </div>
                    <button onclick="window.app.modules.timeslots.delete(${slot.id})" 
                            class="text-red-600 hover:text-red-800 text-xs">
                        ✕
                    </button>
                </div>
                <div class="text-xs ${textColor}">
                    ${isBreak ? `
                        <span class="font-semibold">
                            ${slot.break_type === 'short' ? 'Short Break' : 'Long Break'}
                        </span>
                    ` : `
                        <span>Lecture Slot</span>
                    `}
                </div>
            </div>
        `;
    }
    
    filterSlots() {
        if (!this.filterDay) return this.appState.timeslots;
        return this.appState.timeslots.filter(slot => slot.day === this.filterDay);
    }
    
    setDayFilter(day) {
        this.filterDay = day;
        this.render();
    }
    
    openForm(isBreak = false) {
        const fields = [
            {
                type: 'select',
                name: 'day',
                label: 'Day',
                value: '',
                required: true,
                options: [
                    { value: 'Monday', label: 'Monday' },
                    { value: 'Tuesday', label: 'Tuesday' },
                    { value: 'Wednesday', label: 'Wednesday' },
                    { value: 'Thursday', label: 'Thursday' },
                    { value: 'Friday', label: 'Friday' },
                    { value: 'Saturday', label: 'Saturday' }
                ]
            },
            {
                type: 'time-range',
                name: 'time',
                label: isBreak ? 'Break Time' : 'Time Slot',
                value: isBreak ? ['11:00', '11:15'] : ['08:00', '09:00'],
                required: true
            }
        ];
        
        if (isBreak) {
            fields.push({
                type: 'select',
                name: 'break_type',
                label: 'Break Type',
                value: 'short',
                required: true,
                options: [
                    { value: 'short', label: 'Short Break (15-20 mins)' },
                    { value: 'long', label: 'Long Break (30-45 mins)' }
                ]
            });
        }
        
        const formHTML = createForm(fields, {
            id: 'timeslotForm',
            submitLabel: 'Create',
            cancelLabel: 'Cancel'
        });
        
        const modal = openModal(formHTML, {
            title: `Add ${isBreak ? 'Break' : 'Time Slot'}`,
            size: 'md'
        });
        
        const form = document.getElementById('timeslotForm');
        const cancelBtn = form.querySelector('.btn-cancel');
        
        cancelBtn.onclick = () => closeModal();
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const formData = getFormData(form);
            
            if (!validateTime(formData.time_start, formData.time_end)) {
                showNotification('End time must be after start time', 'error');
                return;
            }
            
            const conflict = this.checkTimeConflict(
                formData.day,
                formData.time_start,
                formData.time_end
            );
            
            if (conflict) {
                showNotification('Time slot conflicts with existing slot', 'error');
                return;
            }
            
            setFormLoading(form, true);
            
            try {
                const data = {
                    day: formData.day,
                    start_time: formData.time_start,
                    end_time: formData.time_end,
                    is_break: isBreak,
                    break_type: isBreak ? formData.break_type : null
                };
                
                await api.timeslots.create(data);
                showNotification(`${isBreak ? 'Break' : 'Time slot'} created successfully!`, 'success');
                
                await window.app.loadAllData();
                closeModal();
            } catch (error) {
                console.error('Error saving time slot:', error);
                showNotification(error.message || 'Error saving time slot', 'error');
                setFormLoading(form, false);
            }
        };
    }
    
    checkTimeConflict(day, startTime, endTime) {
        return this.appState.timeslots.some(slot => {
            if (slot.day !== day) return false;
            
            const slotStart = slot.start_time;
            const slotEnd = slot.end_time;
            
            return (startTime >= slotStart && startTime < slotEnd) ||
                   (endTime > slotStart && endTime <= slotEnd) ||
                   (startTime <= slotStart && endTime >= slotEnd);
        });
    }
    
    async delete(id) {
        const slot = this.appState.timeslots.find(s => s.id === id);
        if (!slot) return;
        
        const slotType = slot.is_break ? 'break' : 'time slot';
        if (!confirm(`Are you sure you want to delete this ${slotType}?`)) {
            return;
        }
        
        try {
            await api.timeslots.delete(id);
            showNotification(`${slotType.charAt(0).toUpperCase() + slotType.slice(1)} deleted successfully!`, 'success');
            await window.app.loadAllData();
        } catch (error) {
            console.error('Error deleting time slot:', error);
            showNotification(error.message || 'Error deleting time slot', 'error');
        }
    }
}
