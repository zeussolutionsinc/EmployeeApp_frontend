import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Typography, Box, Button, Container, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Material-UI icon for the green checkmark

export const Thankyou = () => {
  const { logout } = useAuth0();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const buttonStyle = {
    fontSize: "16px",
    backgroundColor: isHovered ? "#fff" : "black", // Change color on hover
    color: isHovered ? "black" : "#fff",
    padding: "10px 20px",
    border: "1px solid black",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    marginTop: "20px",
    textAlign: "center",
    transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition
    fontWeight: "bold",
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          textAlign: "center",
          borderRadius: "15px",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Green Check Icon */}
          <CheckCircleIcon
            sx={{
              fontSize: "4rem",
              color: "green",
            }}
          />
          {/* Thank You Heading */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
            }}
          >
            Thank You for Applying!
          </Typography>
          {/* Informative Message */}
          <Typography
            variant="body1"
            sx={{
              color: "#757575",
            }}
          >
            We will review your application and contact you with further
            information.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#757575",
            }}
          >
            If you’d like to log out, click the button below.
          </Typography>
          {/* Logout Button */}
          <button
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Thankyou;
