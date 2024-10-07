import React from "react";
import { useDrag } from "react-dnd";
const DraggableComponent = ({ componentType, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { componentType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "10px",
        border: "1px solid black",
        marginBottom: "5px",
        cursor: "move",
      }}
    >
      {children}
    </div>
  );
};

export default DraggableComponent;
