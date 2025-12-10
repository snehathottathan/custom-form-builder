/**
 * @author Sneha T
 * Redux Store to store state globally
 */

import { configureStore } from '@reduxjs/toolkit';

import formBuilderReducer from './formBuilderSlice';

export const store = configureStore({

  reducer: {

    formBuilder: formBuilderReducer,

  },
 
});