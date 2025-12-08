import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addField } from '../../../redux/formBuilderSlice';
import styles from '../../../styles/components/_fieldToolbar.module.scss';

const FIELD_TYPES = [
    { type: 'text', label: 'Text' },
    { type: 'email', label: 'Email' },
    { type: 'number', label: 'Number' },
    { type: 'date', label: 'Date' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'radio', label: 'Radio Group' },
    { type: 'dropdown', label: 'Dropdown' },
];

const FieldToolbar = () => {
    const dispatch = useDispatch();

    // Optimization: useCallback for the handler
    const handleAddField = useCallback((type) => {
        dispatch(addField(type));
    }, [dispatch]);

    return (
        <div className={styles.toolbar}>
            <h3>➕ Form Fields</h3>
            <div className={styles.buttonGrid}>
                {FIELD_TYPES.map(field => (
                    <button 
                        key={field.type} 
                        className={styles.fieldButton}
                        onClick={() => handleAddField(field.type)}
                    >
                        {field.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FieldToolbar;