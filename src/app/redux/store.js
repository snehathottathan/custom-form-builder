import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from './formBuilderSlice';

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
  },
  // Optionally add middleware or enhancers here
});