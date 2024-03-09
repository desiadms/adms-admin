import { Box } from "@mui/joy";
import { ColDef } from "ag-grid-community";
import { ProjectsQuery } from "src/__generated__/gql/graphql";
import { Table } from "../components/Table";
import { TopNav } from "../nav/Components";
import { useProjects } from "./hooks";

export function Projects() {
  const { data, loading } = useProjects();

  const columnDefs = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "poc", headerName: "POC" },
    { field: "status", headerName: "Status" },
    { field: "sub_contractor", headerName: "Sub Contractor" },
    { field: "location", headerName: "Location" },
    { field: "comment", headerName: "Comment" },
    { field: "contractor", headerName: "Contractor" },
    { field: "created_at", headerName: "Created At" },
  ] satisfies ColDef<ProjectsQuery["projects"][number]>[];

  return (
    <Box>
      <TopNav links={[]} />
      {loading ? (
        <div> loading </div>
      ) : (
        <Table rowData={data} columnDefs={columnDefs} />
      )}
    </Box>
  );
}
