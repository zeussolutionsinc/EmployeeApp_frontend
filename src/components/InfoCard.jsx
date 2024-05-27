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
      default:
        return "black";
    }
  };

  return (
    <div className="infocard">
      {info.percentage && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            style={{ color: getTextColor(info.label) }}
          >
            {info.percentage}%
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            style={{ color: getTextColor(info.label) }}
          >
            {info.label}
          </Typography>
        </>
      )}
      <div className="project-list">
        {info.Projects && (
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: "17px", color: "#4361ee", textAlign: "start" }}
          >
            Current Projects:
          </Typography>
        )}
        {info.Projects &&
          info.Projects.map((project, index) => (
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
