import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useNavigate } from 'react-router-dom';


export default function WelcomePage() {
    let navigate = useNavigate();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Button
            type="button"
            variant="outlined"
            onClick={()=>{navigate("/fillH1B")}}
            sx={{
              backgroundColor: "#dc3333", // Sets the background color of the button
              color: "white", // Sets the text color of the button
              "&:hover": {
                backgroundColor: "darken(#dc3333, 0.2)", // Darkens the background color on hover
                color: "black", // Changes the text color on hover
              },
            }}
          >
            New User
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Button
            type="button"
            variant="outlined"
            onClick={()=>{navigate("/GetH1bForm")}}
            sx={{
              backgroundColor: "#dc3333", // Sets the background color of the button
              color: "white", // Sets the text color of the button
              "&:hover": {
                backgroundColor: "darken(#dc3333, 0.2)", // Darkens the background color on hover
                color: "black", // Changes the text color on hover
              },
            }}
          >
            Existing User
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
