import { Box } from "@mui/joy";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
import { Table } from "../components/Table";
import { dateComparator, formatToEST } from "../utils";
import { useTaskLogs } from "./hooks";

export function TaskLogsTable() {
  const { data } = useTaskLogs();

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        { field: "user.email", headerName: "User" },
        {
          field: "created_at",
          headerName: "Created At",
          filter: "agDateColumnFilter",
          filterParams: {
            comparator: dateComparator,
          },
          valueFormatter: (params) => {
            return formatToEST(params.value);
          },
        },
        { field: "project.name", headerName: "Project ID" },
        {
          field: "data",
          headerName: "Data",
          width: 600,
          wrapText: true,
          autoHeight: true,
          // to avoid annoying ag grid logs
          valueFormatter: () => {
            return "";
          },
          cellRenderer: (params) => {
            if (!params.data?.data) return "No JSON data";

            return <pre>{JSON.stringify(params.data.data, null, 4)}</pre>;
          },
        },

        { field: "type", headerName: "Type" },
      ] satisfies ColDef<NonNullable<typeof data>[number]>[],
    [],
  );

  return (
    <Box>
      <Table rowData={data} columnDefs={columnDefs} />
    </Box>
  );
}
