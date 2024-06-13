import React from "react";
import { AgGridReact } from "ag-grid-react";
import FilterBox from "./FilterBox";

const MainGrid = ({
  value,
  statuses,
  handleStatusChange,
  fetchTimesheetDataForMonth,
  renderAvailableMonths,
  selectedEmployee,
  setSelectedEmployee,
  setAvailableMonths
}) => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [filteredTimesheetData, setFilteredTimesheetData] = useState([]);
  const [timesheetColumns, setTimesheetColumns] = useState([]);
  const [vacationData, setVacationData] = useState([]);
  const [vacationColumns, setVacationColumns] = useState([]);
  const [h1bData, setH1bData] = useState([]);
  const [h1bColumns, setH1bColumns] = useState([]);
  const [newRecruitsData, setNewRecruitsData] = useState([
    { name: "Alice Brown", position: "Developer", startDate: "2024-05-15" },
    { name: "Bob Green", position: "Designer", startDate: "2024-06-01" },
    { name: "Charlie White", position: "Manager", startDate: "2024-07-01" },
  ]);
  const [newRecruitsColumns, setNewRecruitsColumns] = useState([
    { headerName: "Name", field: "name", headerClass: "header-center" },
    { headerName: "Position", field: "position", headerClass: "header-center" },
    { headerName: "Start Date", field: "startDate", headerClass: "header-center" },
  ]);

  useEffect(() => {
    const fetchData = async (url, setData, setColumns, excludeColumns = []) => {
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
        const json = await response.json();
        console.log(url, json);
        setData(json);
        setFilteredTimesheetData(json);

        if (json.length > 0) {
          const keys = Object.keys(json[0]).filter(
            (key) => !excludeColumns.includes(key)
          );
          const columns = [
            {
              headerCheckboxSelection: true,
              checkboxSelection: true,
              width: 50,
              headerClass: "header-center",
            },
            ...keys.map((key) => ({
              headerName: key.replace(/([A-Z])/g, " $1").trim(),
              field: key,
              filter: true,
              suppressSizeToFit: false,
              headerClass: "header-center",
            })),
          ];
          setColumns(columns);
        }
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    fetchData("https://localhost:7078/api/AdminH1b", setH1bData, setH1bColumns);
    fetchData(
      "https://localhost:7078/api/AdminVacation",
      setVacationData,
      setVacationColumns
    );
    fetchData(
      "https://localhost:7078/api/AdminEmpTimesheet",
      setTimesheetData,
      setTimesheetColumns,
      ["EmployeeId", "action"]
    );
  }, []);

  const getRowData = (value) => {
    switch (value) {
      case "1":
        return { rowData: filteredTimesheetData, columnDefs: timesheetColumns };
      case "2":
        return { rowData: vacationData, columnDefs: vacationColumns };
      case "3":
        return { rowData: h1bData, columnDefs: h1bColumns };
      case "4":
        return { rowData: newRecruitsData, columnDefs: newRecruitsColumns };
      default:
        return { rowData: [], columnDefs: [] };
    }
  };

  const { rowData, columnDefs } = getRowData(value);
  const isTimesheetTab = value === "1";

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {isTimesheetTab && selectedEmployee && (
        <div className="filter-status" style={{ marginRight: "1vw" }}>
          <FilterBox
            statuses={statuses}
            handleStatusChange={handleStatusChange}
            handleSubmit={fetchTimesheetDataForMonth}
            style={{ width: "20vw" }}
          />
          <div className="available-months" style={{ width: "20vw" }}>
            <h3>Available Months</h3>
            <div className="months-container">{renderAvailableMonths()}</div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", width: "calc(80vw)" }}>
        <div className="ag-theme-alpine" style={{ height: "60vh", overflowY: "auto", transition: "width 0.3s" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            rowHeight={30}
            rowSelection="multiple"
            defaultColDef={{
              sortable: true,
              resizable: true,
              minWidth: 50,
              headerComponentParams: {
                menuIcon: "fa-bars",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainGrid;
