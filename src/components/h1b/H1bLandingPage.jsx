import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import ZeusLogo from "../../zeus_logo.png";
import GetH1bForm from "./GetH1bForm";
import SetH1bV3 from "./SetH1bV3";
import Sidebar from "../Sidebar";

export default function H1bLanding() {
  const [fieldsDisabled, setFieldsDisabled] = useState(true);
  const [retrievedFormData, setRetrievedFormData] = useState(null);

  const handleDataRetrieved = (retrievedData) => {
    setRetrievedFormData(retrievedData);
    setFieldsDisabled(false);
  };

  return (
    <>
    <Sidebar/>
      <div className="header-ribbon">
        {/* <img className="logo" src={ZeusLogo} alt="Zeus Logo" /> */}
        {/* <Typography className="title" variant="h4" gutterBottom>
          H1B FORM
        </Typography> */}
      </div>
        <div className="form-container">
        <GetH1bForm setFieldsDisabled={setFieldsDisabled} onDataRetrieved={handleDataRetrieved} />
      
        <SetH1bV3 fieldsDisabled={fieldsDisabled} retrievedFormData={retrievedFormData} />
      </div>
    </>
  );
}
