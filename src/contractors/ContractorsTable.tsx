import { Box, Button } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ColDef,
  GetContextMenuItemsParams,
  MenuItemDef,
} from "ag-grid-community";
import { useCallback, useMemo } from "react";
import { AllContractorsByProjectQuery } from "../__generated__/gql/graphql";
import { Table } from "../components/Table";
import { useAllContractorsByProject } from "./hooks";

export function ContractorsTable() {
  const { project } = useParams({ from: "/projects/$project/contractors" });
  const { data } = useAllContractorsByProject(project);

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        {
          field: "name",
          headerName: "Contractor",
        },
      ] satisfies ColDef<AllContractorsByProjectQuery["contractors"][number]>[],
    [],
  );

  const navigate = useNavigate();

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams) => {
      return [
        "copy",
        {
          name: "Edit Contractor",
          action: () => {
            const id = params.node?.data.id;
            if (id) {
              return navigate({
                to: "/projects/$project/contractors/edit-contractor/$contractorId",
                params: { contractorId: id.toString(), project },
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
        rowData={data?.contractors || []}
        getContextMenuItems={getContextMenuItems}
        columnDefs={columnDefs}
        rightChildren={
          <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              navigate({
                to: "/projects/$project/contractors/new-contractor",
                params: { project },
              });
            }}
          >
            Add Contractor
          </Button>
        }
      />
    </Box>
  );
}
