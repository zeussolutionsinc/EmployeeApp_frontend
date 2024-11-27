import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Sidebar from "./Sidebar";
import "./SuperAdmin.module.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function SuperAdmin() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  // const [employees, setEmployees] = useState([]);
  const [employeesToBeAdmin, setEmployeesToBeAdmin] = useState([]);
  const [employeesToBeSuperAdmin, setEmployeesToBeSuperAdmin] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [approverMap, setApproverMap] = useState({});
  const [open, setOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const showAlert = (message, severity) => {
    setAlertInfo({ severity, message });
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://zeusemployeeportalbackend.azurewebsites.net/api/EmployeeList`;
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
        console.log(json);

        if (json && json.Employees && json.Approvers) {
          const employeeData = json.Employees.map((emp) => ({
            id: emp.EmployeeId,
            name: emp.FullName,
          }));

          const approverData = json.Approvers.map((app) => ({
            id: app.EmployeeId,
            name: app.ApproverName,
          }));

          const approverMap = approverData.reduce((acc, app) => {
            acc[app.id] = app.name;
            return acc;
          }, {});

          const empToBeApp = employeeData.filter(
            (emp) => !approverData.some((app) => app.id === emp.id)
          );
          console.log(
            "empToBeApp:",
            JSON.stringify(empToBeApp, null, 2).length
          );
          console.log(
            "employeeData:",
            JSON.stringify(employeeData, null, 2).length
          );
          // setEmployees(employeeData);
          setApprovers(approverData.map((app) => app.id));
          setApproverMap(approverMap);

          const approverXEmployeeResponse = await fetch(
            "https://zeusemployeeportalbackend.azurewebsites.net/api/EmployeeList/GetApproverXEmployee",
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              mode: "cors",
            }
          );

          if (!approverXEmployeeResponse.ok) {
            throw new Error("Network response was not ok");
          }

          const approverXEmployeeJson = await approverXEmployeeResponse.json();
          const approverXEmployeeData = approverXEmployeeJson.map((item) => ({
            employeeId: item.EmployeeId,
            employee: employeeData.find((emp) => emp.id === item.EmployeeId)
              .name,
            approverId: item.ApproverId,
          }));

          setRowData(approverXEmployeeData);
          setEmployeesToBeAdmin(empToBeApp);
        
        
        const superAdminResponse = await fetch("https://zeusemployeeportalbackend.azurewebsites.net/api/SuperAdmin/GetSuperAdmins", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!superAdminResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const superAdminJson = await superAdminResponse.json();
        const superAdminIds = new Set(superAdminJson);

        console.log("CURRSUPER:", )

        const nonSuperAdminEmployees = employeeData.filter((emp) => !superAdminIds.has(emp.id));
        setEmployeesToBeSuperAdmin(nonSuperAdminEmployees);

      }    
        else {
          throw new Error("Fetched data is not in the expected format");
        }
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    fetchData();
  }, []);

  const columnDefs = [
    { headerName: "Employee", field: "employee", flex: 1, editable: false },
    {
      headerName: "Approver",
      field: "approverId",
      flex: 1,
      cellEditor: "agSelectCellEditor",
      cellEditorPopup: true,
      cellEditorParams: {
        values: approvers,
      },
      valueFormatter: (params) => approverMap[params.value] || "",
      editable: true,
      singleClickEdit: true,
    },
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onCellValueChanged = (params) => {
    const { data } = params;
    console.log(
      `Employee: ${data.employee}, EmployeeId: ${data.employeeId}, Approver ID: ${data.approverId}, Approver: ${approverMap[data.approverId]}`
    );
  };

  const handleSubmitAdmin = () => {
    const selectedEmployeeIds = selectedEmployees.map((employee) => employee.id);
    console.log("Selected Employee IDs:", selectedEmployeeIds);
    handleAddApprovers(selectedEmployeeIds);
  };


  const handleSetEmployeeApproverRelation = () => {
    const updatedData = [];
    gridApi.forEachNode((node) => updatedData.push(node.data));

    const approverXEmployees = updatedData
      .filter((row) => row.approverId && row.employeeId)
      .map((row) => ({
        EmployeeId: row.employeeId,
        Approver: row.approverId,
      }));

    console.log(approverXEmployees);
    handleSetEmployeeApproverRelationBackend(approverXEmployees);
  };

  const handleAddApprovers = async (approverIds) => {
    if (approverIds.length === 0) return;
    try {
      const response = await fetch("https://zeusemployeeportalbackend.azurewebsites.net/api/EmployeeList/AddApprovers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(approverIds),
      });

      if (response.ok) {
        showAlert("Approvers added successfully!", "success");
      } else {
        showAlert("Failed to add approvers", "error");
      }
    } catch (error) {
      console.error("Error adding approvers:", error);
    }
  };

  const handleSetEmployeeApproverRelationBackend = async (
    approverXEmployees
  ) => {
    if (approverXEmployees.length === 0) return;
    try {
      const response = await fetch(
        "https://zeusemployeeportalbackend.azurewebsites.net/api/EmployeeList/SetEmployeeApproverRelation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(approverXEmployees),
        }
      );

      if (response.ok) {
        showAlert("Employee-Approver relations set successfully!", "success");
      } else {
        showAlert("Failed to set employee-approver relations", "error");
      }
    } catch (error) {
      console.error("Error setting employee-approver relations:", error);
    }
  };

  const handleSetSuperAdmin = async () => {
    if (selectedEmployees.length === 0) return;
  
    const employeeIds = selectedEmployees.map((employee) => employee.id);
  
    try {
      const response = await fetch("https://zeusemployeeportalbackend.azurewebsites.net/api/SuperAdmin/SetSuperAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeIds),
      });
  
      if (response.ok) {
        showAlert("SuperAdmins set successfully!", "success");
      } else {
        showAlert("Failed to set SuperAdmins", "error");
      }
    } catch (error) {
      console.error("Error setting SuperAdmins:", error);
      showAlert("Error setting SuperAdmins", "error");
    }
  };
  

  return (
    <>
      <Sidebar />
      <div className="is-approver mb-5 flex flex-col items-center">
        <h1 className="text-center text-3xl">Approver</h1>
        <h3 className="text-center">Which of these employees is an approver</h3>
        <Autocomplete
          multiple
          disablePortal
          id="combo-box-demo"
          options={employeesToBeAdmin}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setSelectedEmployees(newValue)}
          sx={{ width: 300, marginTop: "10px" }}
          renderInput={(params) => <TextField {...params} label="Employee" />}
        />
        <Button
          variant="contained"
          sx={{
            margin: "5px",
            backgroundColor: "#dc3333", // Sets the background color of the button
            color: "white", // Sets the text color of the button
            "&:hover": {
              backgroundColor: "darken(#dc3333, 0.2)", // Darkens the background color on hover
              color: "black", // Changes the text color on hover
            },
          }}
          color="primary"
          onClick={handleSubmitAdmin}
        >
          Submit
        </Button>
        <h1 className="text-center text-3xl">SuperAdmin</h1>
        <h3 className="text-center">Which of these employees is a super admin</h3>
        <Autocomplete
          multiple
          disablePortal
          id="combo-box-demo"
          options={employeesToBeSuperAdmin}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setSelectedEmployees(newValue)}
          sx={{ width: 300, marginTop: "10px" }}
          renderInput={(params) => <TextField {...params} label="Employee" />}
        />
        <Button
          variant="contained"
          sx={{
            margin: "5px",
            backgroundColor: "#dc3333", // Sets the background color of the button
            color: "white", // Sets the text color of the button
            "&:hover": {
              backgroundColor: "darken(#dc3333, 0.2)", // Darkens the background color on hover
              color: "black", // Changes the text color on hover
            },
          }}
          color="primary"
          onClick={handleSetSuperAdmin}
        >
          Submit
        </Button>
        <h1 className="text-center text-3xl mt-5">
          Approver & Employee Mapping
        </h1>
        <div
          className="ag-theme-alpine"
          style={{ height: 250, width: "30vw", margin: "20px 0" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            pagination={true}
            paginationPageSize={5}
            domLayout="autoHeight"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSetEmployeeApproverRelation}
          sx={{
            marginTop: "50px",
            backgroundColor: "#dc3333", // Sets the background color of the button
            color: "white", // Sets the text color of the button
            "&:hover": {
              backgroundColor: "darken(#dc3333, 0.2)", // Darkens the background color on hover
              color: "black", // Changes the text color on hover
            },
          }}
        >
          Submit
        </Button>
        <Snackbar
          open={open}
          autoHideDuration={10000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={alertInfo.severity}
            sx={{ width: "100%" }}
          >
            {alertInfo.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default SuperAdmin;
