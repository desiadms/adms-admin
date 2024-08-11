import { Box } from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
import { Table } from "../components/Table";
import { nhost } from "../nhost";
import { formatToEST } from "../utils";
import { useAllTasksByProject } from "./hooks";

export function TaskReportTable() {
  const { project } = useParams({ from: "/projects/$project/task-report/" });
  const { data } = useAllTasksByProject(project);
  console.log('data', data)

  const rowData = useMemo(() => data.map((task) => task.tasks).flat(), [data]);

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        { field: "taskName", headerName: "Task Name" },
        { field: "taskId", headerName: "Task ID" },
      {field: 'createdAt', headerName: 'Created At (EST Time)', valueFormatter: (params) => {
        return  formatToEST(params.value);
      }},
        {
          field: "latitude",
          headerName: "Latitude",
        },
        { field: "longitude", headerName: "Longitude" },

        { field: "projectId", headerName: "Project ID" },
        {field: "imageId", headerName: "Image", valueGetter: (params) => {
          return params.data?.imageId ? 
          nhost.storage.getPublicUrl({fileId: params.data?.imageId}) :
          'No Image';
        }},
      ] satisfies ColDef<NonNullable<typeof rowData>[number]>[],
    [],
  );

  return (
    <Box>
      <Table rowData={rowData} columnDefs={columnDefs} />
    </Box>
  );
}
