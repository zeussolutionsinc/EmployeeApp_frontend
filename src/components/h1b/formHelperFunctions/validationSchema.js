import * as Yup from "yup";

export const validationSchema = Yup.object({
    legalFirstName: Yup.string().required("First name is required"),

    legalLastName: Yup.string().required("Last name is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    contactNumber: Yup.string()
      .required("Contact number is required"),
      // .matches(/^\d{10}$/, "Phone number must be 10 digits"),

    degreeMajor: Yup.string().required("Degree Major is required"),

    graduationYear: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
      .required("Year of graduation is required")
      .integer("Year must be an integer")
      .min(1000, "Year must be 4 digits")
      .max(9999, "Year must be 4 digits"),

    institutionName: Yup.string().required("Institution name is required"),

    institutionCity: Yup.string().required("Institution city is required"),

    yearsOfExperience: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
      .required("Years of experience is required")
      .integer("Years of experience must be an integer")
      .min(1, "Years of experience must be 1 or 2 digits")
      .max(99, "Years of experience must be 1 or 2 digits"),

    currentEmployer: Yup.string().required("Current employer is required"),

    currentJobTitle: Yup.string().required("Current job title is required"),

    primaryTechnicalSkills: Yup.string().required(
      "Primary technical skills are required"
    ),

    referralSource: Yup.string().required("Referral source is required"),

    linkedInProfile: Yup.string()
      .required("LinkedIn profile is required")
      .url("Invalid URL"),

    passportExpiryDate: Yup.date() 
    .transform(value => (isNaN(value) ? undefined : value))
    .required("Passport expiry date is required"),

    // resume: Yup.mixed()
    //   .required("Resume is required")
    //   .test(
    //     "fileType",
    //     "Invalid file format",
    //     (value) =>
    //       (value && value.type === "application/pdf") ||
    //       value.type === "application/msword" ||
    //       value.type ===
    //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    //   ),
    passportNumber: Yup.string().required("Passport number is required"),
    highestEducation: Yup.string().required("Highest education is required"),
    onOPT: Yup.string().required("On OPT is required"),
    workedInUS: Yup.string().required("Worked in US is required"),
})