import React from "react";
import { StyledPaper, radioStyles } from "./formHelperFunctions/styling";
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from "@mui/material";

const CustomRadioGroup = ({ legend, name, value, options, onChange }) => {
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">{legend}</FormLabel>
      <StyledPaper>
        <RadioGroup
          name={name}
          value={value}
          onChange={onChange}
          row
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {options.map((option, index, array) => (
            <React.Fragment key={option.value}>
              <FormControlLabel
                value={option.value}
                control={<Radio sx={radioStyles} />}
                label={option.label}
              />
              {index !== array.length - 1 && <Box sx={{ flex: 1 }} />}
            </React.Fragment>
          ))}
        </RadioGroup>
      </StyledPaper>
    </FormControl>
  );
};

export default CustomRadioGroup;
