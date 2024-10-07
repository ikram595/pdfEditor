import React from "react";
import DraggableComponent from "./DraggableComponent";
import "./style.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Components</h3>
      <DraggableComponent componentType="Experience">
        <div>Experience</div>
      </DraggableComponent>
      <DraggableComponent componentType="Education">
        <div>Education</div>
      </DraggableComponent>
      {/* Add more draggable components here */}
    </div>
  );
};

export default Sidebar;
