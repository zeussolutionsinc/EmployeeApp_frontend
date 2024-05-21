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

function getAllDatesOfCurrentMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const datesArray = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    datesArray.push({
      WorkingDate: date.toISOString().split("T")[0],
      Hours: 0, // Initialize hours as 0
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

// Function to format dates for display (excludes the year)
function formatDisplayDate(date) {
  const d = new Date(date);
  const month = d.getMonth();
  const day = d.getDate();
  return `${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

function findUniqueProjectIds(data) {
  const uniqueProjectIds = new Set(); // A Set automatically keeps only unique values
  data.forEach((item) => {
    if (item.ProjectId) {
      uniqueProjectIds.add(item.ProjectId);
    }
  });
  // Log the unique project IDs
  // console.log("Unique project IDs:", uniqueProjectIds);
  return Array.from(uniqueProjectIds); // Convert the Set back to an Array
}

function createProjectDateStructures(data) {
  const uniqueProjectIds = findUniqueProjectIds(data);
  const monthDates = getAllDatesOfCurrentMonth();
  return uniqueProjectIds.map((projectId) => ({
    projectId: projectId,
    dates: monthDates.map((date) => ({
      ...date,
      ProjectId: projectId,
    })),
  }));
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

function GridV2({ setPostData, ProjectDateHours, postData }) {
  // console.log("Reached here inside Grid!");
  const [tableData, setTableData] = useState([]);

  // console.log("ProjectDateHours 1", ProjectDateHours);

  useEffect(() => {
    function fetchData() {
      // console.log("Project Date Hours:", ProjectDateHours);
      const fetchedProjectDateHours = ProjectDateHours;
      // console.log("Fetched Project Date Hours:", fetchedProjectDateHours);
      let initialTableData = createProjectDateStructures(
        fetchedProjectDateHours
      );
      console.log("Initial Table Data:", initialTableData);
      initialTableData = integrateProjectData(
        initialTableData,
        fetchedProjectDateHours
      );
      console.log("Integrated Table Data:", initialTableData);
      setTableData(initialTableData);
    }

    fetchData();
  }, [ProjectDateHours]);

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

  function handleSubmit() {
    console.log("Before updating postData:", postData);

    console.log("Table Data:", tableData);

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
          WorkingDate: formatSubmitDate(entry.WorkingDate), // Use submission format here
        })),
      };

      const url = "https://localhost:7078/api/TimeSheet";
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

  useEffect(() => {
    console.log("postData has been updated:", postData); // This logs after the state update
  }, [postData]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Project Timesheet Table">
        <TableHead>
          <TableRow>
            <TableCell>Project ID</TableCell>
            {tableData.length > 0 &&
              tableData[0].dates.map((dateObj, index) => (
                <TableCell key={index}>
                  {formatDisplayDate(dateObj.WorkingDate)}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((project, projIndex) => (
            <TableRow key={projIndex}>
              <TableCell>{project.projectId}</TableCell>
              {project.dates.map((dateObj, dateIndex) => (
                <TableCell key={dateIndex}>
                  <TextField
                    sx={{ padding: "0 20px", textAlign: "start" }}
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
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" onClick={handleSubmit}>
        SUBMIT
      </Button>
    </TableContainer>
  );
}

export default GridV2;
