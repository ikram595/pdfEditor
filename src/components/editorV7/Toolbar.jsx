import React from "react";
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import "./style.css";

const Toolbar = ({ style, onStyleChange }) => {
  const handleIncrease = () => {
    const newSize = parseInt(style.fontSize || 16, 10) + 1;
    onStyleChange({ ...style, fontSize: newSize + "px" });
  };

  const handleDecrease = () => {
    const newSize = parseInt(style.fontSize || 16, 10) - 1;
    if (newSize > 0) {
      // Ensure font size doesn't go below 1px
      onStyleChange({ ...style, fontSize: newSize + "px" });
    }
  };
  const handleChange = (e) => {
    const value = e.target.value;
    if (value > 0) {
      // Ensure positive font size
      onStyleChange({ ...style, fontSize: value + "px" });
    }
  };
  return (
    <div className="toolbar">
      <Row>
        <Col>
          <h6>Styles</h6>
        </Col>

        <Col>
          <InputGroup>
            <Button variant="outline-secondary" onClick={handleIncrease}>
              +
            </Button>

            <Form.Control
              type="number"
              value={parseInt(style.fontSize || 16, 10)}
              onChange={handleChange}
              className="hide-arrows"
            />
            <Button variant="outline-secondary" onClick={handleDecrease}>
              -
            </Button>
          </InputGroup>
        </Col>
        <Col>
          {" "}
          <Form.Select
            value={style.fontFamily || "Arial"}
            onChange={(e) =>
              onStyleChange({ ...style, fontFamily: e.target.value })
            }
          >
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </Form.Select>
        </Col>
        <Col>
          <Form.Control
            type="color"
            id="exampleColorInput"
            defaultValue={style.color || "#000000"}
            title="Choose your color"
            onChange={(e) => onStyleChange({ ...style, color: e.target.value })}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Toolbar;
