import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

export const BloodPressureGrid = () => {
  const [rowData, setRowData] = useState([
    { id: 1, name: 'John Doe', systolic: 120, diastolic: 80 },
    { id: 2, name: 'Jane Doe', systolic: 130, diastolic: 85 },
  ]);

  const [columnDefs] = useState([
    { field: 'name', headerName: 'Patient Name', editable: false },
    { field: 'systolic', headerName: 'Systolic BP', editable: true },
    { field: 'diastolic', headerName: 'Diastolic BP', editable: true },
  ]);

  const onCellValueChanged = (params) => {
    const updatedData = rowData.map((row) => {
      if (row.id === params.data.id) {
        return { ...params.data };
      }
      return row;
    });
    setRowData(updatedData);
    console.log('Updated row data:', updatedData);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          flex: 1,
          editable: true,
          resizable: true,
        }}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
};

export default BloodPressureGrid;
