import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";

export default function H1bAdmin() {
  const { user } = useAuth0();
  const authId = user.sub.substring(6);
  const [rowData, setRowData] = useState([]);
  const [editIdx, setEditIdx] = useState(-1); // Index of the row being edited
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/authid/${authId}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setRowData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [authId]);

  const saveEdits = async (index) => {
    const data = rowData[index];
    const url = `https://zeusemployeeportalbackend.azurewebsites.net/api/AdminH1b/${data.registrationId}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Include other headers as needed, such as Authorization if using tokens
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      const result = await response.json(); // Assuming the server sends back some data
      console.log(result.message); // Log or handle the message from the server
      stopEditing(); // Stop editing on successful update
    } catch (error) {
      console.error("Failed to save data:", error);
      setError("Failed to save data");
    }
  };

  const startEditing = (index) => {
    setEditIdx(index);
  };

  const stopEditing = () => {
    setEditIdx(-1);
  };

  const handleChange = (e, name, index) => {
    const newRows = [...rowData];
    newRows[index][name] = e.target.value;
    setRowData(newRows);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5" }}
            >
              Passport Number
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5" }}
            >
              First Name
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5" }}
            >
              Last Name
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5" }}
            >
              Passport Expiry Date
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Email
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Contact Number
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Degree
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              College City
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              College Name
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Graduation Year
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              OPT
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Worked in USA
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Experience (Years)
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Employer
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Job Title
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Technical Skills
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Referral source
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Registration ID
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Degree Major
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              LinkedIn URL
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Resume
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Approval Status
            </TableCell>
            <TableCell
              sx={{ background: "#9ad9f3", border: "1px solid #1cabe5 " }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <hr />
        <TableBody>
          {rowData.map((row, index) => (
            <TableRow key={index}>
              {editIdx === index ? (
                <>
                  {Object.keys(row).map((key) => (
                    <TableCell key={key}>
                      {typeof row[key] === "boolean" ? (
                        <Checkbox
                          checked={row[key]}
                          onChange={(e) => handleChange(e, key, index)}
                        />
                      ) : (
                        <TextField
                          type={
                            typeof row[key] === "number" ? "number" : "text"
                          }
                          value={row[key]}
                          onChange={(e) => handleChange(e, key, index)}
                          size="small"
                          fullWidth
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => saveEdits(index)} color="primary">
                      Save
                    </Button>
                    <Button onClick={() => stopEditing()} color="secondary">
                      Cancel
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  {Object.keys(row).map((key) => (
                    <TableCell key={key}>
                      {typeof row[key] === "boolean"
                        ? row[key]
                          ? "Yes"
                          : "No"
                        : row[key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => startEditing(index)} color="primary">
                      Edit
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
          {error && (
            <TableRow>
              <TableCell colSpan={21}>{error}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
