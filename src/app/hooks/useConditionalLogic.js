/**
 * @author Sneha T
 * conditional logic custom hook
 */

import { useMemo } from 'react';

/**
 * 
 * @param {*} rule 
 * @param {*} formValues 
 * Simplified function to evaluate a single conditional rule
 * @returns 
 */
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
 * 
 * @param {*} fields 
 * @param {*} formValues 
 * Custom hook to calculate the visibility and disabled status for all fields.
 * @returns 
 */
export const useConditionalLogic = (fields, formValues) => {

    const conditions = useMemo(() => {

        const results = {};

        fields.forEach(field => {

            const { conditional } = field;

            let isVisible = true;

            let isDisabled = false;

            if (conditional && conditional.rule) {

                const ruleResult = evaluateRule(conditional.rule, formValues);

                if (conditional.action === 'SHOW') {

                    // Show Field B only if Rule is TRUE
                    isVisible = ruleResult;

                } else if (conditional.action === 'HIDE') {

                    // Hide Field B if Rule is TRUE
                    isVisible = !ruleResult;

                }

                /** Apply Disabled Rule  */
                if (conditional.action === 'DISABLE') {

                    // Disable Field B when Rule is TRUE
                    isDisabled = ruleResult;

                }

            }

            results[field.id] = { isVisible, isDisabled };

        });

        return results;

    }, [fields, formValues]);

    return conditions;

};