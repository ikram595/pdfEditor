import React, { useState } from "react";
import jsPDF from "jspdf";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./Sidebar";
import DropZone from "./DropZone";
import Toolbar from "./Toolbar";
import Experience from "./dropComponents/Experience";
import Education from "./dropComponents/Education";
import "./style.css";
import Nav from "./Nav";
const componentMap = {
  Experience: Experience,
  Education: Education,
};
const EditorV7 = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleDrop = (item) => {
    setComponents([
      ...components,
      { type: item.componentType, style: {}, id: components.length, data: {} },
    ]);
  };

  const handleComponentClick = (index) => {
    setSelectedComponent(index);
  };

  const handleStyleChange = (style) => {
    if (selectedComponent !== null) {
      const updatedComponents = [...components];
      updatedComponents[selectedComponent].style = style;
      setComponents(updatedComponents);
    }
  };
  const handleFieldChange = (data) => {
    if (selectedComponent !== null) {
      const updatedComponents = [...components];
      updatedComponents[selectedComponent].data = data;
      setComponents(updatedComponents);
    }
  };
  const handleRemoveComponent = (index) => {
    setComponents(components.filter((_, i) => i !== index));
    if (selectedComponent === index) {
      setSelectedComponent(null);
    }
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    components.forEach((comp, index) => {
      doc.text(comp.type, 10, 10 + 10 * index);
    });
    doc.save("document.pdf");
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor">
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Nav
            exportToPDF={exportToPDF}
            style={
              selectedComponent !== null
                ? components[selectedComponent].style
                : {}
            }
            onStyleChange={handleStyleChange}
          />
          <div
            style={{
              background: "#EBECF0",
              padding: "50px",
            }}
          >
            <DropZone onDrop={handleDrop}>
              {components.map((comp, index) => {
                const Component = componentMap[comp.type];
                const isSelected = index === selectedComponent;
                return (
                  <div
                    key={index}
                    style={{
                      ...comp.style,
                      border: isSelected ? ".5px dashed red" : "none",
                      position: "relative",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                    onClick={() => handleComponentClick(index)}
                  >
                    <Component
                      style={comp.style}
                      onChange={(data) => handleFieldChange(data)}
                    />
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveComponent(index);
                        }}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          textAlign: "center",
                          lineHeight: "20px",
                          cursor: "pointer",
                        }}
                      >
                        x
                      </button>
                    )}
                  </div>
                );
              })}
            </DropZone>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default EditorV7;
