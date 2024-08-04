

import React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

// Use the `styled` method to create a new styled component
const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    backgroundColor: "#f4f4f4", // Replace #yourColor with the hex color code
    text: "#bdbdbd",
  },
});

const CustomTextField = ({ label, name, value, onChange, ...restProps }) => {
  return (
    <StyledTextField
      fullWidth
      label={label}
      variant="outlined"
      name={name}
      value={value}
      onChange={onChange}
      {...restProps} // Spread any additional props passed to the component
    />
  );
};

export default CustomTextField;
