'use client';

import { Provider } from 'react-redux';
import { store } from './redux/store';

// This component wraps the entire app in the Redux Provider
export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}