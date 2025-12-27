export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validateTime(startTime, endTime) {
    if (!startTime || !endTime) return false;
    return startTime < endTime;
}

export function validateRequired(value) {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    return value !== null && value !== undefined;
}

export function validateNumber(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
}

export function validateForm(formData, rules) {
    const errors = {};
    
    for (const [field, rule] of Object.entries(rules)) {
        const value = formData[field];
        
        if (rule.required && !validateRequired(value)) {
            errors[field] = `${rule.label || field} is required`;
            continue;
        }
        
        if (rule.email && !validateEmail(value)) {
            errors[field] = `Invalid email format`;
            continue;
        }
        
        if (rule.number) {
            if (!validateNumber(value, rule.min, rule.max)) {
                errors[field] = `Invalid number (min: ${rule.min}, max: ${rule.max})`;
                continue;
            }
        }
        
        if (rule.custom && typeof rule.custom === 'function') {
            const customError = rule.custom(value, formData);
            if (customError) {
                errors[field] = customError;
            }
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export function displayFormErrors(formElement, errors) {
    Object.keys(errors).forEach(field => {
        const input = formElement.querySelector(`[name="${field}"]`);
        if (input) {
            input.classList.add('border-red-500');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-500 text-xs mt-1';
            errorDiv.textContent = errors[field];
            input.parentElement.appendChild(errorDiv);
        }
    });
}

export function clearFormErrors(formElement) {
    formElement.querySelectorAll('.border-red-500').forEach(el => {
        el.classList.remove('border-red-500');
    });
    formElement.querySelectorAll('.text-red-500').forEach(el => {
        el.remove();
    });
}
