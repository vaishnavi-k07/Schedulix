/**
 * API Client for Schedulix
 */

const API_BASE = '/api';

const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const request = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const token = getCSRFToken();
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'X-CSRFToken': token
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        
        if (response.status === 204) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.detail || data.message || 'API Request failed');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

export const api = {
    // Subjects
    subjects: {
        getAll: () => request('/subjects/'),
        get: (id) => request(`/subjects/${id}/`),
        create: (data) => request('/subjects/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/subjects/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/subjects/${id}/`, { method: 'DELETE' })
    },
    // Teachers
    teachers: {
        getAll: () => request('/teachers/'),
        get: (id) => request(`/teachers/${id}/`),
        create: (data) => request('/teachers/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/teachers/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/teachers/${id}/`, { method: 'DELETE' })
    },
    // Classrooms
    classrooms: {
        getAll: () => request('/classrooms/'),
        get: (id) => request(`/classrooms/${id}/`),
        create: (data) => request('/classrooms/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/classrooms/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/classrooms/${id}/`, { method: 'DELETE' })
    },
    // TimeSlots
    timeslots: {
        getAll: () => request('/timeslots/'),
        get: (id) => request(`/timeslots/${id}/`),
        create: (data) => request('/timeslots/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/timeslots/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/timeslots/${id}/`, { method: 'DELETE' })
    },
    // Timetables
    timetables: {
        getAll: () => request('/timetables/'),
        get: (id) => request(`/timetables/${id}/`),
        generate: (data) => request('/timetables/generate/', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id) => request(`/timetables/${id}/`, { method: 'DELETE' }),
        activate: (id) => request(`/timetables/${id}/activate/`, { method: 'POST' }),
        exportCsv: (id) => `/api/timetables/${id}/export_csv/`,
    },
    // Bulk Actions
    bulk: {
        clearAll: () => request('/clear-all-data/', { method: 'DELETE' }),
        getStats: () => request('/stats/')
    }
};
