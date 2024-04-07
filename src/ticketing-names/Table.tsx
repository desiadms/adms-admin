import { Box, Button } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ColDef,
  GetContextMenuItemsParams,
  MenuItemDef,
} from "ag-grid-community";
import { useCallback, useMemo } from "react";
import { Table } from "../components/Table";
import { useTicketingNamesByProject } from "./hooks";

export function TicketingTable() {
  const { data } = useTicketingNamesByProject();
  const { project } = useParams({ from: "/projects/$project/ticketing-names" });

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        { field: "name", headerName: "Name" },
        {
          field: "print_ticket",
          headerName: "Print Ticket",
          valueFormatter: (params) => (params.value ? "Yes" : "No"),
        },
        {
          field: "add_photos",
          headerName: "Add Photos",
          valueFormatter: (params) => (params.value ? "Yes" : "No"),
        },
        { field: "comment", headerName: "Comment" },
      ] satisfies ColDef<NonNullable<typeof data>[number]>[],
    [],
  );

  const navigate = useNavigate();

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams) => {
      return [
        "copy",
        {
          name: "Edit Row",
          action: () => {
            const id = params.node?.data.id;
            if (id) {
              return navigate({
                to: "/projects/$project/ticketing-names/$ticketingId",
                params: { project, ticketingId: id },
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
                to: "/projects/$project/ticketing-names/create",
                params: { project },
              });
            }}
          >
            Create Ticketing Name
          </Button>
        }
      />
    </Box>
  );
}
