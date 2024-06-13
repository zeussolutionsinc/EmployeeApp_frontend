import React, { useState, useEffect, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./App.css";
import { Button } from "@mui/material";
import FilterBox from "./FilterBox"; // Import the custom filter component

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

const App = () => {
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
  const [statuses, setStatuses] = useState({
    pending: false,
    rejected: false,
    submitted: false,
    approved: false,
  });
  const [availableMonths, setAvailableMonths] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [childGridData, setChildGridData] = useState([]);
  const [childGridColumns, setChildGridColumns] = useState([]);

  const [newRecruitsData] = useState([
    { name: "Alice Brown", position: "Developer", startDate: "2024-05-15" },
    { name: "Bob Green", position: "Designer", startDate: "2024-06-01" },
    { name: "Charlie White", position: "Manager", startDate: "2024-07-01" },
  ]);
  const [newRecruitsColumns] = useState([
    { headerName: "Name", field: "name", headerClass: "header-center" },
    { headerName: "Position", field: "position", headerClass: "header-center" },
    {
      headerName: "Start Date",
      field: "startDate",
      headerClass: "header-center",
    },
  ]);

  const gridOptions = {
    onColumnResized: (params) => {
      console.log(params);
    },
    autoSizeStrategy: {
      type: "fitGridWidth",
    },
    tooltipShowDelay: 0, // Show tooltip immediately
    tooltipHideDelay: 2000, // Hide tooltip after 2 seconds
  };
  

  const applyFilters = () => {
    const activeStatuses = Object.keys(statuses).filter(
      (status) => statuses[status]
    );
    if (activeStatuses.length === 0) {
      setFilteredTimesheetData(timesheetData);
    } else {
      const statusKeys = activeStatuses
        .map((status) => {
          for (const [key, value] of Object.entries(statusMapping)) {
            if (value.toLowerCase() === status) return key;
          }
          return null;
        })
        .filter(Boolean);
      const filteredData = timesheetData.filter((item) =>
        statusKeys.includes(item.status)
      );
      setFilteredTimesheetData(filteredData);
    }
  };

  const fetchEmployeesData = async () => {
    try {
      const response = await fetch(
        "https://localhost:7078/api/AdminTimeSheet/all",
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
        throw new Error("Network response was not ok");
      }
      const json = await response.json();
      console.log("Employees Data:", json);
      const updatedEmployeesData = json.map((emp) => ({
        ...emp,
        EmployeeName: emp.Name, // Assuming the employee name is coming from the Name field in the response
        Pending: emp.Months.filter((month) => month.ApprovalStatus === "P")
          .length,
        Rejected: emp.Months.filter((month) => month.ApprovalStatus === "R")
          .length,
        Submitted: emp.Months.filter((month) => month.ApprovalStatus === "S")
          .length,
        Approved: emp.Months.filter((month) => month.ApprovalStatus === "A")
          .length,
      }));
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
      console.log(url, json);
      setData(json);
      setFilteredTimesheetData(json); // Set the initial filtered data

      if (json.length > 0) {
        const columns = columnDefinitions.map((col) => ({
          headerCheckboxSelection: col.headerCheckboxSelection,
          checkboxSelection: col.checkboxSelection,
          headerName: col.headerName,
          field: col.field,
          maxWidth: col.maxWidth,
          headerClass: "header-center",
          tooltipField: col.field, // Show tooltip
        }));
        setColumns(columns);
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  useEffect(() => {
    fetchData(
      "https://localhost:7078/api/AdminH1b",
      setH1bData,
      setH1bColumns,
      [
        {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          maxWidth: 50,
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
        { headerName: "Status", field: "status", maxWidth: 80 },
      ]
    );
    fetchData(
      "https://localhost:7078/api/AdminVacation",
      setVacationData,
      setVacationColumns,
      [
        {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          maxWidth: 50,
        },
        { headerName: "ID", field: "Id", maxWidth: 50 },
        // { headerName: "Auth ID", field: "AuthId", maxWidth: 100 },
        { headerName: "Email", field: "Email", maxWidth: 150 },
        { headerName: "Name", field: "Name", maxWidth: 150 },
        // { headerName: "Is Complete", field: "IsComplete", maxWidth: 100 },
        { headerName: "Body", field: "Body", maxWidth: 250 },
        // { headerName: "Secret", field: "Secret", maxWidth: 150 },
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
          field: "ApprovedStatus",
          maxWidth: 150,
        },
        //  { headerName: "Is Manager", field: "isManager", maxWidth: 100 },
        { headerName: "Image URL", field: "ImageUrl", maxWidth: 200 },
        //{ headerName: "Agree", field: "agree", maxWidth: 80 },
        // { headerName: "File Upload", field: "fileupload", maxWidth: 150 },
        { headerName: "End Hours", field: "Endhours", maxWidth: 100 },
        { headerName: "Start Hours", field: "Starthours", maxWidth: 120 },
      ]
    );
    fetchData(
      "https://localhost:7078/api/AdminEmpTimesheet",
      setTimesheetData,
      setTimesheetColumns,
      [
        { headerName: "Employee Name", field: "EmployeeName", maxWidth: 150 },
        { headerName: "Pending", field: "Pending", maxWidth: 100 },
        { headerName: "Rejected", field: "Rejected", maxWidth: 100 },
        { headerName: "Submitted", field: "Submitted", maxWidth: 100 },
        { headerName: "Approved", field: "Approved", maxWidth: 100 },
      ]
    );
    fetchEmployeesData();
  }, []);

  useEffect(() => {
    // Reset state when the tab changes
    setIsMonthSelected(false);
    setSelectedEmployee(null); // Clear the selected employee
    setFilteredTimesheetData([]); // Clear the timesheet data
    setTimesheetColumns([]); // Clear the columns
    setAvailableMonths([]); // Clear available months
    setChildGridData([]); // Clear child grid data
    setChildGridColumns([]); // Clear child grid columns
    setStatuses({
      pending: false,
      rejected: false,
      submitted: false,
      approved: false,
    });
    fetchData(
      "https://localhost:7078/api/AdminEmpTimesheet",
      setTimesheetData,
      setTimesheetColumns,
      ["EmployeeId", "action"] // Replace with the actual column names you want to exclude
    );
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleStatusChange = (status) => {
    setStatuses((prevStatuses) => {
      const updatedStatuses = {
        ...prevStatuses,
        [status]: !prevStatuses[status],
      };
      return updatedStatuses;
    });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedEmployeeData =
      selectedData.length > 0 ? selectedData[0] : selectedEmployee;

    if (selectedEmployeeData) {
      const employeeInfo = employeesData.find(
        (emp) => emp.EmployeeId === selectedEmployeeData.EmployeeId
      );

      if (employeeInfo) {
        setSelectedEmployee({
          ...selectedEmployeeData,
          EmployeeName: selectedEmployeeData.EmployeeName || "Unknown",
        });
        setAvailableMonths(employeeInfo.Months);
      } else {
        setSelectedEmployee(null);
        setAvailableMonths([]);
      }
    } else {
      setSelectedEmployee(null);
      setAvailableMonths([]);
    }
    console.log("Selected Info:", selectedNodes);
    console.log("Selected Employee:", selectedEmployeeData); // Log selected employee data
    console.log("Employee Info:", employeesData); // Log employees data for debugging
  };

  const onCellClicked = (params) => {
    if (params.colDef.field !== "Name") {
      const statusName = params.colDef.field;
      const statusKey = Object.keys(statusMapping).find(
        (key) => statusMapping[key] === statusName
      );

      if (statusKey) {
        // console.log(`${statusKey} - ${params.data.Name}`);
        fetchTimesheetDataByStatus(params.data.EmployeeId, statusKey);
      }
    }
  };

  const fetchTimesheetDataByStatus = async (employeeId, status) => {
    try {
      const response = await fetch(
        `https://localhost:7078/api/AdminTimeSheet/${employeeId}/status?status=${status}`,
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
        throw new Error("Network response was not ok");
      }
      const json = await response.json();
      console.log(`Timesheet Data for ${status}:`, json);
      processChildGridData(json);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const fetchTimesheetDataForMonth = async (year, month) => {
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0);
    const formattedEndDate = `${year}-${month
      .toString()
      .padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await fetch(
        `https://localhost:7078/api/AdminTimeSheet/${selectedEmployee.EmployeeId}/dateRange?startDate=${startDate}&endDate=${formattedEndDate}`,
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
        throw new Error("Network response was not ok");
      }
      const json = await response.json();
      console.log(`Timesheet Data for ${year}-${month}:`, json);
      transformTimesheetData(json, year, month, endDate.getDate());
      setIsMonthSelected(true);
      setSelectedMonth(monthNames[month - 1]);
      setSelectedYear(year);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const processChildGridData = (data) => {
    const transformedData = [];
    const columns = new Set();

    data.forEach(({ Year, Month, Timesheets }) => {
      const monthYear = `${monthNames[Month - 1]} ${Year}`;
      const daysInMonth = getDaysInMonth(Year, Month);

      const projectEntries = Timesheets.reduce(
        (acc, { ProjectId, WorkingDate, Hours }) => {
          const day = new Date(WorkingDate).getDate();
          if (!acc[ProjectId]) {
            acc[ProjectId] = { ProjectId, MonthYear: monthYear, days: {} };
          }
          acc[ProjectId].days[day] = Hours;
          return acc;
        },
        {}
      );

      Object.values(projectEntries).forEach((entry) => {
        const entryWithDays = {
          ...entry,
          MonthYear: monthYear,
          ProjectId: entry.ProjectId,
        };
        for (let day = 1; day <= daysInMonth; day++) {
          entryWithDays[day] = entry.days[day] || 0;
          columns.add(day);
        }
        delete entryWithDays.days;
        transformedData.push(entryWithDays);
      });
    });

    const sortedColumns = Array.from(columns).sort((a, b) => a - b);

    const columnDefs = [
      {
        headerName: "Month-Year",
        field: "MonthYear",
        headerClass: "header-center",
        pinned: "left",
        cellClass: "bold-cell",
        maxWidth: 150,
        cellRenderer: (params) => {
          const { value, data, node, api } = params;
          const rowIndex = node.rowIndex;
          if (
            rowIndex === 0 ||
            api.getDisplayedRowAtIndex(rowIndex - 1).data.MonthYear !== value
          ) {
            return value;
          } else {
            return "";
          }
        },
      },
      {
        headerName: "Project ID",
        field: "ProjectId",
        headerClass: "header-center",
        pinned: "left",
        maxWidth: 100,
      },
      ...sortedColumns.map((day) => ({
        headerName: day.toString(),
        field: day.toString(),
        headerClass: "header-center",
        maxWidth: 60,
      })),
    ];

    setChildGridData(transformedData);
    setChildGridColumns(columnDefs);
  };

  const renderAvailableMonths = () => {
    const activeStatuses = Object.keys(statuses).filter(
      (status) => statuses[status]
    );
    const filteredMonths =
      activeStatuses.length === 0
        ? availableMonths
        : availableMonths.filter((month) =>
            activeStatuses.includes(
              statusMapping[month.ApprovalStatus].toLowerCase()
            )
          );

    return filteredMonths.map((month) => (
      <Button
        key={`${month.Year}-${month.Month}`}
        variant="contained"
        className="month-button"
        onClick={() => fetchTimesheetDataForMonth(month.Year, month.Month)}
      >
        {month.Year}-{month.Month} ({statusMapping[month.ApprovalStatus]})
      </Button>
    ));
  };

  const renderEmployeeList = () => {
    const columnDefs = [
      {
        headerName: "Employee",
        field: "Name",
        headerClass: "header-center",
        minWidth: 100,
        maxWidth: 120,
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
        minWidth: 80,
        maxWidth: 90,
      },
      {
        headerName: "Rejected",
        field: "Rejected",
        headerClass: "header-center",
        minWidth: 80,
        maxWidth: 90,
      },
      {
        headerName: "Submitted",
        field: "Submitted",
        headerClass: "header-center",
        minWidth: 80,
        maxWidth: 100,
      },
      {
        headerName: "Approved",
        field: "Approved",
        headerClass: "header-center",
        minWidth: 80,
        maxWidth: 100,
      },
    ];

    return (
      <div className="employee-list-container">
        <div
          className="ag-theme-alpine employee-grid"
          style={{
            height: "60vh",
            overflowY: "auto",
            transition: "width 0.3s",
            width: "calc(35vw)", // Adjust the grid width as needed
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={employeesData}
            columnDefs={columnDefs}
            rowHeight={30}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            onCellClicked={onCellClicked}
            gridOptions={gridOptions} 
            defaultColDef={{
              sortable: true,
              resizable: true,
              headerComponentParams: {
                menuIcon: "fa-bars",
              },
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

  const renderChildGrid = () => {
    if (childGridData.length === 0) return null;

    return (
      <div className="child-grid-container" style={{ marginTop: "20px" }}>
        <div
          className="ag-theme-alpine child-grid"
          style={{
            height: "30vh",
            overflowY: "auto",
            width: "80vw",
          }}
        >
          <AgGridReact
            rowData={childGridData}
            columnDefs={childGridColumns}
            rowHeight={30}
            gridOptions={gridOptions} 
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
            {selectedEmployee && (
              <div className="filter-status" style={{ marginLeft: "1vw" }}>
                <FilterBox
                  statuses={statuses}
                  handleStatusChange={handleStatusChange}
                  handleSubmit={applyFilters}
                  style={{ width: "20vw" }}
                />
                <div className="available-months" style={{ width: "20vw" }}>
                  <h3>Available Months</h3>
                  <div className="months-container">
                    {renderAvailableMonths()}
                  </div>
                </div>
              </div>
            )}
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
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              rowHeight={30}
              rowSelection="multiple"
              gridOptions={gridOptions} 
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
      case "4":
        return { rowData: newRecruitsData, columnDefs: newRecruitsColumns };
      default:
        return { rowData: [], columnDefs: [] };
    }
  };

  const handleBackToUsersList = () => {
    setIsMonthSelected(false);
    setSelectedEmployee(null); // Clear the selected employee
    setSelectedMonth(null); // Clear the selected month
    setSelectedYear(null); // Clear the selected year
    setFilteredTimesheetData([]); // Clear the timesheet data
    setTimesheetColumns([]); // Clear the columns
    setChildGridData([]); // Clear the child grid data
    fetchData(
      "https://localhost:7078/api/AdminEmpTimesheet",
      setTimesheetData,
      setTimesheetColumns,
      ["EmployeeId", "Action"] // Replace with the actual column names you want to exclude
    );
  };

  return (
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
            <Tab label="New Hires" value="4" className="tab" />
          </TabList>
        </Box>
        <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
          <TabPanel
            className="tab-panel"
            value={value}
            style={{ padding: 0, margin: 0, width: "100%" }}
          >
            <div className="data-above-grid">
              {isMonthSelected && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBackToUsersList}
                  style={{ margin: "20px 0" }}
                >
                  Back to Employees List
                </Button>
              )}
              {value === "1" && selectedEmployee && isMonthSelected && (
                <div style={{ marginBottom: "10px" }}>
                  <h2>
                    Timesheet for {selectedEmployee.EmployeeName},{" "}
                    {selectedMonth}-{selectedYear}
                  </h2>
                </div>
              )}
            </div>
            {renderContent()}
          </TabPanel>
        </Box>
      </TabContext>
      <div className="button-below-grid">
        <Button className="button-approve">Approve</Button>
        <Button className="button-reject">Reject</Button>
      </div>
    </div>
  );
};

export default App;
