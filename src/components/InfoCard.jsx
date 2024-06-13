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
      <div className="project-list">
        {info && info.currentProjects && (
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: "17px", color: "#4361ee", textAlign: "start" }}
          >
            Current Projects:
          </Typography>
        )}
        {info &&
          info.currentProjects &&
          info.currentProjects.map((project, index) => (
            <Typography
              key={index}
              variant="body1"
              gutterBottom
              style={{
                textAlign: "start",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              {project}
            </Typography>
          ))}
      </div>
    </div>
  );
}

export default InfoCard;
