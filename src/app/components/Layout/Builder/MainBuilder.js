"use client"

import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { reorderFields, setSelectedFieldId } from "../../../redux/formBuilderSlice";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

import Header from "../Header";
import SortableFieldItem from "./SortableFieldItem";
import FreeDraggable from "./FreeDraggable";

const LazyFieldToolbar = React.lazy(() => import("./FieldToolbar"));
const LazyFieldConfigPanel = React.lazy(() => import("./FieldConfigPanel"));
const LazyFieldWrapper = React.lazy(() => import("./FieldWrapper"));
const LazyLivePreview = React.lazy(() => import("./LivePreview"));

import styles from "../../../styles/components/_builder.module.scss";

export default function MainBuilder() {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.formBuilder.fields);
  const selectedFieldId = useSelector((state) => state.formBuilder.selectedFieldId);

  const { exportSchema } = useLocalStorage();

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (active.id !== over.id) {
        const oldIndex = fields.findIndex((f) => f.id === active.id);
        const newIndex = fields.findIndex((f) => f.id === over.id);
        dispatch(reorderFields(arrayMove(fields, oldIndex, newIndex)));
      }
    },
    [fields, dispatch]
  );

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) || null,
    [fields, selectedFieldId]
  );

  return (
    <>
      <Header exportSchema={exportSchema} />

      <div className={styles.builderGrid}>
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

        <div className={styles.previewPanel}>
          <h2>Live Preview</h2>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableFieldItem key={field.id} field={field}>
                  {({ attributes, listeners }) => (
                    <FreeDraggable id={`drag-${field.id}`}>
                      <LazyFieldWrapper
                        field={field}
                        {...attributes}
                        {...listeners}
                        onClick={() => dispatch(setSelectedFieldId(field.id))}
                        isSelected={field.id === selectedFieldId}
                      />
                    </FreeDraggable>
                  )}
                </SortableFieldItem>
              ))}
            </SortableContext>
          </DndContext>

          <React.Suspense fallback={<div>Generating Preview...</div>}>
            <LazyLivePreview fields={fields} />
          </React.Suspense>
        </div>
      </div>
    </>
  );
}
