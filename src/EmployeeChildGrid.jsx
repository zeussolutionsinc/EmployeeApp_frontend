import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./App.css";

const EmployeeListGrid = ({ setSelectedEmployee }) => {
  const [employeesData, setEmployeesData] = useState([]);

  useEffect(() => {
    const fetchEmployeesData = async () => {
      try {
        const response = await fetch("https://localhost:7078/api/AdminTimeSheet/all", {
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
        const updatedEmployeesData = json.map((emp) => ({
          ...emp,
          EmployeeName: emp.Name,
          Pending: emp.Months.filter((month) => month.ApprovalStatus === "P").length,
          Rejected: emp.Months.filter((month) => month.ApprovalStatus === "R").length,
          Submitted: emp.Months.filter((month) => month.ApprovalStatus === "S").length,
          Approved: emp.Months.filter((month) => month.ApprovalStatus === "A").length,
        }));
        setEmployeesData(updatedEmployeesData);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    fetchEmployeesData();
  }, []);

  const onSelectionChanged = (event) => {
    const selectedNode = event.api.getSelectedNodes()[0];
    setSelectedEmployee(selectedNode ? selectedNode.data : null);
  };

  const columnDefs = [
    { headerName: "Employee", field: "Name", headerClass: "header-center", minWidth: 100, maxWidth: 120 },
    { headerName: "Pending", field: "Pending", headerClass: "header-center", minWidth: 80, maxWidth: 90 },
    { headerName: "Rejected", field: "Rejected", headerClass: "header-center", minWidth: 80, maxWidth: 90 },
    { headerName: "Submitted", field: "Submitted", headerClass: "header-center", minWidth: 80, maxWidth: 100 },
    { headerName: "Approved", field: "Approved", headerClass: "header-center", minWidth: 80, maxWidth: 100 },
  ];

  return (
    <div className="employee-list-container">
      <div className="ag-theme-alpine employee-grid" style={{ height: "60vh", overflowY: "auto", transition: "width 0.3s", width: "calc(35vw)" }}>
        <AgGridReact
          rowData={employeesData}
          columnDefs={columnDefs}
          rowHeight={30}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          defaultColDef={{
            sortable: true,
            resizable: true,
            headerComponentParams: {
              menuIcon: "fa-bars",
            },
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeListGrid;
