import { api } from '../api.js';
import { showNotification } from '../components/notification.js';
import { openModal, closeModal } from '../components/modal.js';
import { createForm, getFormData, setFormLoading } from '../components/forms.js';
import { escapeHtml } from '../utils/helpers.js';

export class ClassroomsModule {
    constructor(appState) {
        this.appState = appState;
        this.searchTerm = '';
        this.filterWing = '';
        this.filterType = '';
    }
    
    async render() {
        const main = document.getElementById('mainContent');
        
        const filteredClassrooms = this.filterClassrooms();
        
        main.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Classrooms</h2>
                    <p class="text-sm text-gray-600">Manage classroom facilities</p>
                </div>
                <button onclick="window.app.modules.classrooms.openForm()" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm">
                    + Add Classroom
                </button>
            </div>
            
            <div class="mb-4 flex flex-col sm:flex-row gap-2">
                <input type="text" 
                       placeholder="Search by room number..." 
                       class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                       oninput="window.app.modules.classrooms.search(this.value)">
                <select class="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        onchange="window.app.modules.classrooms.setWingFilter(this.value)">
                    <option value="">All Wings</option>
                    <option value="A">Wing A</option>
                    <option value="B">Wing B</option>
                    <option value="C">Wing C</option>
                    <option value="D">Wing D</option>
                </select>
                <select class="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        onchange="window.app.modules.classrooms.setTypeFilter(this.value)">
                    <option value="">All Types</option>
                    <option value="Theory">Theory</option>
                    <option value="Practical">Practical</option>
                    <option value="Both">Both</option>
                </select>
            </div>
            
            <div class="bg-white border rounded-lg overflow-hidden shadow-sm">
                ${filteredClassrooms.length > 0 ? `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Room No</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Wing</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Capacity</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${filteredClassrooms.map(classroom => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(classroom.number)}</td>
                                        <td class="px-4 py-3 text-sm">
                                            <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                                Wing ${classroom.wing}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-sm text-gray-700">${classroom.capacity} students</td>
                                        <td class="px-4 py-3 text-sm">
                                            <span class="px-2 py-1 text-xs rounded-full ${this.getTypeColor(classroom.type)}">
                                                ${classroom.type}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            <div class="flex gap-2">
                                                <button onclick="window.app.modules.classrooms.openForm(${classroom.id})" 
                                                        class="text-blue-600 hover:text-blue-800 font-medium">
                                                    Edit
                                                </button>
                                                <button onclick="window.app.modules.classrooms.delete(${classroom.id})" 
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
                        <div class="text-4xl mb-4">🏫</div>
                        <p class="text-gray-500 mb-2">No classrooms found</p>
                        <p class="text-sm text-gray-400">
                            ${this.searchTerm || this.filterWing || this.filterType ? 'Try different filters' : 'Click "Add Classroom" to get started'}
                        </p>
                    </div>
                `}
            </div>
            
            ${filteredClassrooms.length > 0 ? `
                <div class="mt-4 text-sm text-gray-600">
                    Showing ${filteredClassrooms.length} of ${this.appState.classrooms.length} classrooms
                </div>
            ` : ''}
        `;
    }
    
    getTypeColor(type) {
        const colors = {
            'Theory': 'bg-blue-100 text-blue-800',
            'Practical': 'bg-green-100 text-green-800',
            'Both': 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    }
    
    filterClassrooms() {
        let filtered = this.appState.classrooms;
        
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(classroom => 
                classroom.number.toLowerCase().includes(term)
            );
        }
        
        if (this.filterWing) {
            filtered = filtered.filter(classroom => classroom.wing === this.filterWing);
        }
        
        if (this.filterType) {
            filtered = filtered.filter(classroom => classroom.type === this.filterType);
        }
        
        return filtered;
    }
    
    search(term) {
        this.searchTerm = term;
        this.render();
    }
    
    setWingFilter(wing) {
        this.filterWing = wing;
        this.render();
    }
    
    setTypeFilter(type) {
        this.filterType = type;
        this.render();
    }
    
    openForm(id = null) {
        const classroom = id ? this.appState.classrooms.find(c => c.id === id) : null;
        const isEdit = !!classroom;
        
        const fields = [
            {
                type: 'text',
                name: 'number',
                label: 'Room Number',
                value: classroom?.number || '',
                placeholder: 'e.g., 101',
                required: true
            },
            {
                type: 'select',
                name: 'wing',
                label: 'Wing',
                value: classroom?.wing || '',
                required: true,
                options: [
                    { value: 'A', label: 'Wing A' },
                    { value: 'B', label: 'Wing B' },
                    { value: 'C', label: 'Wing C' },
                    { value: 'D', label: 'Wing D' }
                ]
            },
            {
                type: 'number',
                name: 'capacity',
                label: 'Capacity',
                value: classroom?.capacity || '',
                placeholder: 'e.g., 50',
                required: true
            },
            {
                type: 'select',
                name: 'type',
                label: 'Type',
                value: classroom?.type || '',
                required: true,
                options: [
                    { value: 'Theory', label: 'Theory' },
                    { value: 'Practical', label: 'Practical' },
                    { value: 'Both', label: 'Both' }
                ]
            }
        ];
        
        const formHTML = createForm(fields, {
            id: 'classroomForm',
            submitLabel: isEdit ? 'Update' : 'Create',
            cancelLabel: 'Cancel'
        });
        
        const modal = openModal(formHTML, {
            title: `${isEdit ? 'Edit' : 'Add'} Classroom`,
            size: 'md'
        });
        
        const form = document.getElementById('classroomForm');
        const cancelBtn = form.querySelector('.btn-cancel');
        
        cancelBtn.onclick = () => closeModal();
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            setFormLoading(form, true);
            
            try {
                const formData = getFormData(form);
                const data = {
                    number: formData.number,
                    wing: formData.wing,
                    capacity: parseInt(formData.capacity),
                    type: formData.type
                };
                
                if (data.capacity < 1) {
                    showNotification('Capacity must be at least 1', 'error');
                    setFormLoading(form, false);
                    return;
                }
                
                if (isEdit) {
                    await api.classrooms.update(id, data);
                    showNotification('Classroom updated successfully!', 'success');
                } else {
                    await api.classrooms.create(data);
                    showNotification('Classroom created successfully!', 'success');
                }
                
                await window.app.loadAllData();
                closeModal();
            } catch (error) {
                console.error('Error saving classroom:', error);
                showNotification(error.message || 'Error saving classroom', 'error');
                setFormLoading(form, false);
            }
        };
    }
    
    async delete(id) {
        const classroom = this.appState.classrooms.find(c => c.id === id);
        if (!classroom) return;
        
        if (!confirm(`Are you sure you want to delete classroom "${classroom.number}"?`)) {
            return;
        }
        
        try {
            await api.classrooms.delete(id);
            showNotification('Classroom deleted successfully!', 'success');
            await window.app.loadAllData();
        } catch (error) {
            console.error('Error deleting classroom:', error);
            showNotification(error.message || 'Error deleting classroom', 'error');
        }
    }
}
