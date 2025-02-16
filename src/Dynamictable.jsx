import React, { useState } from 'react';
import { Table, Form } from 'react-bootstrap';

const DynamicTable = ({ columns, rows }) => {
  // Initialize state for storing input values
  const [inputValues, setInputValues] = useState(
    Array(rows.length)
      .fill()
      .map(() => Array(columns.length).fill(''))
  );

  // Handle changes in input fields
  const handleInputChange = (rowIndex, colIndex, value) => {
    const newInputValues = [...inputValues];
    newInputValues[rowIndex][colIndex] = value;
    setInputValues(newInputValues);
    
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          {columns.map((col, index) => (
            <th key={index}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td>{row}</td>
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                <Form.Control
                  type="number"
                  value={inputValues[rowIndex][colIndex]}
                  onChange={(e) =>
                    handleInputChange(rowIndex, colIndex, e.target.value)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DynamicTable;
