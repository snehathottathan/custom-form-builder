/**
 * @author Sneha T
 * Draggale componet
 */

import { useDraggable } from "@dnd-kit/core";

import { CSS as DndCSS } from "@dnd-kit/utilities";

import React from "react";

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export default function FreeDraggable({ id, children }) {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {

    transform: transform ? DndCSS.Translate.toString(transform) : undefined,

    touchAction: "none",

  };

  return (

    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>

      {children}

    </div>

  );
  
}
