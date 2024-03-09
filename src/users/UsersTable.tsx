import { Box } from "@mui/joy";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
// AG Grid Component
import { UsersQuery } from "src/__generated__/gql/graphql";
import { Table } from "../components/Table";

export function UsersTable({ data }: { data: UsersQuery["usersMetadata"] }) {
  const columnDefs = [
    { field: "id", headerName: "ID" },
    { field: "first_name", headerName: "Name" },
    { field: "last_name", headerName: "Last Name" },
    { field: "usersMetadata_user.email", headerName: "Email" },
    { field: "usersMetadata_user.emailVerified", headerName: "Email Verified" },
    { field: "usersMetadata_user.lastSeen", headerName: "Last Seen" },
    { field: "hire_date", headerName: "Hire Date" },
    { field: "status", headerName: "Status" },
    { field: "active_project", headerName: "Active Project" },
  ] satisfies ColDef<(typeof data)[number]>[];

  return (
    <Box>
      <Table rowData={data} columnDefs={columnDefs} />
    </Box>
  );
}
