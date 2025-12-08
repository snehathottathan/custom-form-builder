"use client"
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { reorderFields, setSelectedFieldId } from '../../../redux/formBuilderSlice';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import Header from '../Header';
// Lazy Load complex components
const LazyFieldToolbar = React.lazy(() => import('./FieldToolbar'));
const LazyFieldConfigPanel = React.lazy(() => import('./FieldConfigPanel'));
const LazyFieldWrapper = React.lazy(() => import('./FieldWrapper'));
const LazyLivePreview = React.lazy(() => import('./LivePreview'));
const SortableFieldItem = React.lazy(() => import('./SortableFieldItem'));

import styles from '../../../styles/components/_builder.module.scss';

const MainBuilder = () => {
  const dispatch = useDispatch();
  const fields = useSelector(state => state.formBuilder.fields);
  const selectedFieldId = useSelector(state => state.formBuilder.selectedFieldId);
  
  const { exportSchema } = useLocalStorage();

  // Optimization 1: useCallback for D&D handler
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id);
      const newIndex = fields.findIndex(f => f.id === over.id);
      
      const newOrder = arrayMove(fields, oldIndex, newIndex);
      dispatch(reorderFields(newOrder));
    }
  }, [fields, dispatch]); // Dependency on 'fields' is necessary for arrayMove

  // Optimization 2: useMemo to memoize the selected field object
  const selectedField = useMemo(() => {
    return fields.find(f => f.id === selectedFieldId) || null;
  }, [fields, selectedFieldId]);

  // Optimization 3: useCallback for selecting a field
  const handleSelectField = useCallback((id) => {
    dispatch(setSelectedFieldId(id));
  }, [dispatch]);

  return (
    <>
      <Header exportSchema={exportSchema} />
      <div className={styles.builderGrid}>
        
        {/* === LEFT PANEL: Field Toolbar & Configuration === */}
        <div className={styles.configPanel}>
          <React.Suspense fallback={<div>Loading Tools...</div>}>
            <LazyFieldToolbar />
            {selectedField ? (
              <LazyFieldConfigPanel field={selectedField} allFields={fields} />
            ) : (
              <div className={styles.noSelection}>Select a field to configure.</div>
            )}
          </React.Suspense>
        </div>

        {/* === RIGHT PANEL: Live Preview & Drag Area === */}
        <div className={styles.previewPanel}>
          <h2>Live Preview</h2>
          <div className={styles.formContainer}>
            <DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={fields.map((f) => f.id)}
    strategy={verticalListSortingStrategy}
  >
    {fields.map((field) => (
      <SortableFieldItem key={field.id} field={field}>
        <LazyFieldWrapper
          field={field}
          onClick={() => handleSelectField(field.id)}
          isSelected={field.id === selectedFieldId}
        />
      </SortableFieldItem>
    ))}
  </SortableContext>
</DndContext>

            <React.Suspense fallback={<div>Generating Preview...</div>}>
                <LazyLivePreview fields={fields} />
            </React.Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainBuilder;