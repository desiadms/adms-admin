import { Box, Button } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ColDef,
  GetContextMenuItemsParams,
  MenuItemDef,
} from "ag-grid-community";
import { useCallback, useMemo } from "react";
import { AllTrucksByProjectQuery } from "../__generated__/gql/graphql";
import { Table } from "../components/Table";
import { useAllTrucksByProject } from "./hooks";

export function TrucksTable() {
  const { project } = useParams({ from: "/projects/$project/trucks" });
  const { data } = useAllTrucksByProject(project);

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        {
          field: "cubic_yardage",
          headerName: "Cubic Yardage",
        },
        { field: "truck_number", headerName: "Truck Number" },
        { field: "vin_number", headerName: "License" },
        { field: "driver_name", headerName: "Driver Name" },
        { field: "contractor", headerName: "Contractor" },
      ] satisfies ColDef<AllTrucksByProjectQuery["trucks"][number]>[],
    [],
  );

  const navigate = useNavigate();

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams) => {
      return [
        "copy",
        {
          name: "Edit Truck",
          action: () => {
            const id = params.node?.data.id;
            if (id) {
              return navigate({
                to: "/projects/$project/trucks/edit-truck/$truck",
                params: { truck: id.toString(), project },
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
        rowData={data?.trucks || []}
        columnDefs={columnDefs}
        getContextMenuItems={getContextMenuItems}
        rightChildren={
          <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              navigate({
                to: "/projects/$project/trucks/new-truck",
                params: { project },
              });
            }}
          >
            Add Truck
          </Button>
        }
      />
    </Box>
  );
}
