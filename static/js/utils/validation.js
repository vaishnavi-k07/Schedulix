/**
 * Validation utilities for Schedulix
 */

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validateTimeRange = (start, end) => {
    if (!start || !end) return false;
    return start < end;
};

export const getFormErrors = (formData, rules) => {
    const errors = {};
    for (const [field, rule] of Object.entries(rules)) {
        const value = formData.get(field);
        if (rule.required && !value) {
            errors[field] = 'This field is required';
        } else if (rule.email && !validateEmail(value)) {
            errors[field] = 'Invalid email address';
        }
        // Add more rules as needed
    }
    return errors;
};
