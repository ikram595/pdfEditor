import React from "react";
import { useDrop } from "react-dnd";
const DropZone = ({ onDrop, children }) => {
  const [, drop] = useDrop({
    accept: "COMPONENT",
    drop: (item) => onDrop(item),
  });
  return (
    <div ref={drop} className="dropZone">
      {children}
    </div>
  );
};

export default DropZone;
