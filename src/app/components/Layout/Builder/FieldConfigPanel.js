import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateField, removeField } from '../../../redux/formBuilderSlice';
import styles from '../../../styles/components/_livePreview.module.scss';

// Utility component for a reusable input field
const ConfigInput = React.memo(({ label, value, onChange, placeholder = "", type = "text", name, ...rest }) => (
    <div className={styles.configItem}>
        <label>{label}</label>
        <input 
            type={type} 
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className={styles.input}
            {...rest}
        />
    </div>
));
ConfigInput.displayName = 'ConfigInput';


const FieldConfigPanel = ({ field, allFields }) => {
    const dispatch = useDispatch();

    // Optimization 1: useCallback for general property updates (Label, Placeholder)
    const handlePropertyChange = useCallback((e) => {
        dispatch(updateField({
            id: field.id,
            property: e.target.name,
            value: e.target.value,
        }));
    }, [dispatch, field.id]);

    // Optimization 2: useCallback for simple toggle (Required)
    const handleRequiredToggle = useCallback((e) => {
        dispatch(updateField({
            id: field.id,
            property: 'required',
            value: e.target.checked,
        }));
    }, [dispatch, field.id]);

    // Optimization 3: useCallback for complex validation updates
    const handleValidationChange = useCallback((e) => {
        const { name, value } = e.target;
        dispatch(updateField({
            id: field.id,
            property: 'validation',
            value: { [name]: value },
        }));
    }, [dispatch, field.id]);

    // Optimization 4: useMemo for fields available for conditional logic source
    const conditionalSourceFields = useMemo(() => {
        console.log("field",field);
        
        return allFields.filter(f => f.id !== field.id && f.type !== 'date' && f.type !== 'number');
    }, [allFields, field.id]);
    
    // Optimization 5: useCallback for conditional logic updates
    const handleConditionalChange = useCallback((key, value) => {
        dispatch(updateField({
            id: field.id,
            property: 'conditional',
            value: { ...field.conditional, [key]: value }
        }));
    }, [dispatch, field.id, field.conditional]);
    
    const handleRemove = useCallback(() => {
        if (window.confirm(`Permanently remove "${field.label}"?`)) {
            dispatch(removeField(field.id));
        }
    }, [dispatch, field.id, field.label]);


    // Determine which validation options to show based on field type
    const isTextBased = ['text', 'email'].includes(field.type);
    const isNumberBased = ['number'].includes(field.type);

    return (
        <div className={styles.panel}>
            <h3><i className="bi bi-gear"></i>Configure: {field.type.toUpperCase()} Field</h3>
            <p className={styles.fieldId}>ID: {field.id}</p>
            
            {/* --- 1. Basic Properties --- */}
            <div className={styles.section}>
                <h4>Basic Properties</h4>
                <ConfigInput
                    label="Label"
                    name="label"
                    value={field.label}
                    onChange={handlePropertyChange}
                    placeholder="Name? Email? Favorite Pokémon?"
                />
                <ConfigInput
                    label="Placeholder"
                    name="placeholder"
                    value={field.placeholder}
                    onChange={handlePropertyChange}
                    placeholder="Start typing"
                />
                
                <div className={styles.toggleItem}>
                    <label>Required Field</label>
                    <input 
                        type="checkbox" 
                        checked={field.required}
                        onChange={handleRequiredToggle}
                    />
                </div>
            </div>

            {/* --- 2. Validation --- */}
            <div className={styles.section}>
                <h4>Validation</h4>
                
                {/* Min/Max for Text & Number */}
                {(isTextBased || isNumberBased) && (
                    <>
                        <ConfigInput
                            label={isTextBased ? "Min Length" : "Min Value"}
                            name="min"
                            type="number"
                            value={field.validation.min}
                            onChange={handleValidationChange}
                        />
                        <ConfigInput
                            label={isTextBased ? "Max Length" : "Max Value"}
                            name="max"
                            type="number"
                            value={field.validation.max}
                            onChange={handleValidationChange}
                        />
                    </>
                )}
                
                {/* Regex for Text/Email */}
                {isTextBased && (
                    <ConfigInput
                        label="Regex Pattern"
                        name="regex"
                        value={field.validation.regex}
                        onChange={handleValidationChange}
                        placeholder="/[A-Z]/i"
                    />
                )}
                
                <ConfigInput
                    label="Custom Error Message"
                    name="error"
                    value={field.validation.error}
                    onChange={handleValidationChange}
                    placeholder="Please enter a valid value."
                />
            </div>

            {/* --- 3. Conditional Logic --- */}
            <div className={styles.section}>
                <h4>Conditional Logic</h4>
                
                {conditionalSourceFields.length > 0 ? (
                    <>
                        <div className={styles.configItem}>
                            <label>Action</label>
                            <select 
                                value={field.conditional.action || 'SHOW'}
                                onChange={(e) => handleConditionalChange('action', e.target.value)}
                                className={styles.select}
                            >
                                <option value="SHOW">Show Field (if rule TRUE)</option>
                                <option value="HIDE">Hide Field (if rule TRUE)</option>
                                <option value="DISABLE">Disable Field (if rule TRUE)</option>
                            </select>
                        </div>

                        <p className={styles.rulePrompt}>Apply rule if...</p>

                        <div className={styles.conditionalGroup}>
                            <select 
                                value={field.conditional.rule?.sourceFieldId || ''}
                                onChange={(e) => handleConditionalChange('rule', { 
                                    ...field.conditional.rule, 
                                    sourceFieldId: e.target.value 
                                })}
                                className={styles.select}
                            >
                                <option value="">--- Select Source Field ---</option>
                                {conditionalSourceFields.map(f => (
                                    <option key={f.id} value={f.id}>{f.label} ({f.type})</option>
                                ))}
                            </select>
                            
                            <select 
                                value={field.conditional.rule?.operator || 'equals'}
                                onChange={(e) => handleConditionalChange('rule', { 
                                    ...field.conditional.rule, 
                                    operator: e.target.value 
                                })}
                                className={styles.select}
                            >
                                <option value="equals">equals</option>
                                <option value="not_equals">does NOT equal</option>
                                <option value="is_empty">is empty</option>
                                <option value="is_not_empty">is NOT empty</option>
                            </select>
                            
                            <ConfigInput
                                label="Value"
                                name="value"
                                value={field.conditional.rule?.value || ''}
                                onChange={(e) => handleConditionalChange('rule', { 
                                    ...field.conditional.rule, 
                                    value: e.target.value 
                                })}
                                placeholder="e.g., Yes or 18"
                            />
                        </div>
                    </>
                ) : (
                    <p className={styles.noSource}>Create another field (Text/Email/Checkbox) to enable conditional logic.</p>
                )}
            </div>
            
            <button className={styles.deleteButton} onClick={handleRemove}>
                Permanently Delete Field
            </button>
        </div>
    );
};

export default FieldConfigPanel;