import { Box } from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
import { Table } from "../components/Table";
import { useAllTasksByProject } from "./hooks";

export function TaskReportTable() {
  const { project } = useParams({ from: "/projects/$project/task-report/" });
  const { data } = useAllTasksByProject(project);

  const rowData = useMemo(() => data.map((task) => task.tasks).flat(), [data]);

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        {
          field: "latitude",
          headerName: "Latitude",
        },
        { field: "longitude", headerName: "Longitude" },

        { field: "projectId", headerName: "Project ID" },

        { field: "taskId", headerName: "Task ID" },
        { field: "taskName", headerName: "Task Name" },
      ] satisfies ColDef<NonNullable<typeof rowData>[number]>[],
    [],
  );

  return (
    <Box>
      <Table rowData={rowData} columnDefs={columnDefs} />
    </Box>
  );
}
