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
    const runValidation = useCallback((field, value) => {
        if (field.required && !value) {
            return 'This field is required.';
        }
        // ... Add logic for field.validation.min / max / regex here
        return null; 
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