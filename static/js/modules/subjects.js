/**
 * Subjects module for Schedulix
 */
import { api } from '../api.js';
import { notifications } from '../components/notification.js';
import { openModal, showConfirm } from '../components/modal.js';

export const subjects = {
    render(app) {
        const main = document.getElementById('mainContent');
        const list = app.state.subjects;

        main.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Subjects</h2>
                    <p class="text-sm text-gray-500">Manage curriculum subjects and credits</p>
                </div>
                <button id="addSubjectBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <span>+</span> Add Subject
                </button>
            </div>
            
            <div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-4">
                    <input type="text" id="subjectSearch" placeholder="Search subjects..." class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
                                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="subjectTableBody" class="divide-y divide-gray-100">
                            ${this.renderTableRows(list)}
                        </tbody>
                    </table>
                </div>
                ${list.length === 0 ? `
                    <div class="text-center py-12 text-gray-500">
                        <div class="text-4xl mb-2">📘</div>
                        <p>No subjects added yet. Click "Add Subject" to get started.</p>
                    </div>
                ` : ''}
            </div>
        `;

        this.setupEvents(app);
    },

    renderTableRows(subjects) {
        return subjects.map(subject => `
            <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">${subject.code}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${subject.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${subject.type === 'Theory' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}">
                        ${subject.type}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${subject.credits}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-3">
                        <button onclick="window.editSubject(${subject.id})" class="text-blue-600 hover:text-blue-900">Edit</button>
                        <button onclick="window.deleteSubject(${subject.id})" class="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    setupEvents(app) {
        document.getElementById('addSubjectBtn').onclick = () => this.openForm(app);
        
        const searchInput = document.getElementById('subjectSearch');
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = app.state.subjects.filter(s => 
                s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term)
            );
            document.getElementById('subjectTableBody').innerHTML = this.renderTableRows(filtered);
        };

        // Expose to window for inline onclick handlers
        window.editSubject = (id) => this.openForm(app, id);
        window.deleteSubject = (id) => this.handleDelete(app, id);
    },

    openForm(app, id = null) {
        const subject = id ? app.state.subjects.find(s => s.id === id) : null;
        const title = id ? 'Edit Subject' : 'Add New Subject';
        
        const content = `
            <form id="subjectForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                    <input type="text" name="code" value="${subject ? subject.code : ''}" placeholder="e.g., CS101" required
                           class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input type="text" name="name" value="${subject ? subject.name : ''}" placeholder="e.g., Operating Systems" required
                           class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select name="type" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option value="Theory" ${subject?.type === 'Theory' ? 'selected' : ''}>Theory</option>
                            <option value="Practical" ${subject?.type === 'Practical' ? 'selected' : ''}>Practical</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                        <input type="number" name="credits" value="${subject ? subject.credits : 3}" min="1" max="6" required
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                </div>
            </form>
        `;

        openModal(title, content, {
            showConfirm: true,
            confirmText: id ? 'Update Subject' : 'Create Subject',
            onConfirm: async (close) => {
                const form = document.getElementById('subjectForm');
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                try {
                    if (id) {
                        await api.subjects.update(id, data);
                        notifications.success('Subject updated successfully');
                    } else {
                        await api.subjects.create(data);
                        notifications.success('Subject created successfully');
                    }
                    await app.refreshData();
                    close();
                } catch (error) {
                    notifications.error(error.message || 'Failed to save subject');
                }
            }
        });
    },

    async handleDelete(app, id) {
        showConfirm('Delete Subject', 'Are you sure you want to delete this subject? All associated timetable entries will be removed.', async () => {
            try {
                await api.subjects.delete(id);
                notifications.success('Subject deleted');
                await app.refreshData();
            } catch (error) {
                notifications.error('Failed to delete subject');
            }
        });
    }
};
