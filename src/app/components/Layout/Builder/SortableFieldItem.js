import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

export default function SortableFieldItem({ field, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Pass sortable props down to the child (FieldWrapper)
  const childWithProps = React.cloneElement(children, {
    sortableListeners: listeners,
    sortableAttributes: attributes,
  });

  return (
    <div ref={setNodeRef} style={style}>
      {childWithProps}
    </div>
  );
}
