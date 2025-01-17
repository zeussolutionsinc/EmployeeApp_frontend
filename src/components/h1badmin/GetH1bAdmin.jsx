import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { MuiTelInput } from "mui-tel-input";
import Box from "@mui/material/Box";
import { allFormFields } from "../h1b/formHelperFunctions/allFormFields";
import CustomTextField from "../h1b/CustomTextField";
import CustomRadioGroup from "../h1b/CustomRadioButton";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function GetH1bAdmin() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(allFormFields);
  const [errors, setErrors] = useState({});
  const { user } = useAuth0();
  const authId = user.sub.substring(6);
  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const navigate = useNavigate();
  const [alertInfo, setAlertInfo] = useState({
    severity: "",
    message: "",
  });
  const [retrieveData, setRetrieveData] = useState({
    passportNumber: "",
    firstName: "",
  });
  const [names, setNames] = useState([{}]);
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

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await fetch(
          `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/authId/${authId}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setNames(data);
      } catch (error) {
        console.error("Error fetching names:", error);
        showAlert("Failed to fetch names", "error");
      }
    };
    fetchNames();
  }, []);

  const handleRetrieveChange = (event) => {
    const fullName = event.target.value;
    const selectedEntry = names.find(
      (name) => `${name.LegalFirstName} ${name.LegalLastName}` === fullName
    );
    setSelectedName(fullName);
    if (selectedEntry) {
      setRetrieveData({ passportNumber: selectedEntry.PassportNumber });
    } else {
      setRetrieveData({ passportNumber: "" });
    }
  };

  const navigateBack = () => {
    setFormData(allFormFields);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    let convertedValue;
    switch (name) {
      case "graduationYear":
        convertedValue = Number(value);
        break;
      case "yearsOfExperience":
        convertedValue = Number(value);
        break;
      default:
        convertedValue = value;
    }

    setFormData({
      ...formData,
      [name]: convertedValue,
    });
  };

  const handlePhoneChange = (value, country) => {
    setFormData({
      ...formData,
      contactNumber: value,
      countryCode: country,
    });
  };

  const handleRetrieveSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = new URL(
        `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/passport/${retrieveData.passportNumber}`
      );

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

  const onDataRetrieved = (data) => {
    console.log(data); // Or set state
    showAlert("Data retrieved successfully", "success");
    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      onOPT: formData.onOPT === "Yes",
      workedInUS: formData.workedInUS === "Yes",
      passportExpiryDate: (() => {
        try {
          if (!formData.passportExpiryDate) {
            throw new Error("Date is missing");
          }
          const date = new Date(formData.passportExpiryDate);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
          }
          return date.toISOString().split("T")[0];
        } catch (error) {
          console.error("Error parsing passport expiry date:", error.message);
          return null; // Or return a default value, if needed
        }
      })(),
      highestEducation:
        formData.highestEducation === "Other"
          ? formData.highestEducationOther
          : formData.highestEducation,
    };

    try {
      // If validation passes, clear any existing errors
      setErrors({});

      const url = `https://zeusemployeeportalbackend.azurewebsites.net/api/H1b/${formData.registrationId}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the text directly from the response
        throw new Error(errorText || "An unknown error occurred");
      }

      const data = await response.json();
      showAlert("Submission successful", "success");
      setFormData(allFormFields);
    } catch (validationError) {
      if (validationError.name === "ValidationError") {
        // Extract validation errors and map them to state
        const errorObject = validationError.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message; // Field name -> Error message
          return acc;
        }, {});
        setErrors(errorObject); // Set errors to state for display
      } else {
        console.error("Error submitting form", validationError);
        showAlert("Submission failed: Please login again");
      }
    }
  };

  return (
    <>
      {formData.registrationId ? (
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 4,
            maxWidth: 960,
            margin: "auto",
            paddingTop: 2,
            paddingBottom: 2,
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="Legal First Name (As mentioned in Passport)"
                  variant="outlined"
                  name="legalFirstName"
                  value={formData.legalFirstName}
                  onChange={handleChange}
                />
                {errors.legalFirstName && (
                  <div className="errors">{errors.legalFirstName}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="Legal Last Name (As mentioned in Passport)"
                  variant="outlined"
                  name="legalLastName"
                  value={formData.legalLastName}
                  onChange={handleChange}
                />
                {errors.legalLastName && (
                  <div className="errors">{errors.legalLastName}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="errors">{errors.email}</div>}
              </Grid>
              <Grid item xs={6}>
                <MuiTelInput
                  fullWidth
                  value={formData.contactNumber}
                  onChange={handlePhoneChange}
                  defaultCountry="US"
                />
                {errors.contactNumber && (
                  <div className="errors">{errors.contactNumber}</div>
                )}
              </Grid>
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
                  label="Passport Expiry Date"
                  variant="outlined"
                  name="passportExpiryDate"
                  type="date"
                  value={formData.passportExpiryDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {errors.passportExpiryDate && (
                  <div className="errors">{errors.passportExpiryDate}</div>
                )}
              </Grid>
              <Grid item xs={12}>
                <CustomRadioGroup
                  legend="Highest Level Of Education"
                  name="highestEducation"
                  value={formData.highestEducation}
                  options={[
                    { label: "Diploma", value: "Diploma" },
                    { label: "Bachelors", value: "Bachelors" },
                    { label: "Masters", value: "Masters" },
                    { label: "Doctorate", value: "Doctorate" },
                    { label: "Other", value: "Other" },
                  ]}
                  onChange={handleChange}
                />
                {formData.highestEducation === "Other" && (
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="Other Education"
                    variant="outlined"
                    name="highestEducationOther"
                    value={formData.highestEducationOther}
                    onChange={handleChange}
                  />
                )}
                {errors.highestEducation && (
                  <div className="errors">{errors.highestEducation}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="Degree Major (For Ex: BE Computer Science, BCA, MS, MCA, etc...)"
                  variant="outlined"
                  name="degreeMajor"
                  value={formData.degreeMajor}
                  onChange={handleChange}
                />
                {errors.degreeMajor && (
                  <div className="errors">{errors.degreeMajor}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="Year of Graduation"
                  variant="outlined"
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={handleChange}
                />
                {errors.graduationYear && (
                  <div className="errors">{errors.graduationYear}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="Highest Degree College/Institution Name"
                  variant="outlined"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                />
                {errors.institutionName && (
                  <div className="errors">{errors.institutionName}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="College / Institution City (For Ex: Hyderabad, Chennai, Bangalore, etc..)"
                  variant="outlined"
                  name="institutionCity"
                  value={formData.institutionCity}
                  onChange={handleChange}
                />
                {errors.institutionCity && (
                  <div className="errors">{errors.institutionCity}</div>
                )}
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  fullWidth
                  label="OPT"
                  variant="outlined"
                  name="onOPT"
                  value={formData.onOPT}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  fullWidth
                  label="Worked in USA"
                  variant="outlined"
                  name="workedInUSA"
                  value={formData.workedInUS}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  fullWidth
                  label="Resume"
                  variant="outlined"
                  name="resume"
                  type="text"
                  value={formData.resume}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  fullWidth
                  label="Years of Experience"
                  variant="outlined"
                  name="yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                />
                {errors.yearsOfExperience && (
                  <div className="errors">{errors.yearsOfExperience}</div>
                )}
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  fullWidth
                  label="Current Employer"
                  variant="outlined"
                  name="currentEmployer"
                  value={formData.currentEmployer}
                  onChange={handleChange}
                />
                {errors.currentEmployer && (
                  <div className="errors">{errors.currentEmployer}</div>
                )}
              </Grid>
              <Grid item xs={4}>
                <CustomTextField
                  fullWidth
                  label="Current Job Title"
                  variant="outlined"
                  name="currentJobTitle"
                  value={formData.currentJobTitle}
                  onChange={handleChange}
                />
                {errors.currentJobTitle && (
                  <div className="errors">{errors.currentJobTitle}</div>
                )}
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  label="Primary Technical Skills"
                  variant="outlined"
                  name="primaryTechnicalSkills"
                  value={formData.primaryTechnicalSkills}
                  onChange={handleChange}
                />
                {errors.primaryTechnicalSkills && (
                  <div className="errors">{errors.primaryTechnicalSkills}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="Referral Source"
                  variant="outlined"
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                />
                {errors.referralSource && (
                  <div className="errors">{errors.referralSource}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  fullWidth
                  label="LinkedIn Profile"
                  variant="outlined"
                  name="linkedInProfile"
                  value={formData.linkedInProfile}
                  onChange={handleChange}
                />
                {errors.linkedInProfile && (
                  <div className="errors">{errors.linkedInProfile}</div>
                )}
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#dc3333",
                    marginRight: "10px",
                    "&:hover": {
                      backgroundColor: "#a02727", // Darker red for hover effect
                    },
                  }}
                >
                  Submit
                </Button>
                <Button
                  type="submit"
                  onClick={navigateBack}
                  variant="contained"
                  sx={{
                    backgroundColor: "#dc3333",
                    "&:hover": {
                      backgroundColor: "#a02727", // Darker red for hover effect
                    },
                  }}
                >
                  Okay
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      ) : (
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 4,
            maxWidth: 960,
            margin: "auto",
            paddingTop: 2,
            paddingBottom: 2,
          }}
        >
          <form onSubmit={handleRetrieveSubmit} style={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="name-select-label">Name</InputLabel>
                  <Select
                    labelId="name-select-label"
                    id="name-select"
                    value={selectedName}
                    label="Name"
                    onChange={handleRetrieveChange}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {names.map((name, index) => (
                      <MenuItem
                        key={index}
                        value={`${name.LegalFirstName} ${name.LegalLastName}`}
                      >
                        {`${name.LegalFirstName} ${name.LegalLastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                      backgroundColor: "#a02727", // Darker red for hover effect
                    },
                  }}
                >
                  Retrieve
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}

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

export default GetH1bAdmin;
