import { Box, Button } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
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
        { field: "vin_number", headerName: "VIN Number" },
      ] satisfies ColDef<AllTrucksByProjectQuery["trucks"][number]>[],
    [],
  );

  const navigate = useNavigate();

  return (
    <Box>
      <Table
        rowData={data?.trucks || []}
        columnDefs={columnDefs}
        rightChildren={
          <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              navigate({ to: "/projects/$project/trucks/new-truck", params: { project } });
            }}
          >
            Add Truck
          </Button>
        }
      />
    </Box>
  );
}
