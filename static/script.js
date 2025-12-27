// API Base URL
const API_BASE = 'http://localhost:8000/api';

// Global data storage
let appData = {
    subjects: [],
    teachers: [],
    classrooms: [],
    timeslots: [],
    currentTimetable: null
};

// API Functions
const api = {
    // Subjects
    async getSubjects() {
        const response = await fetch(`${API_BASE}/subjects/`);
        return await response.json();
    },

    async createSubject(subjectData) {
        const response = await fetch(`${API_BASE}/subjects/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subjectData)
        });
        return await response.json();
    },

    async updateSubject(id, subjectData) {
        const response = await fetch(`${API_BASE}/subjects/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subjectData)
        });
        return await response.json();
    },

    async deleteSubject(id) {
        await fetch(`${API_BASE}/subjects/${id}/`, { method: 'DELETE' });
    },

    // Teachers
    async getTeachers() {
        const response = await fetch(`${API_BASE}/teachers/`);
        return await response.json();
    },

    async createTeacher(teacherData) {
        const response = await fetch(`${API_BASE}/teachers/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teacherData)
        });
        return await response.json();
    },

    async updateTeacher(id, teacherData) {
        const response = await fetch(`${API_BASE}/teachers/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teacherData)
        });
        return await response.json();
    },

    async deleteTeacher(id) {
        await fetch(`${API_BASE}/teachers/${id}/`, { method: 'DELETE' });
    },

    // Classrooms
    async getClassrooms() {
        const response = await fetch(`${API_BASE}/classrooms/`);
        return await response.json();
    },

    async createClassroom(classroomData) {
        const response = await fetch(`${API_BASE}/classrooms/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(classroomData)
        });
        return await response.json();
    },

    async updateClassroom(id, classroomData) {
        const response = await fetch(`${API_BASE}/classrooms/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(classroomData)
        });
        return await response.json();
    },

    async deleteClassroom(id) {
        await fetch(`${API_BASE}/classrooms/${id}/`, { method: 'DELETE' });
    },

    // TimeSlots
    async getTimeSlots() {
        const response = await fetch(`${API_BASE}/timeslots/`);
        return await response.json();
    },

    async createTimeSlot(slotData) {
        const response = await fetch(`${API_BASE}/timeslots/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slotData)
        });
        return await response.json();
    },

    async deleteTimeSlot(id) {
        await fetch(`${API_BASE}/timeslots/${id}/`, { method: 'DELETE' });
    },

    // Timetable
    async generateTimetable(name = 'Auto-generated Timetable') {
        const response = await fetch(`${API_BASE}/timetables/generate/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        return await response.json();
    },

    async getTimetables() {
        const response = await fetch(`${API_BASE}/timetables/`);
        return await response.json();
    },

    async getTimetableEntries(timetableId) {
        const response = await fetch(`${API_BASE}/timetables/${timetableId}/entries/`);
        return await response.json();
    }
};

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function closeModal() {
    document.getElementById('modalRoot').innerHTML = "";
}

// Router
const main = document.getElementById("mainContent");
const modalRoot = document.getElementById("modalRoot");

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

function router() {
    const hash = window.location.hash || "#/dashboard";
    
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active-link", link.getAttribute("href") === hash);
    });

    switch (hash) {
        case "#/subjects": renderSubjects(); break;
        case "#/teachers": renderTeachers(); break;
        case "#/classrooms": renderClassrooms(); break;
        case "#/timeslots": renderTimeSlots(); break;
        case "#/timetable": renderTimetable(); break;
        default: renderDashboard(); break;
    }
}

// Dashboard
function renderDashboard() {
    const stats = [
        { name: 'Subjects', count: appData.subjects.length, color: 'blue', icon: '📘' },
        { name: 'Faculty', count: appData.teachers.length, color: 'green', icon: '👩‍🏫' },
        { name: 'Classrooms', count: appData.classrooms.length, color: 'purple', icon: '🏫' },
        { name: 'Time Slots', count: appData.timeslots.length, color: 'orange', icon: '⏱' }
    ];

    main.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p class="text-gray-600">Welcome to Schedulix Automatic Timetable Generator</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            ${stats.map(stat => `
                <div class="bg-white border rounded-lg p-4 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">${stat.name}</p>
                            <p class="text-2xl font-bold text-gray-800">${stat.count}</p>
                        </div>
                        <span class="text-2xl">${stat.icon}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="bg-white border rounded-lg p-4 shadow-sm">
            <h3 class="text-lg font-semibold mb-4">Quick Start Guide</h3>
            <div class="space-y-3 text-sm text-gray-600">
                <p>1. Add Subjects from the Subjects section</p>
                <p>2. Add Faculty members and assign them subjects</p>
                <p>3. Add Classrooms with their capacities</p>
                <p>4. Set up Time Slots and Break times</p>
                <p>5. Generate your timetable automatically!</p>
            </div>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onclick="location.hash='#/timetable'" class="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                Generate Timetable
            </button>
            <button onclick="clearAllData()" class="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium">
                Clear All Data
            </button>
        </div>
    `;
}

// Subjects Management
async function renderSubjects() {
    main.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Subjects</h2>
            <button onclick="openSubjectForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                + Add Subject
            </button>
        </div>
        
        <div class="bg-white border rounded-lg overflow-hidden">
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
                <tbody id="subjectList" class="divide-y">
                    ${appData.subjects.map(subject => `
                        <tr>
                            <td class="px-4 py-3 text-sm">${subject.code}</td>
                            <td class="px-4 py-3 text-sm">${subject.name}</td>
                            <td class="px-4 py-3 text-sm">${subject.type}</td>
                            <td class="px-4 py-3 text-sm">${subject.credits}</td>
                            <td class="px-4 py-3 text-sm">
                                <div class="flex gap-2">
                                    <button onclick="editSubject(${subject.id})" class="text-blue-600 hover:text-blue-800 text-sm">
                                        Edit
                                    </button>
                                    <button onclick="deleteSubject(${subject.id})" class="text-red-600 hover:text-red-800 text-sm">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${appData.subjects.length === 0 ? `
                <div class="text-center py-8 text-gray-500">
                    No subjects added yet. Click "Add Subject" to get started.
                </div>
            ` : ''}
        </div>
    `;
}

async function openSubjectForm(editId = null) {
    const subject = editId ? appData.subjects.find(s => s.id === editId) : null;
    
    modalRoot.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-box" onclick="event.stopPropagation()">
                <h3 class="text-lg font-semibold mb-4">${editId ? 'Edit' : 'Add'} Subject</h3>
                <form id="subjectForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                        <input type="text" class="input" placeholder="e.g., CS101" value="${subject ? subject.code : ''}" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                        <input type="text" class="input" placeholder="e.g., Data Structures" value="${subject ? subject.name : ''}" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select class="input" required>
                            <option value="">Select Type</option>
                            <option value="Theory" ${subject && subject.type === 'Theory' ? 'selected' : ''}>Theory</option>
                            <option value="Practical" ${subject && subject.type === 'Practical' ? 'selected' : ''}>Practical</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                        <input type="number" class="input" placeholder="e.g., 3" value="${subject ? subject.credits : ''}" required />
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            ${editId ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("subjectForm").onsubmit = async (e) => {
        e.preventDefault();
        const [code, name, type, credit] = [...e.target.elements].map(el => el.value);
        
        try {
            if (editId) {
                await api.updateSubject(editId, { code, name, type, credits: parseInt(credit) });
                showNotification('Subject updated successfully!');
            } else {
                await api.createSubject({ code, name, type, credits: parseInt(credit) });
                showNotification('Subject created successfully!');
            }
            
            await loadAllData();
            closeModal();
        } catch (error) {
            showNotification('Error saving subject', 'error');
        }
    };
}

async function editSubject(id) {
    openSubjectForm(id);
}

async function deleteSubject(id) {
    if (confirm('Are you sure you want to delete this subject?')) {
        try {
            await api.deleteSubject(id);
            showNotification('Subject deleted successfully!');
            await loadAllData();
        } catch (error) {
            showNotification('Error deleting subject', 'error');
        }
    }
}

// Teachers Management (similar pattern for other sections)
async function renderTeachers() {
    main.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Faculty</h2>
            <button onclick="openTeacherForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                + Add Faculty
            </button>
        </div>
        
        <div class="bg-white border rounded-lg overflow-hidden">
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
                <tbody id="teacherList" class="divide-y">
                    ${appData.teachers.map(teacher => `
                        <tr>
                            <td class="px-4 py-3 text-sm">${teacher.name}</td>
                            <td class="px-4 py-3 text-sm">${teacher.email}</td>
                            <td class="px-4 py-3 text-sm">${teacher.start_time} - ${teacher.end_time}</td>
                            <td class="px-4 py-3 text-sm">
                                ${teacher.subjects ? teacher.subjects.length : 0} subjects
                            </td>
                            <td class="px-4 py-3 text-sm">${teacher.lectures_per_day}</td>
                            <td class="px-4 py-3 text-sm">
                                <div class="flex gap-2">
                                    <button onclick="editTeacher(${teacher.id})" class="text-blue-600 hover:text-blue-800 text-sm">
                                        Edit
                                    </button>
                                    <button onclick="deleteTeacher(${teacher.id})" class="text-red-600 hover:text-red-800 text-sm">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${appData.teachers.length === 0 ? `
                <div class="text-center py-8 text-gray-500">
                    No faculty members added yet.
                </div>
            ` : ''}
        </div>
    `;
}

async function openTeacherForm(editId = null) {
    const teacher = editId ? appData.teachers.find(t => t.id === editId) : null;
    
    modalRoot.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-box" onclick="event.stopPropagation()">
                <h3 class="text-lg font-semibold mb-4">${editId ? 'Edit' : 'Add'} Faculty</h3>
                <form id="teacherForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
                        <input type="text" class="input" placeholder="e.g., Dr. Smith" value="${teacher ? teacher.name : ''}" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" class="input" placeholder="e.g., dr.smith@university.edu" value="${teacher ? teacher.email : ''}" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Available Time</label>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Start Time</label>
                                <input type="time" class="input" value="${teacher ? teacher.start_time : '08:00'}" required />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">End Time</label>
                                <input type="time" class="input" value="${teacher ? teacher.end_time : '17:00'}" required />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subjects They Teach</label>
                        <div class="max-h-40 overflow-y-auto border rounded p-2">
                            ${appData.subjects.map(subject => `
                                <label class="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                                    <input type="checkbox" name="subjects" value="${subject.id}" 
                                        ${teacher && teacher.subjects && teacher.subjects.includes(subject.id) ? 'checked' : ''}
                                        class="rounded border-gray-300">
                                    <span class="text-sm">${subject.code} - ${subject.name} (${subject.type})</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Max Lectures per Day</label>
                        <input type="number" class="input" placeholder="e.g., 4" min="1" max="8" 
                               value="${teacher ? teacher.lectures_per_day : 4}" required />
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            ${editId ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("teacherForm").onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const elements = e.target.elements;
        
        const teacherData = {
            name: elements[0].value,
            email: elements[1].value,
            start_time: elements[2].value,
            end_time: elements[3].value,
            subjects: Array.from(formData.getAll('subjects')).map(id => parseInt(id)),
            lectures_per_day: parseInt(elements[4].value),
            max_continuous_lectures: 2
        };
        
        try {
            if (editId) {
                await api.updateTeacher(editId, teacherData);
                showNotification('Faculty updated successfully!');
            } else {
                await api.createTeacher(teacherData);
                showNotification('Faculty created successfully!');
            }
            
            await loadAllData();
            closeModal();
        } catch (error) {
            showNotification('Error saving faculty data', 'error');
        }
    };
}

async function editTeacher(id) {
    openTeacherForm(id);
}

async function deleteTeacher(id) {
    if (confirm('Are you sure you want to delete this faculty member?')) {
        try {
            await api.deleteTeacher(id);
            showNotification('Faculty deleted successfully!');
            await loadAllData();
        } catch (error) {
            showNotification('Error deleting faculty', 'error');
        }
    }
}

// Classrooms Management (similar pattern)
async function renderClassrooms() {
    main.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Classrooms</h2>
            <button onclick="openClassroomForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                + Add Classroom
            </button>
        </div>
        
        <div class="bg-white border rounded-lg overflow-hidden">
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
                <tbody id="classroomList" class="divide-y">
                    ${appData.classrooms.map(classroom => `
                        <tr>
                            <td class="px-4 py-3 text-sm">${classroom.number}</td>
                            <td class="px-4 py-3 text-sm">${classroom.wing}</td>
                            <td class="px-4 py-3 text-sm">${classroom.capacity}</td>
                            <td class="px-4 py-3 text-sm">${classroom.type}</td>
                            <td class="px-4 py-3 text-sm">
                                <div class="flex gap-2">
                                    <button onclick="editClassroom(${classroom.id})" class="text-blue-600 hover:text-blue-800 text-sm">
                                        Edit
                                    </button>
                                    <button onclick="deleteClassroom(${classroom.id})" class="text-red-600 hover:text-red-800 text-sm">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${appData.classrooms.length === 0 ? `
                <div class="text-center py-8 text-gray-500">
                    No classrooms added yet.
                </div>
            ` : ''}
        </div>
    `;
}

async function openClassroomForm(editId = null) {
    const classroom = editId ? appData.classrooms.find(c => c.id === editId) : null;
    
    modalRoot.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-box" onclick="event.stopPropagation()">
                <h3 class="text-lg font-semibold mb-4">${editId ? 'Edit' : 'Add'} Classroom</h3>
                <form id="classroomForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                        <input type="text" class="input" placeholder="e.g., 101" value="${classroom ? classroom.number : ''}" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Wing</label>
                        <select class="input" required>
                            <option value="">Select Wing</option>
                            <option value="A" ${classroom && classroom.wing === 'A' ? 'selected' : ''}>A</option>
                            <option value="B" ${classroom && classroom.wing === 'B' ? 'selected' : ''}>B</option>
                            <option value="C" ${classroom && classroom.wing === 'C' ? 'selected' : ''}>C</option>
                            <option value="D" ${classroom && classroom.wing === 'D' ? 'selected' : ''}>D</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input type="number" class="input" placeholder="e.g., 50" value="${classroom ? classroom.capacity : ''}" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select class="input" required>
                            <option value="">Select Type</option>
                            <option value="Theory" ${classroom && classroom.type === 'Theory' ? 'selected' : ''}>Theory</option>
                            <option value="Practical" ${classroom && classroom.type === 'Practical' ? 'selected' : ''}>Practical</option>
                            <option value="Both" ${classroom && classroom.type === 'Both' ? 'selected' : ''}>Both</option>
                        </select>
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            ${editId ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("classroomForm").onsubmit = async (e) => {
        e.preventDefault();
        const [number, wing, capacity, type] = [...e.target.elements].map(el => el.value);
        
        try {
            if (editId) {
                await api.updateClassroom(editId, { number, wing, capacity: parseInt(capacity), type });
                showNotification('Classroom updated successfully!');
            } else {
                await api.createClassroom({ number, wing, capacity: parseInt(capacity), type });
                showNotification('Classroom created successfully!');
            }
            
            await loadAllData();
            closeModal();
        } catch (error) {
            showNotification('Error saving classroom', 'error');
        }
    };
}

async function editClassroom(id) {
    openClassroomForm(id);
}

async function deleteClassroom(id) {
    if (confirm('Are you sure you want to delete this classroom?')) {
        try {
            await api.deleteClassroom(id);
            showNotification('Classroom deleted successfully!');
            await loadAllData();
        } catch (error) {
            showNotification('Error deleting classroom', 'error');
        }
    }
}

// Time Slots Management
async function renderTimeSlots() {
    main.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Time Slots & Breaks</h2>
            <div class="flex gap-2">
                <button onclick="openTimeSlotForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    + Add Time Slot
                </button>
                <button onclick="openBreakForm()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    + Add Break
                </button>
            </div>
        </div>
        
        <div class="bg-white border rounded-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Day</th>
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Start Time</th>
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">End Time</th>
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody id="timeslotList" class="divide-y">
                    ${appData.timeslots.map(slot => `
                        <tr>
                            <td class="px-4 py-3 text-sm">${slot.day}</td>
                            <td class="px-4 py-3 text-sm">${slot.start_time}</td>
                            <td class="px-4 py-3 text-sm">${slot.end_time}</td>
                            <td class="px-4 py-3 text-sm">
                                ${slot.is_break ? 
                                    `<span class="px-2 py-1 text-xs rounded ${slot.break_type === 'short' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                                        ${slot.break_type} break
                                    </span>` : 
                                    '<span class="text-gray-600">Lecture</span>'
                                }
                            </td>
                            <td class="px-4 py-3 text-sm">
                                <button onclick="deleteTimeSlot(${slot.id})" class="text-red-600 hover:text-red-800 text-sm">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${appData.timeslots.length === 0 ? `
                <div class="text-center py-8 text-gray-500">
                    No time slots added yet. Add time slots and breaks to get started.
                </div>
            ` : ''}
        </div>
    `;
}

async function openTimeSlotForm() {
    modalRoot.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-box" onclick="event.stopPropagation()">
                <h3 class="text-lg font-semibold mb-4">Add Time Slot</h3>
                <form id="timeslotForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Day</label>
                        <select class="input" required>
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Start Time</label>
                                <input type="time" class="input" value="08:00" required />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">End Time</label>
                                <input type="time" class="input" value="09:00" required />
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("timeslotForm").onsubmit = async (e) => {
        e.preventDefault();
        const [day, startTime, endTime] = [...e.target.elements].map(el => el.value);
        
        try {
            await api.createTimeSlot({
                day,
                start_time: startTime,
                end_time: endTime,
                is_break: false,
                break_type: null
            });
            showNotification('Time slot created successfully!');
            await loadAllData();
            closeModal();
        } catch (error) {
            showNotification('Error creating time slot', 'error');
        }
    };
}

async function openBreakForm() {
    modalRoot.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-box" onclick="event.stopPropagation()">
                <h3 class="text-lg font-semibold mb-4">Add Break Time</h3>
                <form id="breakForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Day</label>
                        <select class="input" required>
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Break Time</label>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Start Time</label>
                                <input type="time" class="input" value="11:00" required />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">End Time</label>
                                <input type="time" class="input" value="11:15" required />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Break Type</label>
                        <select class="input" required>
                            <option value="short">Short Break (15-20 mins)</option>
                            <option value="long">Long Break (30-45 mins)</option>
                        </select>
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Save Break
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("breakForm").onsubmit = async (e) => {
        e.preventDefault();
        const [day, startTime, endTime, breakType] = [...e.target.elements].map(el => el.value);
        
        try {
            await api.createTimeSlot({
                day,
                start_time: startTime,
                end_time: endTime,
                is_break: true,
                break_type: breakType
            });
            showNotification('Break time created successfully!');
            await loadAllData();
            closeModal();
        } catch (error) {
            showNotification('Error creating break time', 'error');
        }
    };
}

async function deleteTimeSlot(id) {
    if (confirm('Are you sure you want to delete this time slot?')) {
        try {
            await api.deleteTimeSlot(id);
            showNotification('Time slot deleted successfully!');
            await loadAllData();
        } catch (error) {
            showNotification('Error deleting time slot', 'error');
        }
    }
}

// Timetable Generation
async function renderTimetable() {
    main.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Generate Timetable</h2>
            <p class="text-gray-600">Automatically generate conflict-free timetable based on your data</p>
        </div>

        <div class="bg-white border rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Data Summary</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div class="text-center p-3 bg-blue-50 rounded">
                    <div class="font-semibold">${appData.subjects.length}</div>
                    <div class="text-gray-600">Subjects</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded">
                    <div class="font-semibold">${appData.teachers.length}</div>
                    <div class="text-gray-600">Faculty</div>
                </div>
                <div class="text-center p-3 bg-purple-50 rounded">
                    <div class="font-semibold">${appData.classrooms.length}</div>
                    <div class="text-gray-600">Classrooms</div>
                </div>
                <div class="text-center p-3 bg-orange-50 rounded">
                    <div class="font-semibold">${appData.timeslots.length}</div>
                    <div class="text-gray-600">Time Slots</div>
                </div>
            </div>
        </div>

        <div class="bg-white border rounded-lg p-6">
            <div class="flex gap-4 mb-6">
                <button onclick="generateTimetable()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                    Generate Timetable
                </button>
                <button onclick="exportToPDF()" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium ${!appData.currentTimetable ? 'opacity-50 cursor-not-allowed' : ''}" ${!appData.currentTimetable ? 'disabled' : ''}>
                    📄 Export PDF
                </button>
                <button onclick="clearTimetable()" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium ${!appData.currentTimetable ? 'opacity-50 cursor-not-allowed' : ''}" ${!appData.currentTimetable ? 'disabled' : ''}>
                    Clear Timetable
                </button>
            </div>

            <div id="timetableResult">
                ${appData.currentTimetable ? renderTimetableGrid() : `
                    <div class="text-center py-8 text-gray-500">
                        No timetable generated yet. Click "Generate Timetable" to create one.
                    </div>
                `}
            </div>
        </div>
    `;
}

function renderTimetableGrid() {
    if (!appData.currentTimetable || !appData.currentTimetable.entries) {
        return '<div class="text-center py-8 text-gray-500">No timetable data available.</div>';
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Get unique time slots from entries
    const timeSlots = [...new Set(appData.currentTimetable.entries
        .filter(entry => !entry.is_break)
        .map(entry => entry.time_slot.id))]
        .map(id => appData.currentTimetable.entries.find(entry => entry.time_slot.id === id).time_slot)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));

    return `
        <div class="overflow-x-auto">
            <table class="w-full border-collapse border">
                <thead>
                    <tr class="bg-gray-50">
                        <th class="border p-3 font-semibold">Time</th>
                        ${days.map(day => `<th class="border p-3 font-semibold">${day}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${timeSlots.map(timeSlot => `
                        <tr>
                            <td class="border p-3 font-medium">${timeSlot.start_time} - ${timeSlot.end_time}</td>
                            ${days.map(day => {
                                const entry = appData.currentTimetable.entries.find(e => 
                                    e.day === day && e.time_slot.id === timeSlot.id
                                );
                                
                                if (entry && entry.is_break) {
                                    return `
                                        <td class="border p-3 bg-yellow-50">
                                            <div class="text-sm text-yellow-700 font-semibold text-center">
                                                ${entry.time_slot.break_type === 'short' ? 'SHORT BREAK' : 'LONG BREAK'}
                                            </div>
                                        </td>
                                    `;
                                }
                                
                                return `
                                    <td class="border p-3">
                                        ${entry ? `
                                            <div class="text-sm">
                                                <div class="font-semibold">${entry.subject_name}</div>
                                                <div class="text-gray-600">${entry.teacher_name}</div>
                                                <div class="text-gray-500 text-xs">Room ${entry.classroom_number}</div>
                                            </div>
                                        ` : '-'}
                                    </td>
                                `;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function generateTimetable() {
    try {
        showNotification('Generating timetable...', 'info');
        
        // Validate we have enough data
        if (appData.subjects.length === 0 || appData.teachers.length === 0 || 
            appData.classrooms.length === 0 || appData.timeslots.length === 0) {
            throw new Error('Please add subjects, faculty, classrooms, and time slots first.');
        }

        const result = await api.generateTimetable();
        appData.currentTimetable = result;
        
        showNotification('Timetable generated successfully!');
        renderTimetable();
    } catch (error) {
        console.error('Error generating timetable:', error);
        showNotification('Error generating timetable: ' + error.message, 'error');
    }
}

function exportToPDF() {
    if (!appData.currentTimetable) {
        showNotification('No timetable to export', 'error');
        return;
    }

    const pdfWindow = window.open('', '_blank');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const timeSlots = [...new Set(appData.currentTimetable.entries
        .filter(entry => !entry.is_break)
        .map(entry => entry.time_slot.id))]
        .map(id => appData.currentTimetable.entries.find(entry => entry.time_slot.id === id).time_slot)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));

    const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Schedulix Timetable</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2563eb; text-align: center; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f8fafc; font-weight: bold; }
                .break { background-color: #fefce8; color: #a16207; text-align: center; }
                .summary { margin-bottom: 30px; padding: 15px; background-color: #f8fafc; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>📚 Schedulix Timetable</h1>
            
            <div class="summary">
                <h3>Generated Timetable</h3>
                <p><strong>Name:</strong> ${appData.currentTimetable.name}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Subjects:</strong> ${appData.subjects.length}</p>
                <p><strong>Faculty:</strong> ${appData.teachers.length}</p>
                <p><strong>Classrooms:</strong> ${appData.classrooms.length}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        ${days.map(day => `<th>${day}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${timeSlots.map(timeSlot => `
                        <tr>
                            <td><strong>${timeSlot.start_time} - ${timeSlot.end_time}</strong></td>
                            ${days.map(day => {
                                const entry = appData.currentTimetable.entries.find(e => 
                                    e.day === day && e.time_slot.id === timeSlot.id
                                );
                                
                                if (entry && entry.is_break) {
                                    return `<td class="break"><strong>${entry.time_slot.break_type.toUpperCase()} BREAK</strong></td>`;
                                }
                                
                                return `
                                    <td>
                                        ${entry ? `
                                            <div>
                                                <strong>${entry.subject_name}</strong>
                                                <br>${entry.teacher_name}
                                                <br><small>Room ${entry.classroom_number}</small>
                                            </div>
                                        ` : '-'}
                                    </td>
                                `;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                Generated by Schedulix Automatic Timetable Generator
            </div>
        </body>
        </html>
    `;

    pdfWindow.document.write(pdfContent);
    pdfWindow.document.close();
    
    setTimeout(() => {
        pdfWindow.print();
    }, 500);
}

async function clearTimetable() {
    if (confirm('Are you sure you want to clear the current timetable?')) {
        appData.currentTimetable = null;
        showNotification('Timetable cleared');
        renderTimetable();
    }
}

async function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
        try {
            // Clear all data by deleting everything
            const clearPromises = [
                ...appData.subjects.map(subject => api.deleteSubject(subject.id)),
                ...appData.teachers.map(teacher => api.deleteTeacher(teacher.id)),
                ...appData.classrooms.map(classroom => api.deleteClassroom(classroom.id)),
                ...appData.timeslots.map(slot => api.deleteTimeSlot(slot.id))
            ];
            
            await Promise.all(clearPromises);
            await loadAllData();
            showNotification('All data cleared successfully!');
        } catch (error) {
            showNotification('Error clearing data', 'error');
        }
    }
}

// Load all data from backend
async function loadAllData() {
    try {
        [appData.subjects, appData.teachers, appData.classrooms, appData.timeslots] = await Promise.all([
            api.getSubjects(),
            api.getTeachers(),
            api.getClassrooms(),
            api.getTimeSlots()
        ]);

        // Load current timetable if exists
        const timetables = await api.getTimetables();
        appData.currentTimetable = timetables.find(t => t.is_active) || timetables[0] || null;

        if (appData.currentTimetable) {
            appData.currentTimetable.entries = await api.getTimetableEntries(appData.currentTimetable.id);
        }

        showNotification('Data loaded successfully!');
        router();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error loading data from server', 'error');
    }
}

// Initialize application
window.addEventListener('load', () => {
    loadAllData();
    
    // Add event listeners for quick actions
    document.addEventListener('click', function(e) {
        if (e.target.id === 'generateTimetableBtn') {
            location.hash = '#/timetable';
        }
        if (e.target.id === 'clearDataBtn') {
            clearAllData();
        }
    });
});