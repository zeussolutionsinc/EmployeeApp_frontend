import Paper from "@mui/material/Paper";
import styled from "@mui/material/styles/styled";

// ... your other imports
export const radioStyles = {
  "& .MuiTypography-root": {
    color: "rgba(188,188,188,255)", // This is typically the default color for text
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Default Material-UI font
    fontSize: "1rem",
  },
  "& .MuiRadio-root": {
    color: "rgba(188,188,188,255)", // Customize as needed
    "&.Mui-checked": {
      color: "rgba(188,188,188,255)", // Customize as needed
    },
  },
};
export const StyledPaper = styled(Paper)({
  border: "1px solid rgba(0, 0, 0, 0.23)", // You can adjust the color and width of the border
  borderRadius: "4px", // Adjust to match your design
  padding: "5px", // Adjust the padding as needed

  backgroundColor: "#f4f4f4",
});

const datePickerStyles = {
  "& .MuiSvgIcon-root": {
    color: "blue", // This will target all SVG icons inside the component, including the calendar icon
  },
  // ... other styles you need
};
const color = "#FFC0CB";
