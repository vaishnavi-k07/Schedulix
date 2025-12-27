import { getCookie } from './utils/helpers.js';

const API_BASE = '/api';

function getCSRFToken() {
    return getCookie('csrftoken');
}

async function handleResponse(response) {
    if (response.status === 204) {
        return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.detail || data.error || 'An error occurred',
                data
            };
        }
        
        return data;
    }
    
    if (!response.ok) {
        throw {
            status: response.status,
            message: `HTTP Error ${response.status}`
        };
    }
    
    return response.text();
}

async function request(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        credentials: 'same-origin'
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(`${API_BASE}${url}`, mergedOptions);
        return await handleResponse(response);
    } catch (error) {
        if (error.status === 401) {
            window.location.href = '/login/';
        }
        throw error;
    }
}

export const api = {
    get: (url) => request(url, { method: 'GET' }),
    post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
    put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (url, data) => request(url, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (url) => request(url, { method: 'DELETE' }),
    
    subjects: {
        list: () => api.get('/subjects/'),
        get: (id) => api.get(`/subjects/${id}/`),
        create: (data) => api.post('/subjects/', data),
        update: (id, data) => api.put(`/subjects/${id}/`, data),
        delete: (id) => api.delete(`/subjects/${id}/`)
    },
    
    teachers: {
        list: () => api.get('/teachers/'),
        get: (id) => api.get(`/teachers/${id}/`),
        create: (data) => api.post('/teachers/', data),
        update: (id, data) => api.put(`/teachers/${id}/`, data),
        delete: (id) => api.delete(`/teachers/${id}/`)
    },
    
    classrooms: {
        list: () => api.get('/classrooms/'),
        get: (id) => api.get(`/classrooms/${id}/`),
        create: (data) => api.post('/classrooms/', data),
        update: (id, data) => api.put(`/classrooms/${id}/`, data),
        delete: (id) => api.delete(`/classrooms/${id}/`)
    },
    
    timeslots: {
        list: () => api.get('/timeslots/'),
        get: (id) => api.get(`/timeslots/${id}/`),
        create: (data) => api.post('/timeslots/', data),
        update: (id, data) => api.put(`/timeslots/${id}/`, data),
        delete: (id) => api.delete(`/timeslots/${id}/`)
    },
    
    timetables: {
        list: () => api.get('/timetables/'),
        get: (id) => api.get(`/timetables/${id}/`),
        create: (data) => api.post('/timetables/', data),
        update: (id, data) => api.put(`/timetables/${id}/`, data),
        delete: (id) => api.delete(`/timetables/${id}/`),
        generate: (data) => api.post('/timetables/generate/', data),
        getEntries: (id) => api.get(`/timetables/${id}/entries/`)
    }
};
