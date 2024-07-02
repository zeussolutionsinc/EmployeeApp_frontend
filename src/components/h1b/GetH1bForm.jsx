import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import FormLabel from "@mui/material/FormLabel";
import CustomTextField from "./CustomTextField";
// import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
 
const formFields = {
  passportNumber: "",
  registrationNumber: "",
  emailId: "",
};
 
const validationSchema = Yup.object({
  registrationNumber: Yup.string()
    .nullable()
    .test(
      'registration-number-condition',
      'Registration number must be exactly 5 characters or empty if passport number and email are provided',
      function (value) {
        if (!value) {
          const { passportNumber, emailId } = this.parent;
          return !!passportNumber && !!emailId;
        }
        return value.length === 5;
      }
    ),
 
  passportNumber: Yup.string()
    .when('registrationNumber', (registrationNumber, schema) =>
      registrationNumber ? schema : schema.required('Passport number is required if no registration number')
    ),
 
  emailId: Yup.string()
    .email("Invalid email format")
    .when('registrationNumber', (registrationNumber, schema) =>
      registrationNumber ? schema : schema.required('Email is required if no registration number')
    ),
});
 
 
// const validationSchema = Yup.object({
//   emailId: Yup.string()
//     .matches(/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, "Invalid email format")
//     .required("Email is required"),
 
//   passportNumber: Yup.string().required("Passport number is required"),
//   registrationNumber: Yup.string()
//     .required("Registration Number is required")
//     .min(5, "Must be exactly 5 digits")
//     .max(5, "Must be exactly 5 digits"),
// });
 
export default function GetH1bForm({ setFieldsDisabled, onDataRetrieved }) {
  const [formData, setFormData] = useState(formFields);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  });
  // let navigate = useNavigate();
 
  // Closing the snackbar to display the alert messages
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
 
  const showAlert = (message, severity) => {
    setAlertInfo({ severity, message });
    setOpen(true);
  };
 
  const handleNewUserClick = () => {
    setFieldsDisabled(false); // This will enable the fields
  };
 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  //   "https://localhost:7078/api/H1b"
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
 
    // First, attempt to validate the submission data
    try {
      await validationSchema.validate(formData, { abortEarly: false });
    } catch (error) {
      if (error.name === "ValidationError") {
        const formErrors = error.inner.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path]: curr.message,
          }),
          {}
        );
        setErrors(formErrors);
        showAlert("Please correct the errors before submitting.", "error");
        setLoading(false); // Stop loading immediately if validation fails
        return; // Prevent further execution
      }
      // If the error is not a validation error, rethrow it to be caught by the next catch block
      throw error;
    }
 
    // If validation succeeds, proceed with form submission
    try {
      const url = new URL("https://zeusemployeeportalbackend.azurewebsites.net/api/H1b");
      url.searchParams.append("passportNumber", formData.passportNumber);
      url.searchParams.append(
        "registrationNumber",
        formData.registrationNumber
      );
      url.searchParams.append("emailId", formData.emailId);
 
      console.log("Making request to:", url.toString());
 
      // Make the GET request with the constructed URL
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
 
      const data = await response.json();
      onDataRetrieved(data);
      // showAlert("Submission successful: " + data.message, "success");
    } catch (error) {
      console.error("Error during submission:", error);
      showAlert("Submission failed: " + error.message, "error");
    }
    finally {
      setLoading(false); // Ensure loading is stopped regardless of the outcome
    }
  };
 
  return (
    <>
      {loading && (
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          maxWidth: "100%",
          margin: "auto",
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <CustomTextField
                fullWidth
                label="Registration Number"
                variant="outlined"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
              {errors.registrationNumber && (
                <div className="errors">{errors.registrationNumber}</div>
              )}
            </Grid>
            <Grid item xs={4}>
              <CustomTextField
                fullWidth
                label="Passport Number"
                variant="outlined"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
              />
              {errors.passportNumber && (
                <div className="errors">{errors.passportNumber}</div>
              )}
            </Grid>
            <Grid item xs={4}>
              <CustomTextField
                email
                fullWidth
                label="Email Id"
                variant="outlined"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
              />
              {errors.emailId && <div className="errors">{errors.emailId}</div>}
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  margin: "2px",
                  backgroundColor: "#dc3333", // Sets the background color of the button
                  color: "white", // Sets the text color of the button
                  "&:hover": {
                    backgroundColor: "darken(#dc3333, 0.2)", // Darkens the background color on hover
                    color: "black", // Changes the text color on hover
                  },
                }}
              >
                Retrieve Data
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleNewUserClick}
                sx={{
                  margin: "2px",
                  backgroundColor: "#dc3333", // Sets the background color of the button
                  color: "white", // Sets the text color of the button
                  "&:hover": {
                    backgroundColor: "darken(#dc3333, 0.2)", // Darkens the background color on hover
                    color: "black", // Changes the text color on hover
                  },
                }}
              >
                New User
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
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
 