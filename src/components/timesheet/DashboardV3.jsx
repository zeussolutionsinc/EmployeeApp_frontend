import React, { useState, useEffect, useMemo } from "react";
import InfoCard from "./InfoCard";
import PrevRecords from "./PrevRecords";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";
import GridV5 from "./GridV5";
import { DateTime } from "luxon";
import Sidebar from "../Sidebar";
import { useAuth0 } from "@auth0/auth0-react";

function getDate() {
  const today = DateTime.now(); // Get the current date and time
  const year = today.year;
  const month = today.month.toString().padStart(2, "0"); // Zero-padded month
  const day = today.day.toString().padStart(2, "0"); // Zero-padded day
  return `${year}-${month}-${day}`;
}

function getAllDatesOfCurrentMonth() {
  const currentDate = DateTime.now();
  const year = currentDate.year;
  const month = currentDate.month;
  // Getting the number of days in the month
  const daysInMonth = currentDate.daysInMonth;
  const datesArray = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = DateTime.local(year, month, i).toISODate();
    datesArray.push({
      WorkingDate: date,
      Hours: 0, // Initialize hours as 0
      ApprovalStatus: "",
    });
  }
  return datesArray;
}

function getAllDatesOfMonth(data) {
  if (!data || data.length === 0) return [];

  const dateStr = data[0].WorkingDate;
  if (isNaN(Date.parse(dateStr))) {
    console.error("Invalid date format:", dateStr);
    return [];
  }

  console.log("DateStr:", dateStr);
  const displayDate = DateTime.fromISO(dateStr); // Parse the date from the input object
  const year = displayDate.year;
  const month = displayDate.month; // getMonth() returns a 0-based month index

  console.log("Year:", year, "Month:", month);

  const daysInMonth = displayDate.daysInMonth; // Get the number of days in the month

  const datesArray = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = DateTime.local(year, month, i).toISODate(); // Correctly handle month indexing
    datesArray.push({
      WorkingDate: date,
      Hours: 0,
      ApprovalStatus: "",
    });
  }
  return datesArray;
}

function findUniqueProjectIds(data) {
  const uniqueProjectIds = new Set(); // A Set automatically keeps only unique values
  data.forEach((item) => {
    if (item.ProjectId) {
      uniqueProjectIds.add(item.ProjectId);
    }
  });
  return Array.from(uniqueProjectIds); // Convert the Set back to an Array
}

function createProjectDateStructures(data) {
  const uniqueProjectIds = findUniqueProjectIds(data);
  const monthDates = getAllDatesOfCurrentMonth();

  return uniqueProjectIds.map((projectId) => ({
    projectId: projectId,
    dates: monthDates.map((date) => {
      // Find the corresponding entry in the data for the current projectId and date
      const entry = data.find(
        (d) => d.ProjectId === projectId && d.WorkingDate === date.WorkingDate
      );

      return {
        ...date,
        ProjectId: projectId,
        ApprovalStatus: entry ? entry.ApprovalStatus : date.ApprovalStatus,
      };
    }),
  }));
}

function createDisplayProjectDateStructures(data) {
  const uniqueProjectIds = findUniqueProjectIds(data);
  const monthDates = getAllDatesOfMonth(data);

  return uniqueProjectIds.map((projectId) => ({
    projectId: projectId,
    dates: monthDates.map((date) => {
      // Find the corresponding entry in the data for the current projectId and date
      const entry = data.find(
        (d) => d.ProjectId === projectId && d.WorkingDate === date.WorkingDate
      );
      return {
        ...date,
        ProjectId: projectId,
        ApprovalStatus: entry ? entry.ApprovalStatus : date.ApprovalStatus,
      };
    }),
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

export default function DashboardV3() {
  const [showPrevRecords, setShowPrevRecords] = useState(false);
  const [recordSelected, setRecordSelected] = useState("");
  const [stats, setStats] = useState(null);
  // const [readOnly, setReadOnly] = useState(true);

  const [tableData, setTableData] = useState([]);
  const [ProjectDateHours, setProjectDateHours] = useState([]);
  const [displayProjectDateHours, setDisplayProjectDateHours] = useState([]);
  // const [fetchedData, setFetchedData] = useState(false);
  const {user} = useAuth0();
  const authId = user.sub.substring(6);
  // console.log("authid_dashboard", authId );
  const [postData, setPostData] = useState({
    EmployeeId: "",
    Approver: "",
    ProjectDateHours: [],
    ApprovalStatus: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/api/TimeSheet/authid/${authId}`;
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

        if (json && json.EmployeeId) {
          setPostData((prevData) => ({
            ...prevData,
            EmployeeId: json.EmployeeId,
            Approver: json.Approver,
            ProjectDateHours: json.ProjectDateHours,
            SubmissionDate: getDate(),
          }));
          setProjectDateHours(json.ProjectDateHours);
        } else {
          throw new Error("Fetched data is not in the expected format");
        }
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    fetchData();

    // Optional: Uncomment the following lines if you want to re-fetch data periodically
    // const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds
    // return () => clearInterval(interval); // Clean up the interval on component unmount

  }, [authId]);

  const fetchData = async () => {
    try {
      if (user) {
        const authId = user.sub.substring(6);
        const url = `/api/TimeSheetStatsDashboard/authid/${authId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const json = await response.json();
        setStats(json);
      }
    } catch (error) {
      console.error("Fetch operation error:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchData();
  }, [user]);

  // Set up interval to fetch data every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000); // 30 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [user]);


  useEffect(() => {
    function fetchData() {
      const fetchedProjectDateHours = ProjectDateHours;
      let initialTableData = createProjectDateStructures(
        fetchedProjectDateHours
      );
      initialTableData = integrateProjectData(
        initialTableData,
        fetchedProjectDateHours
      );
      setTableData(initialTableData);
      // fetchedData ? setReadOnly(false) : setReadOnly(true);
    }

    fetchData();
  }, [ProjectDateHours]);

  useEffect(() => {
    function fetchData() {
      const fetchedProjectDateHours = displayProjectDateHours;
      let displayTableData = createDisplayProjectDateStructures(
        fetchedProjectDateHours
      );
      displayTableData = integrateProjectData(
        displayTableData,
        fetchedProjectDateHours
      );
      setTableData(displayTableData);
      // fetchedData ? setReadOnly(false) : setReadOnly(true);
      console.log("displayTableData", displayTableData);
    }

    fetchData();
  }, [displayProjectDateHours]);

  useEffect(() => {
    if (recordSelected) {
      const fetchData = async () => {
        try {
          const url = `/api/RecordRetrieve?RecordNumber=${recordSelected}`;
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
          console.log("Record Selected: ", json);
          setDisplayProjectDateHours(json);
          // setFetchedData(false);
        } catch (error) {
          // setError(
          //   "There was a problem with your fetch operation: " + error.message
          // );
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        }
      };

      fetchData();
    }
  }, [recordSelected]);

  const info = useMemo(
    () =>
      stats
        ? {
            approvalStatus: [
              stats.ApprovedRecords === 0
                ? { percentage: 0, label: "Approved" }
                : {
                    percentage: parseFloat(
                      (
                        (stats.ApprovedRecords / stats.TotalRecords) *
                        100
                      ).toFixed(0)
                    ),
                    label: "Approved",
                  },
              stats.PendingRecords === 0
                ? { percentage: 0, label: "Pending" }
                : {
                    percentage: parseFloat(
                      (
                        (stats.PendingRecords / stats.TotalRecords) *
                        100
                      ).toFixed(0)
                    ),
                    label: "Pending",
                  },
              stats.RejectedRecords === 0
                ? { percentage: 0, label: "Rejected" }
                : {
                    percentage: parseFloat(
                      (
                        (stats.RejectedRecords / stats.TotalRecords) *
                        100
                      ).toFixed(0)
                    ),
                    label: "Rejected",
                  },
              stats.SubmittedRecords === 0
                ? { percentage: 0, label: "Submitted" }
                : {
                    percentage: parseFloat(
                      (
                        (stats.SubmittedRecords / stats.TotalRecords) *
                        100
                      ).toFixed(0)
                    ),
                    label: "Submitted",
                  },
            ],
            timesheetFrequency: stats.TimeSheetFreq || 'Unknown',
          }
        : { approvalStatus: [], timesheetFrequency: 'Unknown' },
    [stats]
  );
  

  function togglePrevRecords() {
    setShowPrevRecords(!showPrevRecords);
  }

  return (
    <div className="timesheet-page" > <Sidebar/>
      <div className="dashboard-layout">
      <h2 className="text-2xl">Status Counter</h2>
        <div className="infocard-flexbox mb-5 border-3 border-gray-900">
          {info.approvalStatus.map((infoItem, index) => (
            <InfoCard key={index} info={{ approvalstatus: [infoItem] }} />
          ))}
          <InfoCard info={{ timesheetFrequency: info.timesheetFrequency }} />
        </div>
        <h2 className="text-2xl mb-3">Time Sheet</h2>
        <div className="timesheet">
          <GridV5
            setPostData={setPostData}
            postData={postData}
            setTableData={setTableData}
            tableData={tableData}
            // readOnly={readOnly}
          />
        </div>
        <h2 className="text-2xl mt-5">Previous TimeCards</h2>
        <div className="previous-records-flexBox">
          <Typography variant="body1" gutterBottom>
            Previous TimeCards
          </Typography>
          <Button onClick={togglePrevRecords} sx={{color: '#dc3333'}}>
            {showPrevRecords ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </Button>
        </div>
        {showPrevRecords && (
          <PrevRecords setRecordSelected={setRecordSelected} />
        )}
      </div>
    </div>
  );
}
