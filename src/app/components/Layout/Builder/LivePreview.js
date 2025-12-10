/**
 * @author Sneha T
 * Live preview componet
 */

import React, { useState, useCallback, useMemo } from 'react';

import FieldPreview from './FieldPreview';

import { useConditionalLogic } from '../../../hooks/useConditionalLogic';

import styles from '../../../styles/components/_livePreview.module.scss';

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const LivePreview = ({ fields }) => {

    const [formValues, setFormValues] = useState({});

    const [formErrors, setFormErrors] = useState({});

    const fieldConditions = useConditionalLogic(fields, formValues);

    const runValidation = useCallback((field, value) => {

        const { validation, required, type } = field;

        // Ensure value is treated as a string for length checks
        const stringValue = String(value || '');

        const length = stringValue.length;

        /** 1. Required Check  */
        if (required && stringValue === '') {
            return validation.error || 'This field is required.';
        }

        if (stringValue === '') {
            return null;
        }

        /**2. Length Check (Text, Email, Number) */
        if (['text', 'email', 'number'].includes(type)) {

            const minLength = Number(validation.min);

            const maxLength = Number(validation.max);

            if (validation.min && length < minLength) {

                const unit = type === 'number' ? 'digits' : 'characters';

                return validation.error || `Must have at least ${validation.min} ${unit}.`;

            }

            if (validation.max && length > maxLength) {

                const unit = type === 'number' ? 'digits' : 'characters';

                return validation.error || `Cannot exceed ${validation.max} ${unit}.`;

            }

        }

        /** 3. Numeric Value Check (Valid Number) */
        if (type === 'number' && isNaN(Number(stringValue))) {

            return validation.error || 'Must be a valid number.';

        }

        /**4. Regex Check (Text and Email)  */
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

    const handleInputChange = useCallback((e) => {

        const { name, value, type, checked } = e.target;

        const newValue = type === 'checkbox' ? checked : value;

        setFormValues(prev => ({
            ...prev,
            [name]: newValue
        }));

        setFormErrors(prev => ({
            ...prev,
            [name]: null
        }));

    }, []);

    /** determine the Submit button status and error messages */
    const submitStatus = useMemo(() => {

        const errors = [];

        let disableSubmit = false;

        fields.forEach(field => {

            const value = formValues[field.id];

            /** Validation Errors (Min/Max/Regex/Required) */
            const validationError = runValidation(field, value);

            if (validationError) {

                disableSubmit = true;

                errors.push(`${field.label}: ${validationError}`);

            }

        });

        return {

            isDisabled: disableSubmit,

            errorMessages: errors

        };

    }, [fields, formValues, runValidation]);

    /**
     * 
     * @param {*} e 
     * @returns 
     */
    const handleSubmit = (e) => {

        e.preventDefault();

        // Re-run full validation on submit to ensure no missed errors
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
            {fields.length ? (
                <button
                    type="submit"

                    className={styles.submitButton}

                    disabled={submitStatus.isDisabled}

                >
                    Submit

                </button>
            ) : null}
            {submitStatus.isDisabled && (

                <div className={styles.disabledWarning}>

                    <p>Submission blocked due to the following:</p>

                    <ul className={styles.errorList}>

                        {submitStatus.errorMessages.map((msg, index) => (

                            <li key={index}>{msg}</li>

                        ))}

                    </ul>

                </div>

            )}

        </form>

    );

};

export default LivePreview;