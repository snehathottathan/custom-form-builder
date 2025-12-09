import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { resetForm } from '../../redux/formBuilderSlice';
import styles from '../../styles/components/_header.module.scss';
// Import icons/SVGs as needed

const Header = ({ exportSchema }) => {
  const dispatch = useDispatch();
  
  // Optimization: useCallback for button handlers
  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the form? This action cannot be undone.")) {
      dispatch(resetForm());
    }
  }, [dispatch]);

  // Load logic is handled automatically by useLocalStorage on mount
  // Save logic is handled automatically by useLocalStorage on fields change

  return (
    <header className={styles.header}>
      <div className={styles.buttonGroup}>
        <button className={styles.btn} onClick={() => alert("Auto-saved to LocalStorage!")}><i className="bi bi-floppy2"></i> Save</button>
        <button className={styles.btn} onClick={() => alert("Auto-loaded on startup!")}><i className="bi bi-download"></i> Load</button>
        <button className={styles.btn} onClick={handleReset}><i className="bi bi-arrow-repeat"></i> Reset</button>
      </div>
      <div className='h1-class'>Form Builder</div>
      <button className={`${styles.btn} ${styles.export}`} onClick={exportSchema}>Export JSON</button>
    </header>
  );
};

export default Header;