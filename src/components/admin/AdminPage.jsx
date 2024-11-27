import React, { useState, useEffect, useRef } from "react"
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AdminPage.css";
import Sidebar from "../Sidebar";
import { Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useAuth0 } from "@auth0/auth0-react";
import ImageCellRenderer from "./ImageCellRenderer";
// import ResumeIcon from '../../../public/resume.png'

const statusMapping = {
  P: "Pending",
  R: "Rejected",
  A: "Approved",
  S: "Submitted", // Add this if 'S' stands for 'Submitted'
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// const sasToken = 'sp=racw&st=2024-08-04T03:04:55Z&se=2025-09-24T11:04:55Z&spr=https&sv=2022-11-02&sr=c&sig=jtyIOzSd5pa51YCPL690XfD0PmrZcWcQgOkrrz488r4%3D';


const AdminPage = () => {
  const gridRef = useRef(null);
  const [value, setValue] = useState("1");
  const [h1bData, setH1bData] = useState([]);
  const [h1bColumns, setH1bColumns] = useState([]);
  const [vacationData, setVacationData] = useState([]);
  const [vacationColumns, setVacationColumns] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  const [filteredTimesheetData, setFilteredTimesheetData] = useState([]);
  const [timesheetColumns, setTimesheetColumns] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // const [statuses, setStatuses] = useState({
  //   pending: false,
  //   rejected: false,
  //   submitted: false,
  //   approved: false,
  // });
  // const [availableMonths, setAvailableMonths] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  // const [isMonthSelected, setIsMonthSelected] = useState(false);
  // const [selectedMonth, setSelectedMonth] = useState(null);
  // const [selectedYear, setSelectedYear] = useState(null);
  const [childGridData, setChildGridData] = useState([]);
  const [childGridColumns, setChildGridColumns] = useState([]);
  // const [resumeUrl, setResumeUrl] = useState("");
  // const [showResumePopup, setShowResumePopup] = useState(false);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [open, setOpen] = useState(false);
  const[sk, setsk] = useState();
  const[eid, seteid] = useState();
  // const [gridColumnApi, setGridColumnApi] = useState(null);
  const { user } = useAuth0();
  const authId = user.sub.substring(6);
  // const [refreshKey, setRefreshKey] = useState(0);
  const sasToken = 'sp=racw&st=2024-08-04T03:04:55Z&se=2025-09-24T11:04:55Z&spr=https&sv=2022-11-02&sr=c&sig=jtyIOzSd5pa51YCPL690XfD0PmrZcWcQgOkrrz488r4%3D';
  
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  });

  const showAlert = (message, severity) => {
    setAlertInfo({ severity, message });
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };







  // const gridOptions = {
  //   onColumnResized: (params) => {
  //     ////console.log(params);
  //   },
  //   autoSizeStrategy: {
  //     type: "fitGridWidth",
  //   },
  // };
  const onGridReady = (params) => {
    setGridApi(params.api);
    // setGridColumnApi(params.columnApi);
    headerHeightSetter(params.api);
  };

  // const handleSelectionChange = (params) => {
  //   setSelectedRows(params.api.getSelectedRows());
  // };

  const handleBulkApprove = async () => {
    const selectedRows = gridApi.getSelectedRows();
    const apiUrlH1b = "https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/";
    const apiUrlVacation = "https://zeusemployeeportalbackend.azurewebsites.net/api/AdminVacation/";

    for (let row of selectedRows) {
      const url =
        value === "3"
          ? `${apiUrlH1b}${row.registrationId}/updateStatus?status=Approved`
          : `${apiUrlVacation}${row.Id}/updateStatus?status=Approved`;

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          alert(
            `Failed to update status for ${
              value === "3" ? row.registrationId : row.Id
            }`
          );
        }
      } catch (error) {
        console.error(
          `Error updating status for ${
            value === "3" ? row.registrationId : row.Id
          }:`,
          error
        );
        alert(
          `Error updating status for ${
            value === "3" ? row.registrationId : row.Id
          }`
        );
      }
    }

    alert("Status updated successfully!");
    if (value === "3") {
      fetchData(`/api/AdminH1b/authid/${authId}`, setH1bData, setH1bColumns, h1bColumnDefs);
    } else {
      fetchData(
        `api/AdminVacation/authid2/${authId}`,
        setVacationData,
        setVacationColumns,
        vacationColumnDefs
      );
    }
  };

  const handleBulkReject = async () => {
    const selectedRows = gridApi.getSelectedRows();
    const apiUrlH1b = "https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/";
    const apiUrlVacation = "https://zeusemployeeportalbackend.azurewebsites.net/api/AdminVacation/";

    for (let row of selectedRows) {
      const url =
        value === "3"
          ? `${apiUrlH1b}${row.registrationId}/updateStatus?status=Rejected`
          : `${apiUrlVacation}${row.Id}/updateStatus?status=Rejected`;

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          alert(
            `Failed to update status for ${
              value === "3" ? row.registrationId : row.Id
            }`
          );
        }
      } catch (error) {
        console.error(
          `Error updating status for ${
            value === "3" ? row.registrationId : row.Id
          }:`,
          error
        );
        alert(
          `Error updating status for ${
            value === "3" ? row.registrationId : row.Id
          }`
        );
      }
    }

    alert("Status updated successfully!");
    if (value === "3") {
      fetchData(`https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/authid/${authId}`, setH1bData, setH1bColumns, h1bColumnDefs);
    } else {
      fetchData(
        `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminVacation/authid2/${authId}`,
        setVacationData,
        setVacationColumns,
        vacationColumnDefs
      );
    }
  };

  // const handleResumeClick = (resumeUrl) => {
  //   const urlParts = resumeUrl.split("?")[0]; // Remove query parameters
  //   const fileName = urlParts.substring(urlParts.lastIndexOf("/") + 1); // Extract the file name
  //   const fullUrl = `/api/AdminH1b/resume/${fileName}`;
  //   window.location.href = fullUrl;
  // };

  // useEffect(() => {}, [resumeUrl]);

  // useEffect(() => {}, [showResumePopup]);

  const fetchEmployeesData = async () => {
    try {
      console.log("AUTHID:", authId);
      const response = await fetch(`https://zeusemployeeportalbackend.azurewebsites.net/api/AdminTimeSheet/all/${authId}`, {
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
      //console.log("RAW JSON: ", json);
      const updatedEmployeesData = json.map((emp) => {
        const approvalCounts = emp.Records.reduce(
          (acc, record) => {
            if (record.ApprovalStatus === "P") acc.Pending += 1;
            if (record.ApprovalStatus === "R") acc.Rejected += 1;
            if (record.ApprovalStatus === "S") acc.Submitted += 1;
            if (record.ApprovalStatus === "A") acc.Approved += 1;
            return acc;
          },
          { Pending: 0, Rejected: 0, Submitted: 0, Approved: 0 }
        );
        console.log("This is emp:", emp);
        return {
          ...emp,
          EmployeeName: emp.Name, // Assuming the employee name is coming from the Name field in the response
          Pending: approvalCounts.Pending,
          Rejected: approvalCounts.Rejected,
          Submitted: approvalCounts.Submitted,
          Approved: approvalCounts.Approved,
          TSFreq: emp.TSFreq,
        };
      });

      setEmployeesData(updatedEmployeesData);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const fetchData = async (url, setData, setColumns, columnDefinitions) => {
    try {
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

      // Apply filter if the URL contains the vacation endpoint
      let filteredData = json;
      if (url.includes("VacationAppItems" || "AdminH1B")) {
        filteredData = json.filter((item) => item.ApprovalStatus === "Pending");
      }

      setData(filteredData);
      setFilteredTimesheetData(filteredData); // Set the initial filtered data

      if (filteredData.length > 0) {
        const columns = columnDefinitions.map((col) => ({
          headerCheckboxSelection: col.headerCheckboxSelection,
          checkboxSelection: col.checkboxSelection,
          headerName: col.headerName,
          field: col.field,
          maxWidth: col.maxWidth,
          headerClass: "header-center",
          cellRenderer: col.cellRenderer ? col.cellRenderer : null,
          tooltipField: col.field, // Show tooltip
        }));
        setColumns(columns);
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleApprove = async (data) => {
    //console.log("data:", data);
    try {
      const response = await fetch(
        `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/${data.registrationId}/updateStatus?status=Approved`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showAlert("Status updated successfully!", "success");
        fetchData(`/api/AdminH1b/authid/${authId}`, setH1bData, setH1bColumns, h1bColumnDefs);
      } else {
        showAlert("Failed to update status", "failure");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("Error updating status", "failure");
    }
  };

  const handleReject = async (data) => {
    try {
      const response = await fetch(
        `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/${data.registrationId}/updateStatus?status=Rejected`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showAlert("Status updated successfully!", "success");
        fetchData(`/api/AdminH1b/authid/${authId}`, setH1bData, setH1bColumns, h1bColumnDefs); // Call fetchData again to refresh the data
      } else {
        showAlert("Failed to update status", "failure");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("Error updating status", "failure");
    }
  };

  const h1bColumnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 50,
    },
    {
      headerName: "",
      field: "approve",
      pinned: "left",
      cellClass: "bold-cell",
      maxWidth: 50,
      cellRenderer: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 15,
            }}
          >
            <button
              className="approve-button"
              onClick={() => handleApprove(params.data)}
            >
              <span role="img" aria-label="approve">
                ✅
              </span>
            </button>
          </div>
        );
      },
    },
    {
      headerName: "",
      field: "reject",
      pinned: "left",
      cellClass: "bold-cell",
      maxWidth: 50,
      cellRenderer: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 15,
            }}
          >
            <button
              className="reject-button"
              onClick={() => handleReject(params.data)}
            >
              <span role="img" aria-label="reject">
                ❌
              </span>
            </button>
          </div>
        );
      },
    },
    {
      headerName: "Passport Number",
      field: "passportNumber",
      maxWidth: 150,
    },
    { headerName: "First Name", field: "legalFirstName", maxWidth: 120 },
    { headerName: "Last Name", field: "legalLastName", maxWidth: 120 },
    {
      headerName: "Passport Expiry Date",
      field: "passportExpiryDate",
      maxWidth: 150,
    },
    { headerName: "Email", field: "email", maxWidth: 200 },
    { headerName: "Contact Number", field: "contactNumber", maxWidth: 120 },
    {
      headerName: "Highest Education",
      field: "highestEducation",
      maxWidth: 150,
    },
    {
      headerName: "Institution City",
      field: "institutionCity",
      maxWidth: 120,
    },
    {
      headerName: "Institution Name",
      field: "institutionName",
      maxWidth: 200,
    },
    {
      headerName: "Graduation Year",
      field: "graduationYear",
      maxWidth: 120,
    },
    { headerName: "On OPT", field: "onOPT", maxWidth: 80 },
    { headerName: "Worked in US", field: "workedInUS", maxWidth: 100 },
    {
      headerName: "Years of Experience",
      field: "yearsOfExperience",
      maxWidth: 120,
    },
    {
      headerName: "Current Employer",
      field: "currentEmployer",
      maxWidth: 150,
    },
    {
      headerName: "Current Job Title",
      field: "currentJobTitle",
      maxWidth: 150,
    },
    {
      headerName: "Primary Technical Skills",
      field: "primaryTechnicalSkills",
      maxWidth: 200,
    },
    {
      headerName: "Referral Source",
      field: "referralSource",
      maxWidth: 120,
    },
    {
      headerName: "Registration ID",
      field: "registrationId",
      maxWidth: 120,
    },
    { headerName: "Degree Major", field: "degreeMajor", maxWidth: 120 },
    {
      headerName: "LinkedIn Profile",
      field: "linkedInProfile",
      maxWidth: 200,
    },
    { headerName: "Resume", field: "resume", maxWidth: 150 },
    //{ headerName: "ApprovalStatus", field: "ApprovalStatus", maxWidth: 150 },
  ];

  useEffect(() => {
    fetchData(`/api/AdminH1b/authid/${authId}`, setH1bData, setH1bColumns, h1bColumnDefs);
  }, []);

  const handleApproveVacation = async (data) => {
    //console.log("Data recieved:", data);
    try {
      const response = await fetch(
        `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminVacation/${data.Id}/updateStatus?status=Approved`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showAlert("Status updated successfully!", "success");
        fetchData(
          `api/AdminVacation/authid2/${authId}`,
          setVacationData,
          setVacationColumns,
          vacationColumnDefs
        );
      } else {
        showAlert("Failed to update status", "failure");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("Error updating status", "failure");
    }
  };

  

  const handleRejectVacation = async (data) => {
    try {
      const response = await fetch(
        `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminVacation/${data.Id}/updateStatus?status=Rejected`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showAlert("Status updated successfully!", "success");
        fetchData(
          `api/AdminVacation/authid2/${authId}`,
          setVacationData,
          setVacationColumns,
          vacationColumnDefs
        );
      } else {
        showAlert("Failed to update status", "failure");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("Error updating status", "failure");
    }
  };
  



  const vacationColumnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 50,
    },
    {
      headerName: "",
      field: "approve",
      pinned: "left",
      cellClass: "bold-cell",
      maxWidth: 50,
      cellRenderer: (params) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 15 }}>
          <button className="approve-button" onClick={() => handleApproveVacation(params.data)}>
            <span role="img" aria-label="approve">✅</span>
          </button>
        </div>
      ),
    },
    {
      headerName: "",
      field: "reject",
      pinned: "left",
      cellClass: "bold-cell",
      maxWidth: 50,
      cellRenderer: (params) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 15 }}>
          <button className="reject-button" onClick={() => handleRejectVacation(params.data)}>
            <span role="img" aria-label="reject">❌</span>
          </button>
        </div>
      ),
    },
    { headerName: "ID", field: "Id", maxWidth: 50 },
    { headerName: "Email", field: "Email", maxWidth: 150 },
    { headerName: "Name", field: "Name", maxWidth: 150 },
    { headerName: "Body", field: "Body", maxWidth: 250 },
    { headerName: "Vacation Start Date", field: "VacationStartdate", maxWidth: 170 },
    { headerName: "Vacation End Date", field: "VacationEnddate", maxWidth: 150 },
    { headerName: "Approved Status", field: "ApprovalStatus", maxWidth: 100 },
    {
      headerName: "Image URL",
      field: "ImageUrl",
      maxWidth: 200,
      cellRenderer: 'imageCellRenderer', // Specify the custom cell renderer
    },
    { headerName: "End Hours", field: "Endhours", maxWidth: 100 },
    { headerName: "Start Hours", field: "Starthours", maxWidth: 120 },
  ];

  

  useEffect(() => {
    fetchData(
      `api/AdminVacation/authid2/${authId}`,
      setVacationData,
      setVacationColumns,
      vacationColumnDefs
    );
  }, []);


  useEffect(() => {
    fetchData(`/api/AdminH1b/authid/${authId}`, setH1bData, setH1bColumns, [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        maxWidth: 50,
      },
      {
        headerName: "",
        field: "approve",
        pinned: "left",
        cellClass: "bold-cell",
        maxWidth: 50,
        cellRenderer: (params) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 15,
              }}
            >
              <button
                className="approve-button"
                onClick={() => handleApprove(params.data)}
              >
                <span role="img" aria-label="approve">
                  ✅
                </span>
              </button>
            </div>
          );
        },
      },
      {
        headerName: "",
        field: "reject",
        pinned: "left",
        cellClass: "bold-cell",
        maxWidth: 50,
        cellRenderer: (params) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 15,
              }}
            >
              <button
                className="reject-button"
                onClick={() => handleReject(params.data)}
              >
                <span role="img" aria-label="reject">
                  ❌
                </span>
              </button>
            </div>
          );
        },
      },
      {
        headerName: "Passport Number",
        field: "passportNumber",
        maxWidth: 100,
      },
      { headerName: "First Name", field: "legalFirstName", maxWidth: 120 },
      { headerName: "Last Name", field: "legalLastName", maxWidth: 120 },
      {
        headerName: "Passport Expiry Date",
        field: "passportExpiryDate",
        maxWidth: 120,
      },
      { headerName: "Email", field: "email", maxWidth: 200 },
      { headerName: "Contact Number", field: "contactNumber", maxWidth: 120 },
      {
        headerName: "Highest Education",
        field: "highestEducation",
        maxWidth: 100,
      },
      {
        headerName: "Institution City",
        field: "institutionCity",
        maxWidth: 120,
      },
      {
        headerName: "Institution Name",
        field: "institutionName",
        maxWidth: 150,
      },
      {
        headerName: "Graduation Year",
        field: "graduationYear",
        maxWidth: 120,
      },
      { headerName: "On OPT", field: "onOPT", maxWidth: 80 },
      { headerName: "Worked in US", field: "workedInUS", maxWidth: 100 },
      {
        headerName: "Years of Experience",
        field: "yearsOfExperience",
        maxWidth: 120,
      },
      {
        headerName: "Current Employer",
        field: "currentEmployer",
        maxWidth: 150,
      },
      {
        headerName: "Current Job Title",
        field: "currentJobTitle",
        maxWidth: 150,
      },
      {
        headerName: "Primary Technical Skills",
        field: "primaryTechnicalSkills",
        maxWidth: 200,
      },
      {
        headerName: "Referral Source",
        field: "referralSource",
        maxWidth: 120,
      },
      { headerName: "Degree Major", field: "degreeMajor", maxWidth: 120 },
      {
        headerName: "LinkedIn Profile",
        field: "linkedInProfile",
        maxWidth: 200,
      },
      {
        headerName: "Resume",
        field: "resume",
        maxWidth: 100,
        cellRenderer: (params) => {
          return (
            <button
              className="resume-button"
              // onClick={() => handleResumeClick(params.data.resume)}
            >
              <img
                src='./resume.png'
                alt="resume"
                className="resume-icon"
              />
            </button>
          );
        },
      },

      //{ headerName: "ApprovalStatus", field: "ApprovalStatus", maxWidth: 150 },
    ]);
    fetchData(`api/AdminVacation/authid2/${authId}`, setVacationData, setVacationColumns, [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        maxWidth: 50,
      },
      {
        headerName: "",
        field: "approve",
        pinned: "left",
        cellClass: "bold-cell",
        maxWidth: 50,
        cellRenderer: (params) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 15,
              }}
            >
              <button
                className="approve-button"
                onClick={() => handleApproveVacation(params.data)}
              >
                <span role="img" aria-label="approve">
                  ✅
                </span>
              </button>
            </div>
          );
        },
      },
      {
        headerName: "",
        field: "reject",
        pinned: "left",
        cellClass: "bold-cell",
        maxWidth: 50,
        cellRenderer: (params) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 15,
              }}
            >
              <button
                className="reject-button"
                onClick={() => handleRejectVacation(params.data)}
              >
                <span role="img" aria-label="reject">
                  ❌
                </span>
              </button>
            </div>
          );
        },
      },
      { headerName: "ID", field: "Id", maxWidth: 50 },
      { headerName: "Email", field: "Email", maxWidth: 150 },
      { headerName: "Name", field: "Name", maxWidth: 150 },
      { headerName: "Body", field: "Body", maxWidth: 250 },
      {
        headerName: "Vacation Start Date",
        field: "VacationStartdate",
        maxWidth: 170,
      },
      {
        headerName: "Vacation End Date",
        field: "VacationEnddate",
        maxWidth: 150,
      },
      {
        headerName: "Approved Status",
        field: "ApprovalStatus",
        maxWidth: 100,
      },
      //  { headerName: "Is Manager", field: "isManager", maxWidth: 100 },
      { headerName: "Image URL", field: "ImageUrl", maxWidth: 200 },
      //{ headerName: "Agree", field: "agree", maxWidth: 80 },
      // { headerName: "File Upload", field: "fileupload", maxWidth: 150 },
      { headerName: "End Hours", field: "Endhours", maxWidth: 100 },
      { headerName: "Start Hours", field: "Starthours", maxWidth: 120 },
    ]);
    fetchData("/api/AdminEmpTimesheet", setTimesheetData, setTimesheetColumns, [
      { headerName: "Employee Name", field: "EmployeeName", maxWidth: 150 },
      { headerName: "Pending", field: "Pending", maxWidth: 100 },
      { headerName: "Rejected", field: "Rejected", maxWidth: 100 },
      { headerName: "Submitted", field: "Submitted", maxWidth: 100 },
      { headerName: "Approved", field: "Approved", maxWidth: 100 },
    ]);
    fetchEmployeesData();
  }, []);

  useEffect(() => {
    // Reset state when the tab changes
    // setIsMonthSelected(false);
    setSelectedEmployee(null); // Clear the selected employee
    setFilteredTimesheetData([]); // Clear the timesheet data
    setTimesheetColumns([]); // Clear the columns
    // setAvailableMonths([]); // Clear available months
    setChildGridData([]); // Clear child grid data
    setChildGridColumns([]); // Clear child grid columns
    // setStatuses({
    //   pending: false,
    //   rejected: false,
    //   submitted: false,
    //   approved: false,
    // });
    fetchData(
      "/api/AdminEmpTimesheet",
      setTimesheetData,
      setTimesheetColumns,
      ["EmployeeId", "action"] // Replace with the actual column names you want to exclude
    );
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleStatusChange = (status) => {
  //   setStatuses((prevStatuses) => {
  //     const updatedStatuses = {
  //       ...prevStatuses,
  //       [status]: !prevStatuses[status],
  //     };
  //     return updatedStatuses;
  //   });
  // };

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedEmployeeData =
      selectedData.length > 0 ? selectedData[0] : selectedEmployee;

    if (selectedEmployeeData) {
      const employeeInfo = employeesData.find(
        (emp) => emp.EmployeeId === selectedEmployeeData.EmployeeId
        // seteid(selectedEmployeeData.EmployeeId);
      );

      if (employeeInfo) {
        setSelectedEmployee({
          ...selectedEmployeeData,
          EmployeeName: selectedEmployeeData.EmployeeName || "Unknown",
          // seteid(selectedEmployeeData.employeeId);
        });
        // setAvailableMonths(employeeInfo.Months);
        // seteid(selectedEmployeeData.EmployeeId);
      } else {
        setSelectedEmployee(null);
        // setAvailableMonths([]);
      }
    } else {
      setSelectedEmployee(null);
      // setAvailableMonths([]);
    }
  };


  
  const onCellClicked = (params) => {
    if (params.colDef.field !== "Name") {
      const statusName = params.colDef.field;
      const statusKey = Object.keys(statusMapping).find(
        (key) => statusMapping[key] === statusName
      );
      console.log("Params:", params.data.EmployeeId);
      if (statusKey) {
        seteid(params.data.EmployeeId);
        setsk(statusKey); 
        fetchTimesheetDataByStatus(params.data.EmployeeId, statusKey);
      }
    }
  };

  useEffect(() => {
    if (eid) {
      fetchTimesheetDataByStatus(eid, sk); // Use the updated eid and status key
    }
  }, [eid, sk]);

  const fetchTimesheetDataByStatus = async (employeeId, status) => {
    console.log("Setting status:", status);
    try {
        const response = await fetch(
            `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminTimeSheet/${employeeId}/status?status=${status}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                setChildGridData([{ message: "No data to display" }]);
                setChildGridColumns([
                    {
                        headerName: "Message",
                        field: "message",
                        headerClass: "header-center",
                        pinned: "left",
                        cellClass: "bold-cell",
                        width: 150,
                        maxWidth: 150,
                    },
                ]);
            } else {
                throw new Error("Network response was not ok");
            }
        } else {
            const json = await response.json();
            console.log(`Timesheet Data for ${status}:`, json);
            if (json.Records.length === 0) {
                setChildGridData([{ message: "No data to display" }]);
                setChildGridColumns([
                    {
                        headerName: "Message",
                        field: "message",
                        headerClass: "header-center",
                        pinned: "left",
                        cellClass: "bold-cell",
                        width: 150,
                        maxWidth: 150,
                    },
                ]);
            } else {
                console.log("Processing Data at child grid");
                console.log("EMPID INITIAL:", employeeId);
                // seteid(employeeId);
                const firstRecord = json.Records[0];
                const timesheetData = json.Records.map(record => ({
                    Year: record.Year,
                    Month: record.Month,
                    Timesheets: record.Timesheets
                }));
                console.log("Calling processChildGridData with status:", status);
                processChildGridData(
                    timesheetData,
                    firstRecord.Year,
                    firstRecord.Month,
                    null,
                    employeeId,
                    status // Pass the status directly
                );
            }
        }
    } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
        setChildGridData([{ message: "No data to display" }]);
        setChildGridColumns([
            {
                headerName: "Message",
                field: "message",
                headerClass: "header-center",
                pinned: "left",
                cellClass: "bold-cell",
                width: 150,
                maxWidth: 150,
            },
        ]);
    }
};


  
const isSubmitted = (status) => {
  console.log("Status passed to isSubmitted:", status);
  return status === "S";
};


  // const fetchTimesheetDataForMonth = async (year, month) => {
  //   const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  //   const endDate = new Date(year, month, 0);
  //   const formattedEndDate = `${year}-${month
  //     .toString()
  //     .padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;

  //   try {
  //     const response = await fetch(
  //       `/api/AdminTimeSheet/${selectedEmployee.EmployeeId}/dateRange?startDate=${startDate}&endDate=${formattedEndDate}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //         mode: "cors",
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const json = await response.json();
  //     //console.log("TS ENTRY:", json);
  //     console.log("EMPID INITIAL:", selectedEmployee.EmployeeId, year, month);
  //     processChildGridData(
  //       json,
  //       year,
  //       month,
  //       endDate.getDate(),
  //       selectedEmployee.EmployeeId
  //     );
  //     // setIsMonthSelected(true);
  //     setSelectedMonth(monthNames[month - 1]);
  //     setSelectedYear(year);
  //   } catch (error) {
  //     console.error("There was a problem with your fetch operation:", error);
  //     console.log("EMPID INITIAL:", selectedEmployee.EmployeeId, year, month);
  //     processChildGridData(
  //       [],
  //       year,
  //       month,
  //       endDate.getDate(),
  //       selectedEmployee.EmployeeId
  //     );
  //   }
  // };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const fetchTSFreq = async (employeeId) => {
    try {
      const response = await fetch(`https://zeusemployeeportalbackend.azurewebsites.net/api/Employee/${employeeId}/tsfreq`, {
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
      console.log(json.TSFreq);
      return json.TSFreq; // Adjust based on the exact response structure
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      return null;
    }
  };

  const checkDateInRange = (date, recordStartDate, tsFreq) => {
    if (!recordStartDate) return false; // Ensure recordStartDate is valid

    if (tsFreq === "W") {
        const startDate = getSunday(recordStartDate);
        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 6);
        return date >= startDate && date <= endDate;
    }
    if (tsFreq === "B") {
        const startDate = getSunday(recordStartDate);
        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 13);
        return date >= startDate && date <= endDate;
    }
    if (tsFreq === "M") {
        const startDate = new Date(recordStartDate.getUTCFullYear(), recordStartDate.getUTCMonth(), 1);
        const endDate = new Date(recordStartDate.getUTCFullYear(), recordStartDate.getUTCMonth() + 1, 0);
        return date >= startDate && date <= endDate;
    }
    return true;
};

const getSunday = (d) => {
  d = new Date(d);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day; // Adjust to get the previous Sunday
  return new Date(d.setUTCDate(diff));
};


const handleTimesheetApprove = async (data) => {
  console.log("ApproveData:", data);
  const { RecordNumber } = data;
  console.log("Apprinvg for:", eid);
  const payload = {
      RecordNumber : RecordNumber,
      EmployeeId : eid
  };
  console.log("PAYLOAD: ", payload);
  try {
      const response = await fetch('https://zeusemployeeportalbackend.azurewebsites.net/api/AdminTimeSheet/approve', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      });

      if (response.ok) {
        showAlert("Status updated successfully!", "success");
        //fetchTimesheetDataByStatus(EmployeeId, statuses)
        fetchEmployeesData();
        // console.log("EID, SK: ", eid, sk);
        fetchTimesheetDataByStatus(eid, 'S');

        // setRefreshKey(oldKey => oldKey + 1); // Trigger re-render
          // Update the grid data or state as needed
      } else {
        showAlert("Failed to update status", "failure");
      }
  } catch (error) {
    showAlert("Error updating status", "failure");
  }
};

const handleTimesheetReject = async (data) => {
  console.log("RejectData:", data);
  const { RecordNumber } = data;
  const payload = {
    RecordNumber : RecordNumber,
    EmployeeId : eid
  };

  try {
      const response = await fetch('https://zeusemployeeportalbackend.azurewebsites.net/api/AdminTimeSheet/reject', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      });

      if (response.ok) {
        showAlert("Status updated successfully!", "success");
        fetchEmployeesData();
        // console.log(EmployeeId);
        // console.log("sk: ", sk);
        fetchTimesheetDataByStatus(eid, 'S');

        // setRefreshKey(oldKey => oldKey + 1); // Trigger re-render
          // Update the grid data or state as needed
      } else {
        showAlert("Failed to update status", "failure");
      }
  } catch (error) {
    showAlert("Error updating status", "failure");
  }
};


const processChildGridData = async (data, year = null, month = null, daysInMonth = null, employeeId, status) => {
  const tsFreq = await fetchTSFreq(employeeId); // Fetch TSFreq for the given employeeId

  const transformedData = [];
  const columns = new Set(); // Initialize columns here
  const isMonthBased = year !== null && month !== null && daysInMonth !== null;

  const dayInitials = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isMonthBased) {
    const monthYear = `${monthNames[month - 1]} ${year}`;
    const projectEntries = data.reduce((acc, { ProjectId, WorkingDate, Hours, RecordNumber, ApprovalStatus }) => {
      const day = new Date(Date.UTC(new Date(WorkingDate).getUTCFullYear(), new Date(WorkingDate).getUTCMonth(), new Date(WorkingDate).getUTCDate())).getUTCDate();
      const recordStartDate = getSunday(new Date(WorkingDate)); // Calculate recordStartDate based on the first Sunday of the week
      if (!acc[RecordNumber]) {
        acc[RecordNumber] = {
          RecordNumber,
          MonthYear: monthYear,
          ApprovalStatus,
          projects: {},
          recordStartDate, // Add recordStartDate
          firstWorkingDate: new Date(WorkingDate) // Add first working date for sorting
        };
      }
      if (!acc[RecordNumber].projects[ProjectId]) {
        acc[RecordNumber].projects[ProjectId] = { ProjectId, days: {} };
      }
      acc[RecordNumber].projects[ProjectId].days[day] = Hours;
      columns.add(day); // Ensure day is a number
      return acc;
    }, {});

    Object.values(projectEntries).forEach((entry) => {
      Object.values(entry.projects).forEach((project) => {
        const entryWithDays = {
          ...project,
          MonthYear: entry.MonthYear,
          RecordNumber: entry.RecordNumber,
          ApprovalStatus: entry.ApprovalStatus,
          recordStartDate: entry.recordStartDate, // Pass recordStartDate
          firstWorkingDate: entry.firstWorkingDate // Pass firstWorkingDate
        };
        for (let day = 1; day <= daysInMonth; day++) {
          const currentDay = new Date(Date.UTC(year, month - 1, day));
          const isInRange = checkDateInRange(currentDay, entryWithDays.recordStartDate, tsFreq);
          entryWithDays[day] = isInRange ? (entryWithDays.days[day] || 0) : null; // Use null instead of ""
          columns.add(day); // Ensure day is a number
        }
        delete entryWithDays.days;
        transformedData.push(entryWithDays);
      });
    });
  } else {
    data.forEach(({ Year, Month, Timesheets }) => {
      const monthYear = `${monthNames[Month - 1]} ${Year}`;
      const daysInMonth = getDaysInMonth(Year, Month);
      const projectEntries = Timesheets.reduce((acc, { ProjectId, WorkingDate, WorkingHours, RecordNumber, ApprovalStatus }) => {
        const day = new Date(Date.UTC(new Date(WorkingDate).getUTCFullYear(), new Date(WorkingDate).getUTCMonth(), new Date(WorkingDate).getUTCDate())).getUTCDate();
        const recordStartDate = getSunday(new Date(WorkingDate)); // Calculate recordStartDate based on the first Sunday of the week
        if (!acc[RecordNumber]) {
          acc[RecordNumber] = {
            RecordNumber,
            MonthYear: monthYear,
            ApprovalStatus,
            projects: {},
            recordStartDate, // Add recordStartDate
            firstWorkingDate: new Date(WorkingDate) // Add first working date for sorting
          };
        }
        if (!acc[RecordNumber].projects[ProjectId]) {
          acc[RecordNumber].projects[ProjectId] = { ProjectId, days: {} };
        }
        acc[RecordNumber].projects[ProjectId].days[day] = WorkingHours;
        columns.add(day); // Ensure day is a number
        return acc;
      }, {});

      Object.values(projectEntries).forEach((entry) => {
        Object.values(entry.projects).forEach((project) => {
          const entryWithDays = {
            ...project,
            MonthYear: entry.MonthYear,
            RecordNumber: entry.RecordNumber,
            ApprovalStatus: entry.ApprovalStatus,
            recordStartDate: entry.recordStartDate, // Pass recordStartDate
            firstWorkingDate: entry.firstWorkingDate // Pass firstWorkingDate
          };
          for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(Date.UTC(Year, Month - 1, day));
            const isInRange = checkDateInRange(currentDay, entryWithDays.recordStartDate, tsFreq);
            entryWithDays[day] = isInRange ? (entryWithDays.days[day] || 0) : null; // Use null instead of ""
            columns.add(day); // Ensure day is a number
          }
          delete entryWithDays.days;
          transformedData.push(entryWithDays);
        });
      });
    });
  }

  console.log("Columns before sorting:", Array.from(columns)); // Log before sorting
  const sortedColumns = Array.from(columns).sort((a, b) => a - b); // Sort columns
  console.log("Sorted Columns:", sortedColumns); // Log after sorting

  // Sort transformedData based on the first working date
  transformedData.sort((a, b) => new Date(a.firstWorkingDate) - new Date(b.firstWorkingDate));

  const columnDefs = [
    ...(isSubmitted(status) ? [{
      headerName: "",
      field: "approve",
      pinned: "left",
      cellClass: "bold-cell",
      maxWidth: 50,
      cellRenderer: (params) => {
        const { data, node, api } = params;
        const rowIndex = node.rowIndex;
        if (
          rowIndex === 0 ||
          api.getDisplayedRowAtIndex(rowIndex - 1).data.RecordNumber !== data.RecordNumber
        ) {
          return (
            <div>
              
              <button className="approve-button" onClick={() => handleTimesheetApprove(params.data)}>
                <span role="img" aria-label="approve">✅</span>
              </button>
            </div>
          );
        } else {
          return "";
        }
      },
      headerClass: "header-center",
    },

    {
      headerName: "",
      field: "reject",
      pinned: "left",
      cellClass: "bold-cell",
      maxWidth: 50,
      cellRenderer: (params) => {
        const { data, node, api } = params;
        const rowIndex = node.rowIndex;
        if (
          rowIndex === 0 ||
          api.getDisplayedRowAtIndex(rowIndex - 1).data.RecordNumber !== data.RecordNumber
        ) {
          return (
            <div>
              <button className="reject-button" onClick={() => handleTimesheetReject(params.data)}>
                <span role="img" aria-label="reject">❌</span>
              </button>
            </div>
          );
        } else {
          return "";
        }
      },
      headerClass: "header-center",
    }] : []),
    {
      headerName: "Time-Sheet ID",
      field: "RecordNumber", // Use RecordNumber as the field
      headerClass: "header-center",
      pinned: "left",
      maxWidth: 100,

      autoHeight: true, 
    },
    {
      headerName: "Approval Status",
      field: "ApprovalStatus",
      headerClass: "header-center",
      pinned: "left",

      autoHeight: true, 
      cellClass: (params) => {
        switch (params.value) {
          case "A":
            return "approval-status-a";
          case "P":
            return "approval-status-p";
          case "R":
            return "approval-status-r";
          case "S":
            return "approval-status-s";
          default:
            return "";
        }
      },
      maxWidth: 100,
    },
    {
      headerName: "Month-Year",
      field: "MonthYear",
      headerClass: "header-center",
      pinned: "left",
      maxWidth: 100,
      cellClass: "bold-cell",
    },
    {
      headerName: "Project ID",
      field: "ProjectId",
      headerClass: "header-center",
      pinned: "left",
      maxWidth: 90,
    },
    ...sortedColumns.map((day) => ({
      headerName: day.toString(),
      field: day.toString(),
      headerClass: "header-center",
      minWidth: 60, // Reduced minWidth for better fit
      maxWidth: 70, // Reduced maxWidth for better fit
      cellClass: (params) => {
        const dayIndex = params.colDef.field;
        const currentDay = new Date(Date.UTC(year, month - 1, dayIndex));
        const isInRange = checkDateInRange(currentDay, params.data.recordStartDate, tsFreq);
        return !isInRange ? 'bg-gray' : '';
      },
      cellRenderer: (params) => {
        const dayIndex = params.colDef.field;
        const currentDay = new Date(Date.UTC(year, month - 1, dayIndex));
        const dayName = dayInitials[currentDay.getUTCDay()];
        const isInRange = checkDateInRange(currentDay, params.data.recordStartDate, tsFreq);
        const cellValue = params.value;
        return (
          <div className={`day-cell ${!isInRange ? 'bg-gray' : ''}`}>
            <div>{cellValue}</div>
            {isInRange && <div className="day-initial">{dayName}</div>}
          </div>
        );
      },
    })),
    
  ]
  
  // const rowClassRules = {
  //   'approval-status-a': 'data.ApprovalStatus === "A"',
  //   'approval-status-p': 'data.ApprovalStatus === "P"',
  //   'approval-status-r': 'data.ApprovalStatus === "R"',
  //   'approval-status-s': 'data.ApprovalStatus === "S"',
  // };

  console.log("transformed:", transformedData);
  setChildGridData(transformedData);
  setChildGridColumns(columnDefs);
};




  // const renderAvailableMonths = () => {
  //   const activeStatuses = Object.keys(statuses).filter(
  //     (status) => statuses[status]
  //   );
  //   const filteredMonths =
  //     activeStatuses.length === 0
  //       ? availableMonths
  //       : availableMonths.filter((month) =>
  //           activeStatuses.includes(
  //             statusMapping[month.ApprovalStatus].toLowerCase()
  //           )
  //         );

  //   return filteredMonths.map((month) => (
  //     <Button
  //       key={`${month.Year}-${month.Month}`}
  //       variant="contained"
  //       className="month-button"
  //       onClick={() => {
  //         fetchTimesheetDataForMonth(month.Year, month.Month);
  //       }}
  //     >
  //       {month.Year}-{month.Month} ({statusMapping[month.ApprovalStatus]})
  //     </Button>
  //   ));
  // };

  // const getCalculatedWidth = () => {
  //   // Get the viewport width
  //   const vw = Math.max(
  //     document.documentElement.clientWidth || 0,
  //     window.innerWidth || 0
  //   );
  //   // Calculate 7vw in pixels
  //   const calcWidth = (5 * vw) / 100;
  //   // Return the maximum of 90 or 7vw
  //   return Math.max(90, calcWidth);
  // };

  const renderEmployeeList = () => {
    const columnDefs = [
      {
        headerName: "Employee",
        field: "Name",
        headerClass: "header-center",
        minWidth: 200,
        flex: 2, // Higher flex value to make this column wider
        cellClass: (params) => {
          return params.node.rowIndex ===
            params.api.getFocusedCell()?.rowIndex &&
            params.column.colId === params.api.getFocusedCell()?.column.colId
            ? "ag-cell-focus"
            : "";
        },
      },
      {
        headerName: "Pending",
        field: "Pending",
        headerClass: "header-center",
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: "Rejected",
        field: "Rejected",
        headerClass: "header-center",
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: "Submitted",
        field: "Submitted",
        headerClass: "header-center",
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: "Approved",
        field: "Approved",
        headerClass: "header-center",
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: "TimeSheet Frequency",
        field: "TSFreq",
        headerClass: "header-center",
        minWidth: 100,
        flex: 1,
      },
    ];
  
    return (
      <div className="employee-list-container" style={{ width: "70vw" }}>
        <div
          className="ag-theme-alpine employee-grid"
          style={{
            height: "60vh",
            width: "100%", // Ensure the grid takes full width of the container
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={employeesData}
            columnDefs={columnDefs}
            rowHeight={45}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            onCellClicked={onCellClicked}
            defaultColDef={{
              sortable: true,
              resizable: true,
              flex: 1, // Default flex value for other columns
              headerComponentParams: {
                menuIcon: "fa-bars",
              },
            }}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit(); // Ensure columns fit the grid width
            }}
            onCellFocused={(params) => {
              // Manually trigger re-render to apply the focus class
              params.api.refreshCells({ force: true });
            }}
          />
        </div>
      </div>
    );
  };
  
  

  const headerHeightSetter = (api) => {
    if (api) {
      const padding = 20;
      const height = headerHeightGetter() + padding;
      api.setHeaderHeight(height);
      api.resetRowHeights();
    }
  };
  
  const headerHeightGetter = () => {
    const columnHeaderTexts = [
      ...document.querySelectorAll('.ag-header-cell-text'),
    ];
    const clientHeights = columnHeaderTexts.map(
      (headerText) => headerText.clientHeight
    );
    const tallestHeaderTextHeight = Math.max(...clientHeights);
  
    return tallestHeaderTextHeight;
  };
  
  
  const defaultColDef = {
    flex: 1,
    // resizable: true,
    sortable: true,
    wrapText: true,
    autoHeight: true,
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
        '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
        '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
        '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
        '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
        '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
        '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
        '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
        '  </div>' +
        '</div>',
    },
  };
  

  const renderChildGrid = () => {
    if (childGridData.length === 0) return null;

    return (
      <div className="child-grid-container" style={{ marginTop: "1%" }}>
        <div
          className="ag-theme-alpine child-grid"
          style={{
            height: "30vh",
            overflowY: "auto",
            width: "90vw",
          }}
        >
          <AgGridReact
              rowData={childGridData}
              columnDefs={childGridColumns}
              rowHeight={30}
              defaultColDef={defaultColDef}
              domLayout="autoHeight"
              onGridReady={onGridReady}
              onFirstDataRendered={(params) => headerHeightSetter(params.api)}
              onColumnResized={(params) => headerHeightSetter(params.api)}
              className="ag-theme-alpine" /* Ensure the grid is using the alpine theme */
              /* You can also add more configurations as needed */
            ></AgGridReact>

        </div>
      </div>
    );
  };

  const renderContent = () => {
    const { rowData, columnDefs } = getRowData(value);
    const isTimesheetTab = value === "1";

    if (isTimesheetTab) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {renderEmployeeList()}
          </div>
          {renderChildGrid()}
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "calc(80vw)",
          }}
        >
          <div
            className="ag-theme-alpine"
            style={{
              height: "60vh",
              overflowY: "auto",
              transition: "width 0.3s",
            }}
          >
            <AgGridReact
              onGridReady={onGridReady}
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              context={{ sasToken }} // Pass the context with SAS token
              frameworkComponents={{ imageCellRenderer: ImageCellRenderer }}
              rowHeight={45}
              rowSelection="multiple"
              defaultColDef={{
                sortable: true,
                resizable: true,
                minWidth: 50,
                headerComponentParams: {
                  menuIcon: "fa-bars",
                },
              }}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
        </div>
      </div>
    );
  };

  const getRowData = (value) => {
    switch (value) {
      case "1":
        return { rowData: filteredTimesheetData, columnDefs: timesheetColumns };
      case "2":
        return { rowData: vacationData, columnDefs: vacationColumns };
      case "3":
        return { rowData: h1bData, columnDefs: h1bColumns };
      default:
        return { rowData: [], columnDefs: [] };
    }
  };

  return (
    <>
      <Sidebar />

      <div className="app-container">
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              width: "100%",
              margin: 0,
              padding: 0,
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="tabs"
              centered
              className="tab-list"
              TabIndicatorProps={{ className: "tab-indicator" }}
            >
              <Tab label="TimeSheets" value="1" className="tab" />
              <Tab label="Vacation Requests" value="2" className="tab" />
              <Tab label="H1B" value="3" className="tab" />
              {/* <Tab label="New Hires" value="4" className="tab" /> */}
            </TabList>
          </Box>
          <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
            <TabPanel
              className="tab-panel"
              value={value}
              style={{ padding: 0, margin: 0, width: "100%" }}
            >
              {renderContent()}
            </TabPanel>
          </Box>
        </TabContext>

        {value !== "1" && (
          <div className="button-below-grid">
            <Button className="button-approve" onClick={handleBulkApprove}>
              Approve
            </Button>
            <Button className="button-reject" onClick={handleBulkReject}>
              Reject
            </Button>
          </div>
        )}
      </div>
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
    </>
  );
};

export default AdminPage;
