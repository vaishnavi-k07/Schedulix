/**
 * Teachers module for Schedulix
 */
import { api } from '../api.js';
import { notifications } from '../components/notification.js';
import { openModal, showConfirm } from '../components/modal.js';

export const teachers = {
    render(app) {
        const main = document.getElementById('mainContent');
        const list = app.state.teachers;

        main.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Faculty</h2>
                    <p class="text-sm text-gray-500">Manage teachers and their subject assignments</p>
                </div>
                <button id="addTeacherBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <span>+</span> Add Faculty
                </button>
            </div>
            
            <div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Availability</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Load</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjects</th>
                                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="teacherTableBody" class="divide-y divide-gray-100">
                            ${this.renderTableRows(list, app)}
                        </tbody>
                    </table>
                </div>
                ${list.length === 0 ? `
                    <div class="text-center py-12 text-gray-500">
                        <div class="text-4xl mb-2">👩‍🏫</div>
                        <p>No faculty members added yet. Click "Add Faculty" to get started.</p>
                    </div>
                ` : ''}
            </div>
        `;

        this.setupEvents(app);
    },

    renderTableRows(teachers, app) {
        return teachers.map(teacher => {
            const teacherSubjects = teacher.subjects.map(sid => {
                const s = app.state.subjects.find(sub => sub.id === sid);
                return s ? s.code : '';
            }).filter(Boolean).join(', ');

            return `
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">${teacher.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teacher.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${teacher.start_time.substring(0, 5)} - ${teacher.end_time.substring(0, 5)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${teacher.max_lectures_per_day} l/d, max ${teacher.max_continuous_lectures} cont.
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title="${teacherSubjects}">
                        ${teacherSubjects || '<span class="text-red-400 italic">None assigned</span>'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex justify-end gap-3">
                            <button onclick="window.editTeacher(${teacher.id})" class="text-blue-600 hover:text-blue-900">Edit</button>
                            <button onclick="window.deleteTeacher(${teacher.id})" class="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    setupEvents(app) {
        document.getElementById('addTeacherBtn').onclick = () => this.openForm(app);
        window.editTeacher = (id) => this.openForm(app, id);
        window.deleteTeacher = (id) => this.handleDelete(app, id);
    },

    openForm(app, id = null) {
        const teacher = id ? app.state.teachers.find(t => t.id === id) : null;
        const title = id ? 'Edit Faculty Member' : 'Add New Faculty Member';
        
        const content = `
            <form id="teacherForm" class="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="name" value="${teacher ? teacher.name : ''}" placeholder="Dr. Jane Smith" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" value="${teacher ? teacher.email : ''}" placeholder="jane.smith@example.com" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input type="time" name="start_time" value="${teacher ? teacher.start_time.substring(0, 5) : '09:00'}" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input type="time" name="end_time" value="${teacher ? teacher.end_time.substring(0, 5) : '17:00'}" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Max Lectures / Day</label>
                        <input type="number" name="max_lectures_per_day" value="${teacher ? teacher.max_lectures_per_day : 4}" min="1" max="8" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Max Continuous</label>
                        <input type="number" name="max_continuous_lectures" value="${teacher ? teacher.max_continuous_lectures : 2}" min="1" max="4" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Subjects</label>
                    <div class="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border max-h-40 overflow-y-auto">
                        ${app.state.subjects.map(s => `
                            <label class="flex items-center gap-2 text-sm p-1 hover:bg-white rounded cursor-pointer">
                                <input type="checkbox" name="subjects" value="${s.id}" ${teacher?.subjects.includes(s.id) ? 'checked' : ''} class="rounded text-blue-600" />
                                <span>${s.code} - ${s.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </form>
        `;

        openModal(title, content, {
            showConfirm: true,
            confirmText: id ? 'Update Faculty' : 'Add Faculty',
            onConfirm: async (close) => {
                const form = document.getElementById('teacherForm');
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Handle multiple checkboxes for subjects
                data.subjects = Array.from(formData.getAll('subjects')).map(Number);
                
                if (data.subjects.length === 0) {
                    notifications.warning('Please assign at least one subject');
                    return;
                }

                if (data.start_time >= data.end_time) {
                    notifications.warning('Start time must be before end time');
                    return;
                }
                
                try {
                    if (id) {
                        await api.teachers.update(id, data);
                        notifications.success('Faculty updated successfully');
                    } else {
                        await api.teachers.create(data);
                        notifications.success('Faculty added successfully');
                    }
                    await app.refreshData();
                    close();
                } catch (error) {
                    notifications.error(error.message || 'Failed to save faculty member');
                }
            }
        });
    },

    async handleDelete(app, id) {
        showConfirm('Delete Faculty Member', 'Are you sure you want to remove this teacher? This will affect any generated timetables.', async () => {
            try {
                await api.teachers.delete(id);
                notifications.success('Faculty member removed');
                await app.refreshData();
            } catch (error) {
                notifications.error('Failed to delete teacher');
            }
        });
    }
};
