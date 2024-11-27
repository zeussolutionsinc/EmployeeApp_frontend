

import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import { MuiTelInput } from "mui-tel-input";
import Box from "@mui/material/Box";
import { StyledPaper } from "./formHelperFunctions/styling";
import { allFormFields } from "./formHelperFunctions/allFormFields";
import CustomTextField from "./CustomTextField";
import CustomRadioGroup from "./CustomRadioButton";
import { validationSchema } from "./formHelperFunctions/validationSchema";
import { useLocation } from "react-router-dom";
import { BlobServiceClient } from "@azure/storage-blob";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useAuth0 } from "@auth0/auth0-react";
import { DateTime } from 'luxon';
export default function SetH1bV3({ retrievedFormData }) {
  const location = useLocation();
  const [formData, setFormData] = useState(allFormFields);
  const [errors, setErrors] = useState({});
  const { user } = useAuth0();
  const authId = user.sub.substring(6);
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    if (retrievedFormData) {
      setFormData(retrievedFormData);
    }
  }, [retrievedFormData]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Starting file upload process...", file);
      try {
        const sasToken = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-08-06T00:29:24Z&st=2024-08-04T16:29:24Z&spr=https&sig=WXSgqHqVv48zxci7%2F2Jr73NOpBHtKG%2FrV2%2BQYqNqZQQ%3D";
        const containerName = "h1b-resume";
        const storageAccountName = "h1bform";
        const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net?${sasToken}`);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(file.name);

        // Upload the file
        await blobClient.uploadData(file, {
          blobHTTPHeaders: { blobContentType: file.type },
        });

        // After successful upload, get the URL of the uploaded file
        const url = blobClient.url;
        console.log("File uploaded to:", url);

        // Update the formData state with the URL instead of the file object
        setFormData({
          ...formData,
          resume: url,
        });
        showAlert("File uploaded successfully", "success");
      } catch (error) {
        console.error("Upload failed:", error);
        showAlert("Failed to upload file! Check the console for details.", "error");
      }
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      onOPT: formData.onOPT === "Yes",
      workedInUS: formData.workedInUS === "Yes",
      passportExpiryDate: (() => {
        // const dateObject = DateTime.fromISO(formData.passportExpiryDate);


        const date = new Date(formData.passportExpiryDate);
        return date.toISOString().split("T")[0];
      })(),
      highestEducation: formData.highestEducation === "Other" ? formData.highestEducationOther : formData.highestEducation,
    };

    try {
      await validationSchema.validate(submissionData, { abortEarly: false });
      console.log("This is it: ", submissionData);
      const method = retrievedFormData?.registrationId ? "PUT" : "POST";
      const url = `https://zeusemployeeportalbackend.azurewebsites.net/api/H1b${retrievedFormData?.registrationId ? `/${retrievedFormData.registrationId}` : `/authid/${authId}`}`;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      showAlert("Submission successful", "success");
      setFormData(data);
    } catch (error) {
      console.error("Error submitting form", error);
      showAlert("Submission failed: " + error.message, "error");
    }
  };

  return (
    <>
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
              <CustomRadioGroup
                legend="Are you currently on OPT?"
                name="onOPT"
                value={formData.onOPT}
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
                onChange={handleChange}
              />
              {errors.onOPT && <div className="errors">{errors.onOPT}</div>}
            </Grid>
            <Grid item xs={4}>
              <CustomRadioGroup
                legend="Have you previously worked in the US?"
                name="workedInUS"
                value={formData.workedInUS}
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
                onChange={handleChange}
              />
              {errors.workedInUS && (
                <div className="errors">{errors.workedInUS}</div>
              )}
            </Grid>
            <Grid item xs={4}>
              <FormLabel>Upload Resume</FormLabel>
              <StyledPaper sx={{ padding: "15px" }}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </StyledPaper>
              {errors.resume && <div className="errors">{errors.resume}</div>}
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
                  "&:hover": {
                    backgroundColor: "#a02727", // Darker red for hover effect
                  },
                }}
              >
                Submit
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
