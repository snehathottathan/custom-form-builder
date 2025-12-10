/**
 * @author Sneha T
 * Field wrapper component
 */

import React from 'react';

import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import styles from '../../../styles/components/_builder.module.scss';

import { useDispatch } from 'react-redux';

import { removeField } from '../../../redux/formBuilderSlice';

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const FieldIcon = ({ type }) => {

  const iconMap = {

    text: 'A', email: '@', number: '#', date: <i className="bi bi-calendar-check-fill"></i>,

    checkbox: <i className="bi bi-check2"></i>, radio: <i className="bi bi-ui-radios"></i>, dropdown: <i className="bi bi-caret-down-fill"></i>
  };
  return <span className={styles.fieldIcon}>{iconMap[type] || <i class="bi bi-question"></i>}</span>;

};

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const FieldWrapper = ({ field, onClick, isSelected }) => {

  const dispatch = useDispatch();

  // DnD-kit hook to make the component sortable
  const {

    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,

  } = useSortable({ id: field.id });

  const style = {

    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',

  };

  const handleRemove = (e) => {
    // Prevents selection when removing
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to remove the field: "${field.label}"?`)) {

      dispatch(removeField(field.id));

    }

  };

  return (

    <div

      ref={setNodeRef}

      style={style}

      {...attributes}

      className={`${styles.fieldWrapper} ${isSelected ? styles.selected : ''}`}

      onClick={() => onClick(field.id)}

    >

      <div className={styles.dragHandle} {...listeners} title="Drag to reorder">

        <i className="bi bi-list"></i>

      </div>

      <div className={styles.fieldInfo}>

        <FieldIcon type={field.type} />

        <span className={styles.fieldLabel}>{field.label}</span>

      </div>

      <button className={styles.removeBtn} onPointerDown={(e) => e.stopPropagation()}

        onClick={handleRemove}

        title="Remove field">

        <i className="bi bi-x-lg"></i>

      </button>

    </div>

  );

};

export default FieldWrapper;