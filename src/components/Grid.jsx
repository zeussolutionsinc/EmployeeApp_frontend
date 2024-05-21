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
    const formattedDate = {
      WorkingDate: date.toISOString().split("T")[0],
      Hours: 0,
      ProjectId: "",
    };
    datesArray.push(formattedDate);
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

function Grid({ setPostData, ProjectDateHours, postData }) {
  // console.log("Reached here inside Grid!");
  const [tableData, setTableData] = useState(getAllDatesOfCurrentMonth);

  useEffect(() => {
    const uniqueprojects = findUniqueProjectIds(ProjectDateHours);
    // console.log("uniqueprojects", uniqueprojects);
    const updatedTableData = tableData.map((date) => {
      // console.log("date", date);
      const found = ProjectDateHours.find((d) => {
        // console.log("date", d);
        return d.WorkingDate === date.WorkingDate;
      });
      if (found) {
        // Update both hours and projectId if the date is found
        return {
          ...date,
          Hours: found.Hours,
          ProjectId: uniqueprojects[0],
        };
      } else {
        // Retain existing date attributes, but ensure no projectId if not found
        return {
          ...date,
          Hours: date.Hours, // or simply keep existing hours if you don't want to reset
          ProjectId: uniqueprojects[0], // Ensuring projectId is cleared if not found
        };
      }
    });
    setTableData(updatedTableData);
  }, [ProjectDateHours, tableData]); // Table data included to allow for updates from within component

  function handleChange(index, newValue) {
    // Create a new copy of tableData
    const newData = [...tableData];
    // Update hours for the specific entry
    newData[index].Hours = parseInt(newValue, 10);
    // Update the state with the new data
    setTableData(newData);
  }

  // function handleSubmit() {
  //   setPostData((prevData) => ({
  //     ...prevData,
  //     ProjectDateHours: tableData,
  //   }));
  // }

  function handleSubmit() {
    console.log("Before updating postData:", postData);

    setPostData((prevData) => {
      const newData = {
        ...prevData,
        ProjectDateHours: tableData.map((entry) => ({
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

  // Place this useEffect anywhere inside your component, but outside of any function definition
  useEffect(() => {
    // console.log("postData has been updated:", postData); // This logs after the state update
  }, [postData]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="Month-oriented Table">
          <TableHead>
            <TableRow>
              <TableCell>Project ID</TableCell>
              {tableData.map((dateObj, index) => (
                <TableCell key={index}>
                  {formatDisplayDate(dateObj.WorkingDate)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{tableData[0].ProjectId}</TableCell>
              {tableData.map((dateObj, dateIndex) => (
                <TableCell key={dateIndex}>
                  <TextField
                    sx={{ padding: "0 10px" }}
                    inputMode="numeric"
                    value={dateObj.Hours}
                    onChange={(e) =>
                      handleChange(dateIndex, parseInt(e.target.value, 10) || 0)
                    }
                    margin="normal"
                    fullWidth
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleSubmit}>
        SUBMIT
      </Button>
    </>
  );
}

export default Grid;
