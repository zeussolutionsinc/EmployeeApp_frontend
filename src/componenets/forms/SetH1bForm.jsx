import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import { MuiTelInput } from "mui-tel-input";
import Box from "@mui/material/Box";
import {StyledPaper} from "./formHelperFunctions/styling"
import { allFormFields } from "./formHelperFunctions/allFormFields";
import CustomTextField from "./CustomTextField";
import CustomRadioGroup from "./CustomRadioButton";
import { validationSchema } from "./formHelperFunctions/validationSchema";

export default function SetH1bForm() {
  const [formData, setFormData] = useState(allFormFields);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    // Assuming you want to handle a single file
    const file = e.target.files[0];
    if (file) {
      // Do something with the file, like updating the state or directly handling the upload
      console.log(file);
      // For example, setting it in state:
      setFormData({ ...formData, resume: file });
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
      // case "highestEducation":
      //   convertedValue = value === "Other" ?   formData.highestEducationOther   : value
      //   break;
      default:
        convertedValue = value;
    }

    // console.log("Converted value:", typeof convertedValue);

    setFormData({
      ...formData,
      [name]: convertedValue,
    });
  };

  const handlePhoneChange = (value, country) => {
    setFormData({
      ...formData,
      contactNumber: value,
      countryCode: country, // Optionally, if you want to update the country code as well
    });
  };

  // const handleSubmit = async (e) => {

  //   e.preventDefault();

  //   const submissionData = {
  //     ...formData,
  //     onOPT: formData.onOPT === "Yes",
  //     workedInUS: formData.workedInUS === "Yes",
  //     passportExpiryDate: (() => {
  //       const date = new Date(formData.passportExpiryDate);
  //       return date.toISOString().split("T")[0]; // Converts to "YYYY-MM-DD"
  //     })(),
  //     highestEducation:
  //       formData.highestEducation === "Other"
  //         ? formData.highestEducationOther
  //         : formData.highestEducation,
  //   };

  //   try {
  //     // Validate formData against a validationSchema
  //     await validationSchema.validate(formData, { abortEarly: false });
  //     // If validation passes, submit the form data
  //     console.log(submissionData)
  //     const response = await fetch("https://localhost:7078/api/H1b", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(submissionData),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.json();
  //     console.log("Connection successful:", data);
  //     alert(JSON.stringify(data));

  //     console.log("Submission successful", data);
  //     // Optionally, redirect the user or clear the form here
  //   } catch (error) {
  //     console.error("Error submitting form", error);
  //     if (error.inner) {
  //       // Handle validation errors
  //       const newErrors = {};
  //       error.inner.forEach((err) => {
  //         newErrors[err.path] = err.message;
  //       });
  //       setErrors(newErrors);
  //     } else {
  //        console.log(error);

  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const submissionData = {
    ...formData,
    onOPT: formData.onOPT === "Yes",
    workedInUS: formData.workedInUS === "Yes",
    passportExpiryDate: (() => {
      const date = new Date(formData.passportExpiryDate);
      return date.toISOString().split("T")[0]; // Converts to "YYYY-MM-DD"
    })(),
    highestEducation:
      formData.highestEducation === "Other"
        ? formData.highestEducationOther
        : formData.highestEducation,
  };

  try {
    // Validate formData against a validationSchema
    await validationSchema.validate(formData, { abortEarly: false });
    // If validation passes, submit the form data
    console.log(submissionData)
    fetch("https://localhost:7078/api/H1b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse JSON response into native JavaScript objects
    })
    .then(data => {
      console.log("Connection successful:", data);
      alert(JSON.stringify(data));
      console.log("Submission successful", data);
      // Optionally, redirect the user or clear the form here
    })
    .catch(error => {
      console.error("Error submitting form", error);
      alert("Submission failed: " + error.message);
    });
  } catch (error) {
    console.error("Error validating form", error);
    if (error.inner) {
      // Handle validation errors
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    } else {
      console.log(error);
      alert("Validation failed: " + error.message);
    }
  }
};


  const testConnection = () => {
    fetch("https://localhost:7078/api/H1b", {
      // Replace '/api/ping' with your actual health-check endpoint
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Connection successful:", data);
        alert("Connection successful: " + JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Connection failed", error);
        alert("Connection failed: " + error.message);
      });
  };

  return (
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
              sx={{
                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                  color: "#FFC0CB",
                },
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
              type="button"
              onClick={testConnection}
              variant="outlined"
              sx={{
                marginRight: 2,
                backgroundColor: "#cccccc",
                "&:hover": {
                  backgroundColor: "darken(#cccccc, 0.2)",
                },
              }}
            >
              Test Connection
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#dc3333", // This sets the background color of the button
                "&:hover": {
                  backgroundColor: "darken(#dc3333, 0.2)", // This sets the color on hover, darken the color a bit
                },
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
