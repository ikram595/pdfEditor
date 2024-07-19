import React, { useState } from "react";
import "./style.css";
function EditorV5() {
  const [tasks, setTasks] = useState([
    {
      name: "Experience",
      bgcolor: "skyblue",
      type: "input",
      fields: { age: "", name: "" },
    },
  ]);

  const [droppedTasks, setDroppedTasks] = useState([]);

  const onDragStart = (ev, task) => {
    console.log("dragstart:", task.name);
    ev.dataTransfer.setData("task", JSON.stringify(task));
  };

  const onDragOver = (ev) => {
    ev.preventDefault();
  };

  const onDrop = (ev) => {
    ev.preventDefault();
    let task = JSON.parse(ev.dataTransfer.getData("task"));

    setDroppedTasks([...droppedTasks, task]);
  };

  const handleChange = (index, fieldName, value) => {
    let updatedTasks = droppedTasks.map((task, i) => {
      if (i === index) {
        task.fields[fieldName] = value;
      }
      return task;
    });

    setDroppedTasks(updatedTasks);
  };

  return (
    <div className="container-drag">
      <div className="sidebar">
        <h3>Components</h3>
        {tasks.map((task) => (
          <div
            key={task.name}
            onDragStart={(e) => onDragStart(e, task)}
            draggable
            className="draggable"
            style={{ backgroundColor: task.bgcolor }}
          >
            {task.name}

            <label htmlFor="ageField">
              <input
                type="text"
                placeholder="Age"
                value={task.fields.age}
                readOnly
              />
            </label>
            <label htmlFor="nameField">
              <input
                type="text"
                placeholder="Name"
                value={task.fields.name}
                readOnly
              />
            </label>
          </div>
        ))}
      </div>
      <div
        className="main"
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e)}
      >
        <h3>Drop Here</h3>
        {droppedTasks.map((task, index) => (
          <div
            key={index}
            className="draggable"
            style={{ backgroundColor: task.bgcolor }}
          >
            <div>{task.name}</div>
            <input
              type="text"
              placeholder="Age"
              value={task.fields.age}
              onChange={(e) => handleChange(index, "age", e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              value={task.fields.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditorV5;
