import { Box, Button } from "@mui/joy";
import { useNavigate } from "@tanstack/react-router";
import { ColDef } from "ag-grid-community";
import { useCallback } from "react";
import { ProjectsQuery } from "src/__generated__/gql/graphql";
import { Table } from "../components/Table";
import { TopNav } from "../nav/Components";
import { useProjects } from "./hooks";

export function Projects() {
  const { data, loading } = useProjects();
  const navigate = useNavigate({ from: "/projects" });

  const columnDefs = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "poc", headerName: "POC" },
    {
      field: "status",
      headerName: "Status",
      cellDataType: "text",
      valueGetter: (params) => (params.data?.status ? "Active" : "Inactive"),
    },
    { field: "sub_contractor", headerName: "Sub Contractor" },
    { field: "location", headerName: "Location" },
    { field: "comment", headerName: "Comment" },
    { field: "contractor", headerName: "Contractor" },
    { field: "created_at", headerName: "Created At" },
  ] satisfies ColDef<ProjectsQuery["projects"][number]>[];

  const handleNavigate = useCallback(
    (params) => {
      if (params?.id) {
        navigate({
          to: `/projects/$project/edit`,
          params: { project: params.id.toString() },
        });
      }
    },
    [navigate],
  );

  return (
    <Box>
      <TopNav />
      {loading ? (
        <div> loading </div>
      ) : (
        <Table
          rightChildren={
            <Button
              variant="outlined"
              size="sm"
              onClick={() => navigate({ to: "/projects/create" })}
            >
              Create Project
            </Button>
          }
          rowData={data}
          columnDefs={columnDefs}
          handleNavigate={handleNavigate}
        />
      )}
    </Box>
  );
}
