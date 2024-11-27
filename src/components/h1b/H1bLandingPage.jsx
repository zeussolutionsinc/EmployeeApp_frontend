import React, { useEffect, useState } from "react";
import SetH1bV3 from "./SetH1bV3";
import Sidebar from "../Sidebar";
import { useAuth0 } from "@auth0/auth0-react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function H1bLanding() {
  const [retrievedFormData, setRetrievedFormData] = useState(null);
  const { user } = useAuth0();
  const authId = user.sub.substring(6);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  });

  const showAlert = (message, severity) => {
    setAlertInfo({ severity, message });
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const enableNewRecordForm = () => {
    setRetrievedFormData({}); // Show an empty form for entering new record
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://zeusemployeeportalbackend.azurewebsites.net/api/H1b/authid/${authId}`;

        console.log("Making request to:", url.toString());

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (response.status === 204) {
          // Handle the case where no matching record is found
          showAlert("No matching record found. Please enter a new record.", "info");
          enableNewRecordForm(); // Show form for new record
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setRetrievedFormData(data); // Use the state setter correctly
        showAlert("Submission successful", "success");
      } catch (error) {
        console.error("Error during submission:", error);
        showAlert("Submission failed: " + error.message, "error");
      } finally {
        setLoading(false); // Ensure loading is stopped regardless of the outcome
      }
    };

    fetchData();
  }, [authId]);

  return (
    <>
      <Sidebar />
      {loading && (
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <CircularProgress />
        </Box>
      )}
      <div className="header-ribbon">
     
      </div>
      <div className="form-container">
        {/* <GetH1bForm setFieldsDisabled={setFieldsDisabled} onDataRetrieved={handleDataRetrieved} /> */}
        <SetH1bV3 retrievedFormData={retrievedFormData} />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={10000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={alertInfo.severity}
          sx={{ width: "100%" }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
}
