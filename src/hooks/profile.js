// hooks/useForm.js
import { useState, useCallback } from "react";

export const useForm = (initialState = {}, validationRules = {}) => {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setForm(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            setForm(prev => ({ ...prev, [name]: files[0] || null }));
        } else if (name.includes('.')) {
            // Handle nested fields like user.phone_number
            const keys = name.split('.');
            setForm(prev => {
                const newForm = { ...prev };
                let current = newForm;
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) current[keys[i]] = {};
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;
                return newForm;
            });
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }

        // Mark field as touched
        setTouched(prev => ({ ...prev, [name]: true }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [errors]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate on blur
        if (validationRules[name]) {
            const error = validationRules[name](form[name]);
            if (error) {
                setErrors(prev => ({ ...prev, [name]: error }));
            }
        }
    }, [form, validationRules]);

    const validateForm = useCallback(() => {
        const newErrors = {};
        Object.keys(validationRules).forEach(key => {
            const error = validationRules[key](form[key]);
            if (error) {
                newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form, validationRules]);

    const resetForm = useCallback(() => {
        setForm(initialState);
        setErrors({});
        setTouched({});
    }, [initialState]);

    const setFormField = useCallback((name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const setFormData = useCallback((data) => {
        setForm(data);
    }, []);

    return {
        form,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        resetForm,
        setFormField,
        setFormData,
        setForm,
    };
};
