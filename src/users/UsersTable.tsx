import { Box, Button } from "@mui/joy";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
// AG Grid Component
import { useNavigate } from "@tanstack/react-router";
import { UsersQuery } from "src/__generated__/gql/graphql";
import { Table } from "../components/Table";
import { useProjectOptions } from "../projects/hooks";
import { convertToPin } from "../utils";

export function UsersTable({ data }: { data: UsersQuery["usersMetadata"] }) {
  const projectOptions = useProjectOptions();

  const columnDefs = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "usersMetadata_user.email",
      headerName: "Pin",
      valueFormatter: (params) => convertToPin(params.value),
    },
    { field: "first_name", headerName: "Name" },
    { field: "last_name", headerName: "Last Name" },

    { field: "usersMetadata_user.lastSeen", headerName: "Last Seen" },
    { field: "hire_date", headerName: "Hire Date" },
    {
      field: "usersMetadata_user.metadata",
      headerName: "Active Project",
      valueFormatter: (params) =>
        projectOptions.data?.find(
          ({ value }) => value === params.value?.activeProject,
        )?.label || "Unemployed",
    },
  ] satisfies ColDef<(typeof data)[number]>[];

  const navigate = useNavigate({ from: "/projects/$project/users/" });

  return (
    <Box>
      <Table
        rowData={data}
        columnDefs={columnDefs}
        rightChildren={
          <Button
            variant="outlined"
            size="sm"
            onClick={() => navigate({ to: "/projects/$project/users/create" })}
          >
            Create User
          </Button>
        }
      />
    </Box>
  );
}
