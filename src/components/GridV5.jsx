import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import NewProjectPopUp from "./NewProjectPopUp";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { DateTime } from "luxon";
import { json } from "react-router-dom";

function getAllDatesOfMonth(date) {
  const year = date.year;
  const month = date.month;
  const daysInMonth = date.daysInMonth;
  const datesArray = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = DateTime.local(year, month, i).toISODate();
    // console.log(date.toISOString().split("T")[0]);
    datesArray.push({
      WorkingDate: date,
      Hours: 0, // Initialize hours as 0
      ApprovalStatus: "",
    });
  }
  return datesArray;
}

function formatSubmitDate(date) {
  const d = new Date(date);
  // Ensure the time is set to noon UTC to avoid issues with timezone offsets affecting the date
  d.setUTCHours(12, 0, 0, 0);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

function findUniqueProjectIds(data) {
  const uniqueProjectIds = new Set(); // A Set automatically keeps only unique values

  data.forEach((item) => {
    let projectId;
    if (item.projectId || item.ProjectId) {
      projectId = item.projectId || item.ProjectId;
      uniqueProjectIds.add(projectId);
    }
  });
  console.log(
    "Unique Project IDs from findUniqueProjectIds:",
    Array.from(uniqueProjectIds)
  );
  return Array.from(uniqueProjectIds); // Convert the Set back to an Array
}

// Function to format dates for display (excludes the year)
function formatDisplayDate(date) {
  const d = new Date(date);

  d.setDate(d.getDate() + 1); // Increment the date by 1 to get the correct date (since the date is in UTC, it may be off by 1 day depending on the timezone offset

  const month = d.getMonth() + 1; // getMonth() returns 0-based month, so add 1
  const day = d.getDate();
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addNewProject(newProject) {
  const monthDates = getAllDatesOfMonth(DateTime.now()); // Get the dates for the current month
  const newProjectDates = monthDates.map((date) => ({
    ...date,
    ProjectId: newProject,
  }));
  const finalProjectStructure = {
    projectId: newProject,
    dates: newProjectDates,
  };
  return finalProjectStructure; // Now returning the new project dates
}

function createProjectDateStructures(data, date) {
  console.log("Data:", data);
  const uniqueProjectIds = findUniqueProjectIds(data);
  console.log(
    "Unique Project IDs from createProjectDateStructures:",
    uniqueProjectIds
  );
  const monthDates = getAllDatesOfMonth(date);

  const result = uniqueProjectIds.map((projectId) => ({
    projectId: projectId,
    dates: monthDates,
  }));
  console.log("Result:", result);
  return result;
}

function calculateTotals(tableData) {
  const totals = {};
  tableData.forEach((project) => {
    project.dates.forEach((date) => {
      if (totals[date.WorkingDate]) {
        totals[date.WorkingDate] += date.Hours;
      } else {
        totals[date.WorkingDate] = date.Hours;
      }
    });
  });
  return totals;
}

function integrateProjectData(projectStructures, projectData) {
  projectData.forEach((data) => {
    const project = projectStructures.find(
      (p) => p.projectId === data.ProjectId
    );
    if (project) {
      const dateEntry = project.dates.find(
        (date) => date.WorkingDate === data.WorkingDate
      );
      if (dateEntry) {
        dateEntry.Hours = data.Hours;
      }
    }
  });
  return projectStructures;
}

function GridV5({ setPostData, postData, tableData, setTableData }) {
  const [newProject, setNewProject] = useState();
  const [newProjectButton, setNewProjectButton] = useState(false);
  const [totals, setTotals] = useState({});
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    setTotals(calculateTotals(tableData));
  }, [tableData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://localhost:7078/api/CopyPreviousRecord?EmpId=${employeeId}`;
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
        console.log("Prev Record: ", json);
        handleCopyData(json);
      } catch (error) {
        setError("Error fetching data");
        console.log("Error fetching data", error);
      }
    };

    fetchData();
  }, [employeeId]);

  function handleChange(projectIndex, dateIndex, newValue) {
    // Create a new copy of tableData to maintain immutability
    const newData = [...tableData];

    // Access the specific project using projectIndex
    const projectToUpdate = { ...newData[projectIndex] };

    // Update the hours for the specific date within the project
    const datesUpdated = [...projectToUpdate.dates];
    datesUpdated[dateIndex] = { ...datesUpdated[dateIndex], Hours: newValue };

    // Put the updated dates array back into the specific project
    projectToUpdate.dates = datesUpdated;

    // Update the specific project in the newData array
    newData[projectIndex] = projectToUpdate;

    // Update the state with the new data
    setTableData(newData);
  }

  function handleDelete(projectIdx) {
    setTableData((prevData) => {
      const newData = prevData.filter((_, idx) => idx !== projectIdx);
      return newData;
    });
  }

  function handleSubmit() {
    const flattenedTableData = tableData.reduce(
      (acc, item) => acc.concat(item.dates),
      []
    );

    const postTableData = flattenedTableData.filter((entry) => entry.Hours > 0);

    setPostData((prevData) => {
      const newData = {
        ...prevData,
        ProjectDateHours: postTableData.map((entry) => ({
          ...entry,
          ApprovalStatus: "S",
          WorkingDate: formatSubmitDate(entry.WorkingDate), // Use submission format here
        })),
      };

      //  `https://localhost:7078/api/RecordRetrieve?RecordNumber=${recordSelected}`;

      const url = "https://localhost:7078/api/TimeSheet?draftOrSave=Save";
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(newData), // Use newData directly here
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Connection successful:", data);
          alert(JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Submission failed:", error);
        });

      return newData;
    });
  }

  function handleDraftSave() {
    console.log("Draft saved");
    const flattenedTableData = tableData.reduce(
      (acc, item) => acc.concat(item.dates),
      []
    );

    const postTableData = flattenedTableData.filter((entry) => entry.Hours > 0);

    setPostData((prevData) => {
      const newData = {
        ...prevData,
        ProjectDateHours: postTableData.map((entry) => ({
          ...entry,
          ApprovalStatus: "P",
          WorkingDate: formatSubmitDate(entry.WorkingDate), // Use submission format here
        })),
      };

      const url = "https://localhost:7078/api/TimeSheet?draftOrSave=Draft";
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(newData), // Use newData directly here
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Connection successful:", data);
          alert(JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Submission failed:", error);
        });

      return newData;
    });
  }

  function handleCopyData(data) {
    console.log("Copy Data:", data);
    let copyDate = data[0]?.WorkingDate;
    copyDate = DateTime.fromISO(copyDate);
    console.log("copyDate:", copyDate);
    console.log("copyDate.month:", copyDate.month);
    const month = copyDate.month;
    month > DateTime.now().month
      ? handleNextMonth(data)
      : handleCopySameMonth(data);
  }

  function handleNextMonth(data) {
    const newTableStructure = createProjectDateStructures(
      data,
      DateTime.now().plus({ months: 1 })
    );
    const newTableData = integrateProjectData(newTableStructure, data);
    setTableData(newTableData); // Update the table data to the new month
  }

  function handleCopySameMonth(data) {
    const newTableStructure = createProjectDateStructures(data, DateTime.now());
    const newTableData = integrateProjectData(newTableStructure, data);
    setTableData(newTableData);
  }

  // useEffect(() => {
  //   console.log("Post Data:", postData);
  // }, [postData]);

  // useEffect(() => {
  //   console.log("Table Data:", tableData);
  // }, [tableData]);

  useEffect(() => {
    function addNewRow() {
      const newRow = addNewProject(newProject);
      setTableData((prevData) => [...prevData, newRow]);
    }
    if (newProject) {
      addNewRow();
    }
  }, [newProject]);

  // RENDERING THE TABLE
  return (
    <TableContainer component={Paper}>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <NavigateBeforeIcon
          style={{ marginLeft: "auto" }}
          onClick={handlePrevMonth}
        />
        <NavigateNextIcon onClick={handleNextMonth} />
      </div> */}

      <Table aria-label="Project Timesheet Table">
        <TableHead>
          <TableRow>
            <TableCell>Project ID</TableCell>
            {tableData.length > 0 &&
              tableData[0].dates.map((dateObj, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{ paddingRight: "14px" }}
                >
                  {formatDisplayDate(dateObj.WorkingDate)}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((project, projIndex) => (
            <TableRow key={projIndex}>
              <TableCell>
                {project.projectId}{" "}
                <CloseIcon
                  fontSize="10px"
                  sx={{ color: "red" }}
                  onClick={() => handleDelete(projIndex)}
                />
              </TableCell>
              {project.dates.map((dateObj, dateIndex) => (
                <TableCell key={dateIndex} style={{ padding: "4px" }}>
                  {dateObj.ApprovalStatus === "A" ? (
                    <p
                      style={{
                        padding: "0 30px",
                        color: dateObj.Hours !== 0 ? "#ff006e" : "inherit",
                      }}
                    >
                      {dateObj.Hours}
                    </p>
                  ) : (
                    <TextField
                      sx={{
                        padding: "0 20px",
                        textAlign: "start",
                        margin: "2px",
                      }}
                      type="number"
                      value={dateObj.Hours}
                      onChange={(e) =>
                        handleChange(
                          projIndex,
                          dateIndex,
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      fullWidth
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Total Hours</TableCell>
            {tableData.length > 0 &&
              tableData[0].dates.map((dateObj, index) => (
                <TableCell
                  key={index}
                  style={{
                    fontWeight: "bold",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {totals[dateObj.WorkingDate] || 0}
                </TableCell>
              ))}
          </TableRow>
          <TableRow>
            <Button
              variant="outlined"
              onClick={() => setNewProjectButton(true)}
              sx={{
                whiteSpace: "nowrap",
                minWidth: "max-content",
                marginTop: "15px",
                marginLeft: "10px",
              }}
            >
              Add Project
            </Button>
            {newProjectButton && (
              <NewProjectPopUp
                setNewProject={setNewProject}
                setNewProjectButton={setNewProjectButton}
              />
            )}
          </TableRow>
        </TableBody>
      </Table>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px" }}
      >
        <Button variant="contained" onClick={handleSubmit}>
          SUBMIT
        </Button>
        <Button
          variant="outlined"
          sx={{ marginLeft: "20px" }}
          onClick={handleDraftSave}
        >
          SAVE DRAFT
        </Button>
        <Button
          variant="text"
          sx={{ marginLeft: "20px", alignSelf: "flex-end" }}
          onClick={() => setEmployeeId(postData.EmployeeId)}
        >
          COPY PREV RECORD
        </Button>
      </div>
    </TableContainer>
  );
}

export default GridV5;
