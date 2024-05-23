import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import ZeusLogo from "../assets/ZeusLogo.png";
import GetH1bForm from "../componenets/forms/GetH1bForm";
import SetH1bV3 from "../componenets/forms/SetH1bV3";

export default function H1bLanding() {
  const [fieldsDisabled, setFieldsDisabled] = useState(true);
  const [retrievedFormData, setRetrievedFormData] = useState(null);

  const handleDataRetrieved = (retrievedData) => {
    setRetrievedFormData(retrievedData);
    setFieldsDisabled(false);
  };

  return (
    <>
      <div className="header-ribbon">
        <img className="logo" src={ZeusLogo} alt="Zeus Logo" />
        <Typography className="title" variant="h4" gutterBottom>
          H1B FORM
        </Typography>
      </div>
        <div className="form-container">
        <GetH1bForm setFieldsDisabled={setFieldsDisabled} onDataRetrieved={handleDataRetrieved} />
      
        <SetH1bV3 fieldsDisabled={fieldsDisabled} retrievedFormData={retrievedFormData} />
      </div>
    </>
  );
}
