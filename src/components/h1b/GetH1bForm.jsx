import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CustomTextField from "./CustomTextField";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

const formFields = {
  passportNumber: "",
  firstName: "",
};

const validationSchema = Yup.object({
  passportNumber: Yup.string().required("Passport number is required."),
  firstName: Yup.string().required("First name is required."),
});

export default function GetH1bForm({ setFieldsDisabled, onDataRetrieved }) {
  const [formData, setFormData] = useState(formFields);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  });

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

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
        setLoading(false);
        return;
      }
      throw error;
    }

    try {
      const url = new URL(
        `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/passport/${formData.passportNumber}/firstName/${formData.firstName}`
      );
      url.searchParams.append("passportNumber", formData.passportNumber);
      url.searchParams.append("firstName", formData.firstName);

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
    } catch (error) {
      console.error("Error during submission:", error);
      showAlert("Submission failed: " + error.message, "error");
    } finally {
      setLoading(false);
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label="First Name"
                variant="outlined"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <div className="errors">{errors.firstName}</div>
              )}
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
