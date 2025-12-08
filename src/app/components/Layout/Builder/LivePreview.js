import React, { useState, useCallback, useMemo } from 'react';
import FieldPreview from './FieldPreview';
import { useConditionalLogic } from '../../../hooks/useConditionalLogic';
import styles from '../../../styles/components/_livePreview.module.scss';

const LivePreview = ({ fields }) => {
    // State to hold the values entered by the user in the live preview
    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    
    // Optimization 1: Custom hook for conditional logic resolution
    const fieldConditions = useConditionalLogic(fields, formValues);

    // Optimization 2: useCallback for input change handler
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormValues(prev => ({
            ...prev,
            [name]: newValue
        }));
        
        // Clear error when value changes (simple immediate validation feedback)
        setFormErrors(prev => ({
            ...prev,
            [name]: null
        }));
    }, []);

    // Placeholder for real validation logic (Min/Max/Regex)
   // src/components/Builder/LivePreview.js

// ... (imports and useState/useCallback definitions) ...

const runValidation = useCallback((field, value) => {
    const { validation, required, type } = field;
    
    // Ensure value is treated as a string for length checks
    const stringValue = String(value || '');
    const length = stringValue.length;

    // --- 1. Required Check ---
    // Checks for empty string value (handles all types, including unchecked boxes if value is 'false')
    if (required && stringValue === '') {
        return validation.error || 'This field is required.';
    }

    // If the field is empty and not required, pass validation for further checks.
    if (stringValue === '') {
        return null; 
    }
    
    // --- 2. Length Check (Applies to Text, Email, and Number types) ---
    if (['text', 'email', 'number'].includes(type)) {
        
        const minLength = Number(validation.min);
        const maxLength = Number(validation.max);
        
        // Check Minimum Length/Digits
        if (validation.min && length < minLength) {
            const unit = type === 'number' ? 'digits' : 'characters';
            return validation.error || `Must have at least ${validation.min} ${unit}.`;
        }
        
        // Check Maximum Length/Digits
        if (validation.max && length > maxLength) {
            const unit = type === 'number' ? 'digits' : 'characters';
            return validation.error || `Cannot exceed ${validation.max} ${unit}.`;
        }
    }
    
    // --- 3. Numeric Value Check (Optional, for true numerical constraints like age/currency) ---
    // If it's a number field and you want to ensure it's a valid number:
    if (type === 'number' && isNaN(Number(stringValue))) {
        return validation.error || 'Must be a valid number.';
    }

    // --- 4. Regex Check (Applies to Text and Email) ---
    if (validation.regex && ['text', 'email'].includes(type)) {
        try {
            const regexClean = validation.regex.replace(/^\/|\/$/g, '');
            const regex = new RegExp(regexClean);
            if (!regex.test(stringValue)) {
                return validation.error || 'The entered value does not match the required format.';
            }
        } catch (e) {
            console.error("Invalid Regex Pattern:", validation.regex, e);
            return 'Invalid validation rule applied.';
        }
    }

    return null; // Validation passed
}, []);

    // Optimization 3: useMemo to determine if the Submit button should be disabled
    const isSubmitDisabled = useMemo(() => {
        let hasErrors = false;
        let hasRequiredErrors = false;

        fields.forEach(field => {
            const value = formValues[field.id];
            const error = runValidation(field, value);
            
            if (error) {
                hasErrors = true;
            }
            if (field.required && !value) {
                hasRequiredErrors = true;
            }
        });

        // Example Conditional Disable: "Disable Submit button when age < 18"
        const ageField = fields.find(f => f.label.toLowerCase().includes('age'));
        if (ageField && (formValues[ageField.id] < 18)) {
             return true; 
        }

        return hasErrors || hasRequiredErrors;
    }, [fields, formValues, runValidation]);


    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Re-run full validation on submit
        const newErrors = {};
        fields.forEach(field => {
            const error = runValidation(field, formValues[field.id]);
            if (error) {
                newErrors[field.id] = error;
            }
        });
        
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            alert("Form has validation errors!");
            return;
        }

        alert("Form Submitted! Data: " + JSON.stringify(formValues, null, 2));
    };

    return (
        <form onSubmit={handleSubmit} className={styles.livePreviewForm}>
            {fields.map(field => {
                const { isVisible, isDisabled } = fieldConditions[field.id];

                return (
                    <FieldPreview
                        key={field.id}
                        field={field}
                        formValues={formValues}
                        formErrors={formErrors}
                        handleInputChange={handleInputChange}
                        isVisible={isVisible}
                        isDisabled={isDisabled}
                    />
                );
            })}
            
            <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitDisabled}
            >
                Submit
            </button>
            {isSubmitDisabled && <p className={styles.disabledWarning}>Fix errors to enable submission.</p>}
        </form>
    );
};

export default LivePreview;