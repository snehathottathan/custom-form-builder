import { useSortable } from "@dnd-kit/sortable";
import { CSS as DndCSS } from "@dnd-kit/utilities";
import React from "react";

export default function SortableFieldItem({ field, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: transform ? DndCSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {typeof children === "function"
        ? children({ attributes, listeners })
        : children}
    </div>
  );
}
