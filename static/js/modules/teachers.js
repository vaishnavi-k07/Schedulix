import { api } from '../api.js';
import { showNotification } from '../components/notification.js';
import { openModal, closeModal } from '../components/modal.js';
import { createFormField, getFormData, setFormLoading } from '../components/forms.js';
import { escapeHtml, formatTime } from '../utils/helpers.js';
import { validateEmail, validateTime } from '../utils/validation.js';

export class TeachersModule {
    constructor(appState) {
        this.appState = appState;
        this.searchTerm = '';
    }
    
    async render() {
        const main = document.getElementById('mainContent');
        
        const filteredTeachers = this.filterTeachers();
        
        main.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Faculty</h2>
                    <p class="text-sm text-gray-600">Manage faculty members and their assignments</p>
                </div>
                <button onclick="window.app.modules.teachers.openForm()" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm">
                    + Add Faculty
                </button>
            </div>
            
            <div class="mb-4">
                <input type="text" 
                       placeholder="Search by name or email..." 
                       class="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                       oninput="window.app.modules.teachers.search(this.value)">
            </div>
            
            <div class="bg-white border rounded-lg overflow-hidden shadow-sm">
                ${filteredTeachers.length > 0 ? `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Available Time</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Subjects</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Lectures/Day</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${filteredTeachers.map(teacher => this.renderTeacherRow(teacher)).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <div class="text-center py-12">
                        <div class="text-4xl mb-4">👩‍🏫</div>
                        <p class="text-gray-500 mb-2">No faculty members found</p>
                        <p class="text-sm text-gray-400">
                            ${this.searchTerm ? 'Try a different search term' : 'Click "Add Faculty" to get started'}
                        </p>
                    </div>
                `}
            </div>
            
            ${filteredTeachers.length > 0 ? `
                <div class="mt-4 text-sm text-gray-600">
                    Showing ${filteredTeachers.length} of ${this.appState.teachers.length} faculty members
                </div>
            ` : ''}
        `;
    }
    
    renderTeacherRow(teacher) {
        const assignedSubjects = teacher.subjects || [];
        const subjectNames = assignedSubjects
            .map(subId => {
                const subject = this.appState.subjects.find(s => s.id === subId);
                return subject ? subject.code : '';
            })
            .filter(Boolean)
            .join(', ');
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(teacher.name)}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${escapeHtml(teacher.email)}</td>
                <td class="px-4 py-3 text-sm text-gray-700">
                    ${formatTime(teacher.start_time)} - ${formatTime(teacher.end_time)}
                </td>
                <td class="px-4 py-3 text-sm">
                    ${assignedSubjects.length > 0 ? `
                        <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full" 
                              title="${subjectNames}">
                            ${assignedSubjects.length} subject${assignedSubjects.length !== 1 ? 's' : ''}
                        </span>
                    ` : `
                        <span class="text-gray-400 text-xs">No subjects</span>
                    `}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">${teacher.lectures_per_day}</td>
                <td class="px-4 py-3 text-sm">
                    <div class="flex gap-2">
                        <button onclick="window.app.modules.teachers.openForm(${teacher.id})" 
                                class="text-blue-600 hover:text-blue-800 font-medium">
                            Edit
                        </button>
                        <button onclick="window.app.modules.teachers.delete(${teacher.id})" 
                                class="text-red-600 hover:text-red-800 font-medium">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    filterTeachers() {
        if (!this.searchTerm) return this.appState.teachers;
        
        const term = this.searchTerm.toLowerCase();
        return this.appState.teachers.filter(teacher => 
            teacher.name.toLowerCase().includes(term) ||
            teacher.email.toLowerCase().includes(term)
        );
    }
    
    search(term) {
        this.searchTerm = term;
        this.render();
    }
    
    openForm(id = null) {
        const teacher = id ? this.appState.teachers.find(t => t.id === id) : null;
        const isEdit = !!teacher;
        
        if (this.appState.subjects.length === 0) {
            showNotification('Please add subjects first before adding faculty', 'warning');
            return;
        }
        
        const subjectOptions = this.appState.subjects.map(s => ({
            value: s.id,
            label: `${s.code} - ${s.name} (${s.type})`
        }));
        
        const formHTML = `
            <form id="teacherForm" class="space-y-4">
                ${createFormField({
                    type: 'text',
                    name: 'name',
                    label: 'Faculty Name',
                    value: teacher?.name || '',
                    placeholder: 'e.g., Dr. Smith',
                    required: true
                })}
                
                ${createFormField({
                    type: 'email',
                    name: 'email',
                    label: 'Email',
                    value: teacher?.email || '',
                    placeholder: 'e.g., dr.smith@university.edu',
                    required: true
                })}
                
                ${createFormField({
                    type: 'time-range',
                    name: 'time',
                    label: 'Available Time',
                    value: teacher ? [teacher.start_time, teacher.end_time] : ['08:00', '17:00'],
                    required: true
                })}
                
                ${createFormField({
                    type: 'number',
                    name: 'lectures_per_day',
                    label: 'Max Lectures per Day',
                    value: teacher?.lectures_per_day || 4,
                    placeholder: 'e.g., 4',
                    required: true
                })}
                
                ${createFormField({
                    type: 'number',
                    name: 'max_continuous_lectures',
                    label: 'Max Continuous Lectures',
                    value: teacher?.max_continuous_lectures || 2,
                    placeholder: 'e.g., 2',
                    required: true
                })}
                
                ${createFormField({
                    type: 'checkbox-group',
                    name: 'subjects',
                    label: 'Subjects They Teach',
                    value: teacher?.subjects || [],
                    options: subjectOptions
                })}
                
                <div class="flex gap-2 pt-4 border-t">
                    <button type="button" class="btn-cancel flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                        Cancel
                    </button>
                    <button type="submit" class="btn-submit flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        ${isEdit ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        `;
        
        const modal = openModal(formHTML, {
            title: `${isEdit ? 'Edit' : 'Add'} Faculty`,
            size: 'lg'
        });
        
        const form = document.getElementById('teacherForm');
        const cancelBtn = form.querySelector('.btn-cancel');
        
        cancelBtn.onclick = () => closeModal();
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const formData = getFormData(form);
            
            if (!validateEmail(formData.email)) {
                showNotification('Invalid email format', 'error');
                return;
            }
            
            if (!validateTime(formData.time_start, formData.time_end)) {
                showNotification('End time must be after start time', 'error');
                return;
            }
            
            const subjects = formData.subjects ? 
                (Array.isArray(formData.subjects) ? formData.subjects : [formData.subjects]) : [];
            
            if (subjects.length === 0) {
                showNotification('Please assign at least one subject', 'error');
                return;
            }
            
            setFormLoading(form, true);
            
            try {
                const data = {
                    name: formData.name,
                    email: formData.email,
                    start_time: formData.time_start,
                    end_time: formData.time_end,
                    lectures_per_day: parseInt(formData.lectures_per_day),
                    max_continuous_lectures: parseInt(formData.max_continuous_lectures),
                    subjects: subjects.map(s => parseInt(s))
                };
                
                if (isEdit) {
                    await api.teachers.update(id, data);
                    showNotification('Faculty updated successfully!', 'success');
                } else {
                    await api.teachers.create(data);
                    showNotification('Faculty created successfully!', 'success');
                }
                
                await window.app.loadAllData();
                closeModal();
            } catch (error) {
                console.error('Error saving teacher:', error);
                showNotification(error.message || 'Error saving faculty', 'error');
                setFormLoading(form, false);
            }
        };
    }
    
    async delete(id) {
        const teacher = this.appState.teachers.find(t => t.id === id);
        if (!teacher) return;
        
        if (!confirm(`Are you sure you want to delete "${teacher.name}"?`)) {
            return;
        }
        
        try {
            await api.teachers.delete(id);
            showNotification('Faculty deleted successfully!', 'success');
            await window.app.loadAllData();
        } catch (error) {
            console.error('Error deleting teacher:', error);
            showNotification(error.message || 'Error deleting faculty', 'error');
        }
    }
}
