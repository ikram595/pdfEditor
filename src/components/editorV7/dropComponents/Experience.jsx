import React, { useState } from "react";

const Experience = ({ style, onChange }) => {
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [tasks, setTasks] = useState([""]);

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
    onChange({ company, period, tasks: newTasks });
  };
  return (
    <div style={style}>
      <div>
        <label>Company:</label>
        <input
          type="text"
          value={company}
          onChange={(e) => {
            setCompany(e.target.value);
            onChange({ company: e.target.value, period, tasks });
          }}
        />
      </div>
      <div>
        <label>Period:</label>
        <input
          type="text"
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            onChange({ company, period: e.target.value, tasks });
          }}
        />
      </div>
      <div>
        <label>Tasks:</label>
        {tasks.map((task, index) => (
          <input
            key={index}
            type="text"
            value={task}
            onChange={(e) => handleTaskChange(index, e.target.value)}
            placeholder={`Task ${index + 1}`}
          />
        ))}
        <button onClick={() => setTasks([...tasks, ""])}>Add Task</button>
      </div>
    </div>
  );
};

export default Experience;
