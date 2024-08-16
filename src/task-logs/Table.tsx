import { Box } from "@mui/joy";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
import { Table } from "../components/Table";
import { useTaskLogs } from "./hooks";

export function TaskLogsTable() {
  const { data } = useTaskLogs();

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID" },
        { field: "user.email", headerName: "User" },
        { field: "project.name", headerName: "Project ID" },
        {
          field: "data",
          headerName: "Data",
          width: 600,
          cellRenderer: (params) => {
            if (!params.data?.data) return "No JSON data";

            return (
              <pre style={{ whiteSpace: "pre-line" }}>
                {" "}
                {JSON.stringify(params.data.data)}
              </pre>
            );
          },
        },
        { field: "created_at", headerName: "Created At" },
        { field: "type", headerName: "Type" },
      ] satisfies ColDef<NonNullable<typeof data>[number]>[],
    [],
  );

  return (
    <Box>
      <Table
        defaultColDef={{ wrapText: true, autoHeight: true }}
        rowData={data}
        columnDefs={columnDefs}
      />
    </Box>
  );
}
