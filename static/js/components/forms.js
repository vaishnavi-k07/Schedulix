import { clearFormErrors, displayFormErrors, validateForm } from '../utils/validation.js';

export function createFormField(field) {
    const {
        type = 'text',
        name,
        label,
        value = '',
        placeholder = '',
        required = false,
        options = [],
        multiple = false,
        rows = 3
    } = field;
    
    let inputHTML = '';
    
    switch (type) {
        case 'select':
            inputHTML = `
                <select name="${name}" class="input w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                        ${required ? 'required' : ''} ${multiple ? 'multiple' : ''}>
                    ${!multiple ? '<option value="">Select...</option>' : ''}
                    ${options.map(opt => `
                        <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
                            ${opt.label}
                        </option>
                    `).join('')}
                </select>
            `;
            break;
            
        case 'textarea':
            inputHTML = `
                <textarea name="${name}" rows="${rows}" placeholder="${placeholder}" 
                          class="input w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                          ${required ? 'required' : ''}>${value}</textarea>
            `;
            break;
            
        case 'checkbox-group':
            inputHTML = `
                <div class="max-h-48 overflow-y-auto border rounded-lg p-2">
                    ${options.map(opt => `
                        <label class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" name="${name}" value="${opt.value}" 
                                   ${Array.isArray(value) && value.includes(opt.value) ? 'checked' : ''}
                                   class="rounded border-gray-300">
                            <span class="text-sm">${opt.label}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'time-range':
            const [startTime = '08:00', endTime = '17:00'] = Array.isArray(value) ? value : [value, ''];
            inputHTML = `
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">Start Time</label>
                        <input type="time" name="${name}_start" value="${startTime}" 
                               class="input w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                               ${required ? 'required' : ''}>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">End Time</label>
                        <input type="time" name="${name}_end" value="${endTime}" 
                               class="input w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                               ${required ? 'required' : ''}>
                    </div>
                </div>
            `;
            break;
            
        default:
            inputHTML = `
                <input type="${type}" name="${name}" value="${value}" placeholder="${placeholder}" 
                       class="input w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                       ${required ? 'required' : ''}>
            `;
    }
    
    return `
        <div class="form-field mb-4">
            ${label ? `<label class="block text-sm font-medium text-gray-700 mb-1">${label}${required ? ' *' : ''}</label>` : ''}
            ${inputHTML}
        </div>
    `;
}

export function createForm(fields, options = {}) {
    const {
        id = 'form',
        submitLabel = 'Submit',
        cancelLabel = 'Cancel',
        onSubmit = null,
        onCancel = null
    } = options;
    
    const formHTML = `
        <form id="${id}" class="space-y-4">
            ${fields.map(field => createFormField(field)).join('')}
            <div class="flex gap-2 pt-4 border-t">
                <button type="button" class="btn-cancel flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                    ${cancelLabel}
                </button>
                <button type="submit" class="btn-submit flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    ${submitLabel}
                </button>
            </div>
        </form>
    `;
    
    return formHTML;
}

export function getFormData(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

export function setFormLoading(formElement, loading = true) {
    const submitBtn = formElement.querySelector('button[type="submit"]');
    const inputs = formElement.querySelectorAll('input, select, textarea, button');
    
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
        inputs.forEach(input => input.disabled = true);
    } else {
        submitBtn.disabled = false;
        inputs.forEach(input => input.disabled = false);
    }
}
