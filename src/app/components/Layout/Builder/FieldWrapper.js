import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from '../../../styles/components/_builder.module.scss';
import { useDispatch } from 'react-redux';
import { removeField } from '../../../redux/formBuilderSlice';

// Icons for field types (Text, Email, etc.) - Placeholder
const FieldIcon = ({ type }) => {
    const iconMap = {
        text: 'A', email: '@', number: '#', date: <i className="bi bi-calendar-check-fill"></i>, 
        checkbox: <i className="bi bi-check2"></i>, radio: <i className="bi bi-ui-radios"></i>, dropdown: '▼' 
    };
    return <span className={styles.fieldIcon}>{iconMap[type] || '❓'}</span>;
};

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
    e.stopPropagation(); // Prevents selection when removing
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
        ☰
      </div>
      <div className={styles.fieldInfo}>
        <FieldIcon type={field.type} />
        <span className={styles.fieldLabel}>{field.label}</span>
      </div>
      <button className={styles.removeBtn} onClick={handleRemove} title="Remove field">
        X
      </button>
    </div>
  );
};

export default FieldWrapper;