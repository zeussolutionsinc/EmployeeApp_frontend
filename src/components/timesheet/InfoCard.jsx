import React from "react";
import Typography from "@mui/material/Typography";

function InfoCard({ info }) {
  const getTextColor = (label) => {
    switch (label) {
      case "Approved":
        return "#57cc99";
      case "Pending":
        return "#ffbd00";
      case "Rejected":
        return "#ff0054";
      case "Submitted":
        return "#9f86c0";
      default:
        return "black";
    }
  };

  const TimesheetMapper = (timesheetfreq) => {
    if (timesheetfreq === "W") {
      return "Weekly";
    } else if (timesheetfreq === "M") {
      return "Monthly";
    } else if (timesheetfreq === "B") {
      return "Bi-Weekly";
    } else {
      return "Unknown Frequency"; // Handle unexpected values
    }
  };

  return (
    <div className="infocard">
      {info &&
        info.approvalstatus &&
        info.approvalstatus.map((status, index) => (
          <div key={index}>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              style={{ color: getTextColor(status.label) }}
            >
              {status.percentage}%
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              style={{ color: getTextColor(status.label) }}
            >
              {status.label}
            </Typography>
          </div>
        ))}
      <div>
        {info && info.timesheetFrequency && (
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: "18px",
              color: "#4361ee",
              textAlign: "start",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
          >
             {`Time Sheet Frequency : ${TimesheetMapper(info.timesheetFrequency)}`}
          </Typography>
        )}
      </div>
    </div>
  );
}

export default InfoCard;
