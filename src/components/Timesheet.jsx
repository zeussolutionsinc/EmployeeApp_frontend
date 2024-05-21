import React, { useEffect, useState } from "react";
import GridV3 from "./GridV3";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Zero-padded month
  const day = today.getDate().toString().padStart(2, "0"); // Zero-padded day
  return `${year}-${month}-${day}`;
}

function Timesheet() {
  const [fetchedData, setFetchedData] = useState({
    EmployeeId: "",
    Approver: "",
    EmployeeName: "",
    ProjectName: "",
    ClientName: "",
    ProjectDateHours: [],
  });

  const [postData, setPostData] = useState({
    EmployeeId: "",
    Approver: "",
    ProjectDateHours: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://localhost:7078/api/TimeSheet";
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
        const json = await response.json();
        // console.log("Fetched JSON: ", json);

        if (json && json.EmployeeId) {
          setFetchedData(json);

          setPostData((prevData) => ({
            ...prevData,
            EmployeeId: json.EmployeeId,
            Approver: json.Approver,
            ProjectDateHours: json.ProjectDateHours,
            SubmissionDate: getDate(),
          }));
        } else {
          throw new Error("Fetched data is not in the expected format");
        }
      } catch (error) {
        setError(
          "There was a problem with your fetch operation: " + error.message
        );
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  // console.log("Fetched Data: ", fetchedData);
  // console.log("Fetched Data projectDateHours: ", fetchedData.ProjectDateHours);
  // console.log("Post Data: ", postData);

  return (
    <div>
      <div className="table-heading-flex">
        <p>Id: {fetchedData.EmployeeId}</p>
        <p>Name: {fetchedData.EmployeeName}</p>
        <p>Date: {getDate()}</p>
      </div>
      {/* <TableHeader
        headerInfo={{
          projectName: fetchedData.ProjectName,
          clientName: fetchedData.ClientName,
          projectId:
            fetchedData.ProjectDateHours.length > 0
              ? fetchedData.ProjectDateHours[0].ProjectId
              : "",
        }}
      /> */}
      <GridV3
        ProjectDateHours={fetchedData.ProjectDateHours}
        setPostData={setPostData}
        postData={postData}
      />
    </div>
  );
}

export default Timesheet;
