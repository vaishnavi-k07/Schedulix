/**
 * Classrooms module for Schedulix
 */
import { api } from '../api.js';
import { notifications } from '../components/notification.js';
import { openModal, showConfirm } from '../components/modal.js';

export const classrooms = {
    render(app) {
        const main = document.getElementById('mainContent');
        const list = app.state.classrooms;

        main.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Classrooms</h2>
                    <p class="text-sm text-gray-500">Manage rooms, capacity, and types</p>
                </div>
                <button id="addClassroomBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <span>+</span> Add Classroom
                </button>
            </div>
            
            <div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room Number</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Wing</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="classroomTableBody" class="divide-y divide-gray-100">
                            ${this.renderTableRows(list)}
                        </tbody>
                    </table>
                </div>
                ${list.length === 0 ? `
                    <div class="text-center py-12 text-gray-500">
                        <div class="text-4xl mb-2">🏫</div>
                        <p>No classrooms added yet. Click "Add Classroom" to get started.</p>
                    </div>
                ` : ''}
            </div>
        `;

        this.setupEvents(app);
    },

    renderTableRows(classrooms) {
        return classrooms.map(room => `
            <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">${room.number}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${room.capacity} seats</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Wing ${room.wing}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${
                        room.room_type === 'Theory' ? 'bg-blue-100 text-blue-700' : 
                        room.room_type === 'Practical' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }">
                        ${room.room_type}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-3">
                        <button onclick="window.editClassroom(${room.id})" class="text-blue-600 hover:text-blue-900">Edit</button>
                        <button onclick="window.deleteClassroom(${room.id})" class="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    setupEvents(app) {
        document.getElementById('addClassroomBtn').onclick = () => this.openForm(app);
        window.editClassroom = (id) => this.openForm(app, id);
        window.deleteClassroom = (id) => this.handleDelete(app, id);
    },

    openForm(app, id = null) {
        const room = id ? app.state.classrooms.find(r => r.id === id) : null;
        const title = id ? 'Edit Classroom' : 'Add New Classroom';
        
        const content = `
            <form id="classroomForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Room Number / Name</label>
                    <input type="text" name="number" value="${room ? room.number : ''}" placeholder="e.g., 301 or Lab A" required
                           class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input type="number" name="capacity" value="${room ? room.capacity : 60}" min="1" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Wing</label>
                        <select name="wing" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option value="A" ${room?.wing === 'A' ? 'selected' : ''}>Wing A</option>
                            <option value="B" ${room?.wing === 'B' ? 'selected' : ''}>Wing B</option>
                            <option value="C" ${room?.wing === 'C' ? 'selected' : ''}>Wing C</option>
                            <option value="D" ${room?.wing === 'D' ? 'selected' : ''}>Wing D</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                    <select name="room_type" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="Theory" ${room?.room_type === 'Theory' ? 'selected' : ''}>Theory Only</option>
                        <option value="Practical" ${room?.room_type === 'Practical' ? 'selected' : ''}>Practical/Lab Only</option>
                        <option value="Both" ${room?.room_type === 'Both' ? 'selected' : ''}>Both Theory & Practical</option>
                    </select>
                </div>
            </form>
        `;

        openModal(title, content, {
            showConfirm: true,
            confirmText: id ? 'Update Classroom' : 'Create Classroom',
            onConfirm: async (close) => {
                const form = document.getElementById('classroomForm');
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                try {
                    if (id) {
                        await api.classrooms.update(id, data);
                        notifications.success('Classroom updated successfully');
                    } else {
                        await api.classrooms.create(data);
                        notifications.success('Classroom created successfully');
                    }
                    await app.refreshData();
                    close();
                } catch (error) {
                    notifications.error(error.message || 'Failed to save classroom');
                }
            }
        });
    },

    async handleDelete(app, id) {
        showConfirm('Delete Classroom', 'Are you sure you want to delete this room? This cannot be undone.', async () => {
            try {
                await api.classrooms.delete(id);
                notifications.success('Classroom deleted');
                await app.refreshData();
            } catch (error) {
                notifications.error('Failed to delete classroom');
            }
        });
    }
};
