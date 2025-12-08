import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSchema } from '../redux/formBuilderSlice';

const LOCAL_STORAGE_KEY = 'formBuilderSchema';

export const useLocalStorage = () => {
  const dispatch = useDispatch();
  const fields = useSelector(state => state.formBuilder.fields);

  // Load (Once on initial mount)
  useEffect(() => {
    const savedSchema = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSchema) {
      try {
        const parsed = JSON.parse(savedSchema);
        dispatch(loadSchema(parsed));
      } catch (e) {
        console.error("Could not parse saved schema:", e);
      }
    }
  }, [dispatch]);

  // Save (Every time the state changes - Optimization: Live Save)
  useEffect(() => {
    // We only save the fields data.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fields));
  }, [fields]); 

  // Export (useCallback optimization for handler)
  const exportSchema = useCallback(() => {
    const jsonString = JSON.stringify(fields, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form-schema.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [fields]);

  return { exportSchema };
};