import { createSlice } from '@reduxjs/toolkit';

// Utility for generating a unique ID and default field schema
let nextId = 1;
const createNewField = (type) => ({
  id: `field-${nextId++}`,
  type, // text, email, number, date, checkbox, radio, dropdown
  label: type.charAt(0).toUpperCase() + type.slice(1) + ' Field',
  placeholder: 'Start typing or panic',
  required: false,
  validation: {
    min: '',
    max: '',
    regex: '',
    error: 'Validation failed.',
  },
  conditional: {
    rule: null, // { sourceFieldId: 'field-1', operator: 'equals', value: 'Yes' }
    action: 'SHOW', // SHOW | HIDE | DISABLE
  },
});

const initialState = {
  fields: [],
  selectedFieldId: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action) => {
      const type = action.payload;
      const newField = createNewField(type);
      state.fields.push(newField);
      state.selectedFieldId = newField.id; // Auto-select new field
    },
    removeField: (state, action) => {
      state.fields = state.fields.filter(field => field.id !== action.payload);
      if (state.selectedFieldId === action.payload) {
        state.selectedFieldId = null;
      }
    },
    updateField: (state, action) => {
      const { id, property, value } = action.payload;
      const field = state.fields.find(f => f.id === id);
      if (field) {
        if (property === 'required') {
          field.required = value;
        } else if (['label', 'placeholder', 'options'].includes(property)) {
          field[property] = value;
        } else if (property === 'validation') {
          field.validation = { ...field.validation, ...value };
        } else if (property === 'conditional') {
          field.conditional = value;
        }
      }
    },
    reorderFields: (state, action) => {
      state.fields = action.payload;
    },
    loadSchema: (state, action) => {
      state.fields = action.payload;
      nextId = state.fields.length > 0 
          ? Math.max(...state.fields.map(f => parseInt(f.id.split('-')[1]))) + 1
          : 1;
    },
    resetForm: (state) => {
      state.fields = [];
      state.selectedFieldId = null;
      nextId = 1;
    },
    setSelectedFieldId: (state, action) => {
      state.selectedFieldId = action.payload;
    }
  },
});

export const {
  addField,
  removeField,
  updateField,
  reorderFields,
  loadSchema,
  resetForm,
  setSelectedFieldId,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;