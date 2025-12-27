import { api } from '../api.js';
import { showNotification } from '../components/notification.js';
import { openModal, closeModal } from '../components/modal.js';
import { createForm, getFormData, setFormLoading } from '../components/forms.js';
import { escapeHtml } from '../utils/helpers.js';

export class SubjectsModule {
    constructor(appState) {
        this.appState = appState;
        this.searchTerm = '';
    }
    
    async render() {
        const main = document.getElementById('mainContent');
        
        const filteredSubjects = this.filterSubjects();
        
        main.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Subjects</h2>
                    <p class="text-sm text-gray-600">Manage academic subjects</p>
                </div>
                <button onclick="window.app.modules.subjects.openForm()" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm">
                    + Add Subject
                </button>
            </div>
            
            <div class="mb-4">
                <input type="text" 
                       placeholder="Search by code or name..." 
                       class="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                       oninput="window.app.modules.subjects.search(this.value)">
            </div>
            
            <div class="bg-white border rounded-lg overflow-hidden shadow-sm">
                ${filteredSubjects.length > 0 ? `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Code</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Credits</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${filteredSubjects.map(subject => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(subject.code)}</td>
                                        <td class="px-4 py-3 text-sm text-gray-700">${escapeHtml(subject.name)}</td>
                                        <td class="px-4 py-3 text-sm">
                                            <span class="px-2 py-1 text-xs rounded-full ${subject.type === 'Theory' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                                                ${subject.type}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-sm text-gray-700">${subject.credits}</td>
                                        <td class="px-4 py-3 text-sm">
                                            <div class="flex gap-2">
                                                <button onclick="window.app.modules.subjects.openForm(${subject.id})" 
                                                        class="text-blue-600 hover:text-blue-800 font-medium">
                                                    Edit
                                                </button>
                                                <button onclick="window.app.modules.subjects.delete(${subject.id})" 
                                                        class="text-red-600 hover:text-red-800 font-medium">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <div class="text-center py-12">
                        <div class="text-4xl mb-4">📘</div>
                        <p class="text-gray-500 mb-2">No subjects found</p>
                        <p class="text-sm text-gray-400">
                            ${this.searchTerm ? 'Try a different search term' : 'Click "Add Subject" to get started'}
                        </p>
                    </div>
                `}
            </div>
            
            ${filteredSubjects.length > 0 ? `
                <div class="mt-4 text-sm text-gray-600">
                    Showing ${filteredSubjects.length} of ${this.appState.subjects.length} subjects
                </div>
            ` : ''}
        `;
    }
    
    filterSubjects() {
        if (!this.searchTerm) return this.appState.subjects;
        
        const term = this.searchTerm.toLowerCase();
        return this.appState.subjects.filter(subject => 
            subject.code.toLowerCase().includes(term) ||
            subject.name.toLowerCase().includes(term)
        );
    }
    
    search(term) {
        this.searchTerm = term;
        this.render();
    }
    
    openForm(id = null) {
        const subject = id ? this.appState.subjects.find(s => s.id === id) : null;
        const isEdit = !!subject;
        
        const fields = [
            {
                type: 'text',
                name: 'code',
                label: 'Subject Code',
                value: subject?.code || '',
                placeholder: 'e.g., CS101',
                required: true
            },
            {
                type: 'text',
                name: 'name',
                label: 'Subject Name',
                value: subject?.name || '',
                placeholder: 'e.g., Data Structures',
                required: true
            },
            {
                type: 'select',
                name: 'type',
                label: 'Type',
                value: subject?.type || '',
                required: true,
                options: [
                    { value: 'Theory', label: 'Theory' },
                    { value: 'Practical', label: 'Practical' }
                ]
            },
            {
                type: 'number',
                name: 'credits',
                label: 'Credits',
                value: subject?.credits || '',
                placeholder: 'e.g., 3',
                required: true
            }
        ];
        
        const formHTML = createForm(fields, {
            id: 'subjectForm',
            submitLabel: isEdit ? 'Update' : 'Create',
            cancelLabel: 'Cancel'
        });
        
        const modal = openModal(formHTML, {
            title: `${isEdit ? 'Edit' : 'Add'} Subject`,
            size: 'md'
        });
        
        const form = document.getElementById('subjectForm');
        const cancelBtn = form.querySelector('.btn-cancel');
        
        cancelBtn.onclick = () => closeModal();
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            setFormLoading(form, true);
            
            try {
                const formData = getFormData(form);
                const data = {
                    code: formData.code,
                    name: formData.name,
                    type: formData.type,
                    credits: parseInt(formData.credits)
                };
                
                if (isEdit) {
                    await api.subjects.update(id, data);
                    showNotification('Subject updated successfully!', 'success');
                } else {
                    await api.subjects.create(data);
                    showNotification('Subject created successfully!', 'success');
                }
                
                await window.app.loadAllData();
                closeModal();
            } catch (error) {
                console.error('Error saving subject:', error);
                showNotification(error.message || 'Error saving subject', 'error');
                setFormLoading(form, false);
            }
        };
    }
    
    async delete(id) {
        const subject = this.appState.subjects.find(s => s.id === id);
        if (!subject) return;
        
        if (!confirm(`Are you sure you want to delete "${subject.name}"?`)) {
            return;
        }
        
        try {
            await api.subjects.delete(id);
            showNotification('Subject deleted successfully!', 'success');
            await window.app.loadAllData();
        } catch (error) {
            console.error('Error deleting subject:', error);
            showNotification(error.message || 'Error deleting subject', 'error');
        }
    }
}
