import { DialogActions, DialogContent } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React, { useState } from "react";

function NewProjectPopUp({ setNewProject, setNewProjectButton }) {
  const [newProjectInput, setNewProjectInput] = useState("");
  function handleChange(event) {
    setNewProjectInput(event.target.value);
  }

  function handleSubmit() {
    setNewProject(newProjectInput);
    setNewProjectButton(false);
  }

  return (
    <Dialog open={true} onClose={() => setNewProjectButton(false)}>
      <DialogTitle>New Project</DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <TextField
          autoFocus
          margin="dense"
          id="ProjectId"
          label="Project ID"
          type="text"
          fullWidth
          onChange={handleChange}
          sx={{ textAlign: "center" }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={handleSubmit}> Add </Button>
        <Button onClick={() => setNewProjectButton(false)}> Close </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewProjectPopUp;