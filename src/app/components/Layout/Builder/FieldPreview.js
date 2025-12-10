/**
 * @author Sneha T
 * Componet to preview field
 */


import React, { useMemo } from 'react';

import styles from '../../../styles/components/_fieldPreview.module.scss';

/**
 * 
 * @param {*} param0 
 * A simple reusable input component for the preview form
 * @returns 
 */
const PreviewInput = ({ type, id, label, placeholder, required, disabled, validationError, value, onChange }) => (

    <div className={styles.formGroup}>

        <label htmlFor={id}>

            {label}

            {required && <span className={styles.requiredMark}> *</span>}

        </label>

        <input
            type={type}

            id={id}

            name={id}

            placeholder={placeholder}

            required={required}

            disabled={disabled}

            value={value || ''}

            onChange={onChange}

            className={`${styles.input} ${validationError ? styles.error : ''}`}

        />

        {validationError && <p className={styles.errorMessage}>{validationError}</p>}

    </div>

);


const FieldPreview = React.memo(({ field, formValues, formErrors, handleInputChange, isVisible, isDisabled }) => {


    // Optimization: useMemo to determine the input type for the browser
    const inputType = useMemo(() => {

        switch (field.type) {

            case 'text':
            case 'email':
            case 'number':
            case 'date':
                return field.type;
            case 'checkbox':
            case 'radio':
            case 'dropdown':
                // Complex types handle rendering internally
                return 'complex';
            default:
                return 'text';

        }

    }, [field.type]);

    if (!isVisible) {

        return null;
    }

    const value = formValues[field.id] || '';

    const validationError = formErrors[field.id];

    // Handling complex types (Checkbox, Radio, Dropdown) with placeholder components
    if (inputType === 'complex') {

        return (

            <div className={`${styles.formGroup} ${isDisabled ? styles.disabled : ''}`}>

                <label>{field.label}</label>

                {/* Placeholder UI for Checkbox/Radio/Dropdown */}
                <div className={styles.complexPlaceholder}>

                    {field.type.toUpperCase()} Group (Configuration UI not implemented)

                </div>

            </div>

        );

    }

    // Handling simple types
    return (

        <PreviewInput
            type={inputType}

            id={field.id}

            label={field.label}

            placeholder={field.placeholder}

            required={field.required}

            disabled={isDisabled}

            validationError={validationError}

            value={value}

            onChange={handleInputChange}

        />

    );

});

FieldPreview.displayName = 'FieldPreview';

export default FieldPreview;