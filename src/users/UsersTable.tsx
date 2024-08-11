import { Box, Button } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ColDef,
  GetContextMenuItemsParams,
  MenuItemDef,
} from "ag-grid-community";
import { useCallback, useMemo } from "react";
import { Table } from "../components/Table";
import { useProjectOptions } from "../projects/hooks";
import { convertToPin } from "../utils";
import { useProjectUsers } from "./hooks";

export function UsersTable({
  data,
}: {
  data: ReturnType<typeof useProjectUsers>["data"];
}) {
  const { data: projectOptions } = useProjectOptions();
  const { project } = useParams({ from: "/projects/$project/users" });

  const columnDefs = useMemo(
    () =>
      [
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
            projectOptions?.find(
              ({ value }) => value === params.value?.activeProject,
            )?.label || "Unemployed",
        },
      ] satisfies ColDef<NonNullable<typeof data>[number]>[],
    [projectOptions],
  );

  const navigate = useNavigate();

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams) => {
      return [
        "copy",
        {
          name: "Edit User",
          action: () => {
            const id = params.node?.data.id;
            if (id) {
              return navigate({
                to: "/projects/$project/editUser/$user",
                params: { user: id.toString(), project },
              });
            }
          },
        },
        {
          name: "View All Tickets",
          action: () => {
            const id = params.node?.data.id;
            if (id) {
              return navigate({
                to: "/projects/$project/users/$user/tasks",
                params: { user: id.toString(), project },
              });
            }
          },
        },
      ] satisfies (MenuItemDef | string)[];
    },
    [navigate, project],
  );

  return (
    <Box>
      <Table
        rowData={data}
        getContextMenuItems={getContextMenuItems}
        columnDefs={columnDefs}
        rightChildren={
          <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              navigate({
                to: "/projects/$project/createUser",
                params: { project },
              });
            }}
          >
            Create User
          </Button>
        }
      />
    </Box>
  );
}
