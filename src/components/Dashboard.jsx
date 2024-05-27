import React, { useState } from "react";
import InfoCard from "./InfoCard";
import TimesheetV2 from "./TimesheetV2";
import PrevRecords from "./PrevRecords";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";

const info = [
  { percentage: 50, label: "Approved" },
  { percentage: 40, label: "Pending" },
  { percentage: 10, label: "Rejected" },
  { Projects: ["PROOJ1", "PROOJ2", "PROOJ3"] },
];

export default function Dashboard() {
  console.log("Toggling previous records display");
  const [showPrevRecords, setShowPrevRecords] = useState(false);

  function togglePrevRecords() {
    setShowPrevRecords(!showPrevRecords);
  }

  return (
    <div className="dashboard-layout">
      <div className="infocard-flexbox">
        {info.map((relevantInfo, index) => (
          <InfoCard key={index} info={relevantInfo} />
        ))}
      </div>
      <div className="timesheet">
        <TimesheetV2 />
      </div>
      <div className="previous-records-flexBox">
        <Typography variant="p" gutterBottom>
          Previous Records
        </Typography>
        <Button onClick={togglePrevRecords}>
          {showPrevRecords ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </Button>
      </div>
      {showPrevRecords && <PrevRecords />}
    </div>
  );
}

{
  /* <div className="prev-records">
  <p>This section is now visible</p>
</div>; */
}
