import React from "react";

function TableHeader({ headerInfo: { projectId, projectName, clientName } }) {
  return (
    <div className="table-heading-flex">
      <p className="table-heading-individual-component">
        ProjectID : {projectId}
      </p>
      <p className="table-heading-individual-component">
        Project Name: {projectName}
      </p>
      <p className="table-heading-individual-component">
        Client Name : {clientName}
      </p>
    </div>
  );
}

export default TableHeader;
