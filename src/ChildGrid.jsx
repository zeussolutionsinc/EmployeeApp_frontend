import React from "react";
import { AgGridReact } from "ag-grid-react";

const ChildGrid = ({ childGridData, childGridColumns }) => {
  if (childGridData.length === 0) {
    return null;
  }
  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: "40vh",
        marginTop: "20px",
        overflowY: "auto",
        transition: "width 0.3s",
        width: "calc(35vw)",
      }}
    >
      <AgGridReact
        rowData={childGridData}
        columnDefs={childGridColumns}
        rowHeight={30}
        rowSelection="single"
        defaultColDef={{
          sortable: true,
          resizable: true,
          minWidth: 50,
          headerComponentParams: {
            menuIcon: "fa-bars",
          },
        }}
      />
    </div>
  );
};

export default ChildGrid;
