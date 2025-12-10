/**
 * @author Sneha T
 * Header componet
 */

import React, { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { resetForm } from '../../redux/formBuilderSlice';

import styles from '../../styles/components/_header.module.scss';

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const Header = ({ exportSchema }) => {

  const dispatch = useDispatch();

  /**
   * Hiandle reset function
   */
  const handleReset = useCallback(() => {

    if (window.confirm("Are you sure you want to reset the form? This action cannot be undone.")) {

      dispatch(resetForm());

    }

  }, [dispatch]);

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