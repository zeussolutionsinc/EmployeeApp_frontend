import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid

export default function PrevRecords() {
  const [colDefs, setColDefs] = useState([
    { field: "recordId", headerName: "RecordID", sortable: true, filter: true },
    {
      field: "submissionDate",
      headerName: "Submission Date",
      sortable: true,
      filter: true,
    },
    { field: "status", headerName: "Status", sortable: true, filter: true },
    { field: "hours", headerName: "# Hours", sortable: true, filter: true },
    {
      field: "dates",
      headerName: "Submitted Dates",
      sortable: true,
      filter: true,
    },
  ]);

  const [records, setRecords] = useState([
    {
      recordId: "R001",
      submissionDate: "2021-10-01",
      status: "Approved",
      hours: 8,
      dates: "2021-10-01 - 2021-10-5",
    },
    {
      recordId: "R002",
      submissionDate: "2021-10-05",
      status: "Pending",
      hours: 6,
      dates: "2021-10-05 - 2021-10-10",
    },
    {
      recordId: "R003",
      submissionDate: "2021-10-10",
      status: "Rejected",
      hours: 4,
      dates: "2021-10-10 - 2021-10-15",
    },
    {
      recordId: "R004",
      submissionDate: "2021-10-15",
      status: "Approved",
      hours: 10,
      dates: "2021-10-15 - 2021-10-20",
    },
    {
      recordId: "R005",
      submissionDate: "2021-10-20",
      status: "Pending",
      hours: 8,
      dates: "2021-10-20 - 2021-10-25",
    },
  ]);

  return (
    <div className="ag-theme-material" style={{ height: 320, width: 1400 }}>
      <AgGridReact rowData={records} columnDefs={colDefs} />
    </div>
  );
}
