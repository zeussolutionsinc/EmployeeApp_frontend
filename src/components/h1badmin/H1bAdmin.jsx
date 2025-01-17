import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme CSS

export default function H1bAdmin() {
  const { user } = useAuth0();
  const authId = user.sub.substring(6); // Assuming 'sub' is available and correctly formatted
  const [rowData, setRowData] = useState([]);

  // Column definitions for ag-Grid
  const columnDefs = [
    { field: "passportNumber", headerName: "Passport Number", editable: true },
    { field: "firstName", headerName: "First Name", editable: true },
    { field: "lastName", headerName: "Last Name", editable: true },
    {
      field: "passportExpiryDate",
      headerName: "Passport Expiry Date",
      editable: true,
    },
    { field: "email", headerName: "Email", editable: true },
    { field: "contactNumber", headerName: "Contact Number", editable: true },
    { field: "degree", headerName: "Degree", editable: true },
    { field: "collegeCity", headerName: "College City", editable: true },
    { field: "collegeName", headerName: "College Name", editable: true },
    { field: "graduationYear", headerName: "Graduation Year", editable: true },
    { field: "opt", headerName: "OPT", editable: true },
    { field: "workedInUSA", headerName: "Worked in USA", editable: true },
    {
      field: "experienceYears",
      headerName: "Experience (Years)",
      editable: true,
    },
    { field: "employer", headerName: "Employer", editable: true },
    { field: "jobTitle", headerName: "Job Title", editable: true },
    {
      field: "technicalSkills",
      headerName: "Technical Skills",
      editable: true,
    },
    { field: "referralSource", headerName: "Referral Source", editable: true },
    { field: "registrationId", headerName: "Registration ID", editable: true },
    { field: "degreeMajor", headerName: "Degree Major", editable: true },
    { field: "linkedinUrl", headerName: "LinkedIn URL", editable: true },
    { field: "resume", headerName: "Resume", editable: true },
    { field: "approvalStatus", headerName: "Approval Status", editable: true },
    {
      headerName: "Actions",
      cellRendererFramework: (params) => (
        <>
          <button onClick={() => console.log("Edit Action for", params.value)}>
            Edit
          </button>
          <button onClick={() => console.log("Save Action for", params.value)}>
            Save
          </button>
        </>
      ),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      const url = `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/authid/${authId}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRowData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, [authId]);

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
        animateRows={true}
        singleClickEdit={true}
        stopEditingWhenGridLosesFocus={true}
      />
    </div>
  );
}
