import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-material.css"; // Optional Theme applied to the grid
import { useAuth0 } from "@auth0/auth0-react";

export default function PrevRecords({ setRecordSelected }) {
  const [colDefs, setColDefs] = useState([
    {
      field: "RecordNumber",
      headerName: "Time Card ID",
      sortable: true,
      filter: true,
      maxWidth: 140,
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
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const authId = user.sub.substring(6);
      const fetchData = async () => {
        try {
          const url = `/api/PreviousRecords/authid/${authId}`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            mode: "cors",
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();
          setBackendRecords(json);
        } catch (error) {
          setError(
            "There was a problem with your fetch operation: " + error.message
          );
          console.error("There was a problem with your fetch operation:", error);
        }
      };
      fetchData();
    }
  }, [isLoading, isAuthenticated, user]);

  const autoSizeStrategy = { type: "fitGridWidth" };

  const getRowStyle = params => {
    switch (params.data.ApprovalStatus) {
      case "A":
        return { background: "#a1e4c0" };
      case "P":
        return { background: "#ffe066" };
      case "R":
        return { background: "#ff7a99" };
      case "S":
        return { background: "#c3b0e2" };
      default:
        return null;
    }
  };

  return (
    <div className="ag-theme-material" style={{ height: 320, width: "70vw" }}>
      <AgGridReact
        rowData={backendRecords}
        columnDefs={colDefs}
        pagination={true}
        autoSizeStrategy={autoSizeStrategy}
        getRowStyle={getRowStyle}
        onRowClicked={(event) => setRecordSelected(event.data.RecordNumber)}
      />
    </div>
  );
}
