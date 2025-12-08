import { useMemo } from 'react';

// Simplified function to evaluate a single conditional rule
const evaluateRule = (rule, formValues) => {
    if (!rule || !rule.sourceFieldId) {
        return false;
    }

    const sourceValue = formValues[rule.sourceFieldId] || '';
    const targetValue = rule.value;
    const operator = rule.operator;

    switch (operator) {
        case 'equals':
            return String(sourceValue) === String(targetValue);
        case 'not_equals':
            return String(sourceValue) !== String(targetValue);
        case 'is_empty':
            return !sourceValue || sourceValue.length === 0;
        case 'is_not_empty':
            return sourceValue.length > 0;
        // Add more operators (e.g., <, >, includes) as needed
        default:
            return false;
    }
};

/**
 * Custom hook to calculate the visibility and disabled status for all fields.
 * @param {Array} fields - The full array of field schemas.
 * @param {Object} formValues - The current values entered by the user in the preview.
 * @returns {Object} An object mapping field IDs to their calculated state { isVisible, isDisabled }.
 */
export const useConditionalLogic = (fields, formValues) => {
    // Optimization: useMemo ensures this expensive calculation only runs when fields or values change
    const conditions = useMemo(() => {
        const results = {};

        fields.forEach(field => {
            const { conditional } = field;
            let isVisible = true;
            let isDisabled = false;

            if (conditional && conditional.rule) {
                const ruleResult = evaluateRule(conditional.rule, formValues);
                
                // --- Apply Visibility Rule ---
                if (conditional.action === 'SHOW') {
                    // Show Field B only if Rule is TRUE
                    isVisible = ruleResult;
                } else if (conditional.action === 'HIDE') {
                    // Hide Field B if Rule is TRUE
                    isVisible = !ruleResult;
                } 
                
                // --- Apply Disabled Rule (overrides visibility if set) ---
                if (conditional.action === 'DISABLE') {
                    // Disable Field B when Rule is TRUE
                    isDisabled = ruleResult;
                }
            }

            results[field.id] = { isVisible, isDisabled };
        });

        return results;
    }, [fields, formValues]); // Re-calculate when schema or form input changes

    return conditions;
};