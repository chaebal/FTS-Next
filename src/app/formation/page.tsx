// "use client";

// import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
// import { useDraggable, useDroppable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";
// import { useState } from "react";

// export default function Page() {
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { delta } = event;
//     setPosition((position) => ({
//       x: position.x + delta.x,
//       y: position.y + delta.y,
//     }));
//   };

//   const { attributes, listeners, setNodeRef } = useDraggable({
//     id: "unique-id",
//   });

//   function DraggableComponent({
//     position,
//   }: {
//     position: { x: number; y: number };
//   }) {
//     const { attributes, listeners, setNodeRef, transform } = useDraggable({
//       id: "draggable-item",
//     });

//     const style: React.CSSProperties = {
//       transform: transform
//         ? CSS.Translate.toString(transform) // Transforming based on the draggable's internal state
//         : `translate(${position.x}px, ${position.y}px)`, // Using the custom position if transform is not available
//       position: "absolute",
//     };

//     return (
//       <div
//         ref={setNodeRef}
//         style={style}
//         {...listeners}
//         {...attributes}
//         className="draggable"
//       >
//         Drag me
//       </div>
//     );
//   }

//   function DroppableComponent() {
//     const { setNodeRef: setFirstDroppableRef } = useDroppable({
//       id: "drop-1",
//     });

//     return <div ref={setFirstDroppableRef}>Drop here</div>;
//   }

//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       <DraggableComponent position={position} />
//     </DndContext>
//   );
// }

"use client";

import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function Page() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    // Update the position of the draggable item after the drag ends
    setPosition((prevPosition) => ({
      x: prevPosition.x + delta.x,
      y: prevPosition.y + delta.y,
    }));

    console.log(`Prev position x ${position.x} y ${position.y}`);
    console.log(`Delta x ${delta.x} Delta y ${delta.y}`);
    console.log(`New position x ${delta.x} Delta y ${delta.y}`);
  };

  // Draggable component
  const DraggableComponent = ({
    position,
  }: {
    position: { x: number; y: number };
  }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: "draggable-item",
    });

    const style: React.CSSProperties = {
      transform: transform
        ? CSS.Translate.toString(transform) // Use the transform from useDraggable
        : `translate(${position.x}px, ${position.y}px)`, // Fallback to custom position if transform is not available
      position: "absolute",
      cursor: "move",
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="draggable"
      >
        Drag me
      </div>
    );
  };

  // Droppable component
  const DroppableComponent = () => {
    const { setNodeRef } = useDroppable({
      id: "drop-1",
    });

    return (
      <div
        ref={setNodeRef}
        style={{
          width: "300px",
          height: "300px",
          border: "2px dashed #ccc",
          position: "relative",
        }}
      >
        Drop here
      </div>
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* <DroppableComponent /> */}
      <DraggableComponent position={position} />
    </DndContext>
  );
}
