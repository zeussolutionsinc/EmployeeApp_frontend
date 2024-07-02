import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid

export default function PrevRecords({ setRecordSelected }) {
  const [colDefs, setColDefs] = useState([
    {
      field: "RecordNumber",
      headerName: "Record ID",
      sortable: true,
      filter: true,
      maxWidth: 140
    },
    {
      field: "SubmissionDate",
      headerName: "Submission Date",
      sortable: true,
      filter: true,
    },
    {
      field: "ApprovalStatus",
      headerName: "Status",
      sortable: true,
      filter: true,
    },
    {
      field: "WorkingHours",
      headerName: "# Hours",
      sortable: true,
      filter: true,
    },
    {
      field: "StartDate",
      headerName: "Start Date",
      sortable: true,
      filter: true,
    },
    {
      field: "EndDate",
      headerName: "End Date",
      sortable: true,
      filter: true,
    },
  ]);
  const [error, setError] = useState("");
  const [backendRecords, setBackendRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const url = new URL("https://localhost:7078/api/PreviousRecords");
        // url.searchParams.append("authid", "6643d03845d79cc121e6cc32");
        const authId = "f1e2d3c4b5a67890dcba4321";
        const url = `https://localhost:7078/api/PreviousRecords/authid/${authId}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        });
        if (!response.ok) {
          throw new error("Network response was not ok");
        }
        const json = await response.json();
        // console.log("Prev Record: ", json);
        setBackendRecords(json);
      } catch (error) {
        setError(
          "There was a problem with your fetch operation: " + error.message
        );
        console.error("There was a problem with your fetch operation:", error);
      }
    };
    fetchData();
  }, []);

  const autoSizeStrategy = { type: "fitGridWidth" };
  return (
    <div className="ag-theme-material" style={{ height: 320, width: '70vw' }}>
      <AgGridReact
        rowData={backendRecords}
        columnDefs={colDefs}
        pagination={true}
        autoSizeStrategy={autoSizeStrategy}
        onRowClicked={(event) => setRecordSelected(event.data.RecordNumber)}
      />
    </div>
  );
}