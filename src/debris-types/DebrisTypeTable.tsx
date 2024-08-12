import { Box, Button } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ColDef,
  GetContextMenuItemsParams,
  MenuItemDef,
} from "ag-grid-community";
import { useCallback, useMemo } from "react";
import { AllDebrisTypesByProjectQuery } from "../__generated__/gql/graphql";
import { Table } from "../components/Table";
import { useAllDebrisTypesByProject } from "./hooks";

export function DebrisTypeTable() {
  const { project } = useParams({ from: "/projects/$project/debris-types" });
  const { data } = useAllDebrisTypesByProject(project);

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        {
          field: "name",
          headerName: "Debris Type",
        },
      ] satisfies ColDef<
        AllDebrisTypesByProjectQuery["debris_types"][number]
      >[],
    [],
  );

  const navigate = useNavigate();

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams) => {
      return [
        "copy",
        {
          name: "Edit Debris Type",
          action: () => {
            const id = params.node?.data.id;
            if (id) {
              return navigate({
                to: "/projects/$project/debris-types/edit-debris-type/$debrisTypeId",
                params: { debrisTypeId: id.toString(), project },
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
        rowData={data?.debris_types || []}
        getContextMenuItems={getContextMenuItems}
        columnDefs={columnDefs}
        rightChildren={
          <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              navigate({
                to: "/projects/$project/debris-types/new-debris-type",
                params: { project },
              });
            }}
          >
            Add Debris Type
          </Button>
        }
      />
    </Box>
  );
}
