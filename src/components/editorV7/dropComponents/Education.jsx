import React, { useState } from "react";

const Education = ({ style, onChange }) => {
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [year, setYear] = useState("");
  return (
    <div style={style}>
      <div>
        <label>Institution:</label>
        <input
          type="text"
          value={institution}
          onChange={(e) => {
            setInstitution(e.target.value);
            onChange({ institution: e.target.value, degree, year });
          }}
        />
      </div>
      <div>
        <label>Degree:</label>
        <input
          type="text"
          value={degree}
          onChange={(e) => {
            setDegree(e.target.value);
            onChange({ institution, degree: e.target.value, year });
          }}
        />
      </div>
      <div>
        <label>Year:</label>
        <input
          type="text"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            onChange({ institution, degree, year: e.target.value });
          }}
        />
      </div>
    </div>
  );
};

export default Education;
