import { Box, Button } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ColDef,
  GetContextMenuItemsParams,
  MenuItemDef,
} from "ag-grid-community";
import { useCallback, useMemo } from "react";
import { AllDisposalSitesByProjectQuery } from "../__generated__/gql/graphql";
import { Table } from "../components/Table";
import { useAllDisposalSitesByProject } from "./hooks";

export function DisposalSitesTable() {
  const { project } = useParams({ from: "/projects/$project/disposal-sites" });
  const { data } = useAllDisposalSitesByProject(project);

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        {
          field: "name",
          headerName: "Disposal Site",
        },
      ] satisfies ColDef<
        AllDisposalSitesByProjectQuery["disposal_sites"][number]
      >[],
    [],
  );

  const navigate = useNavigate();

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams) => {
      return [
        "copy",
        {
          name: "Edit Disposal Site",
          action: () => {
            const id = params.node?.data.id;
            if (id) {
              return navigate({
                to: "/projects/$project/disposal-sites/edit-site/$site",
                params: { site: id.toString(), project },
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
        rowData={data?.disposal_sites || []}
        getContextMenuItems={getContextMenuItems}
        columnDefs={columnDefs}
        rightChildren={
          <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              navigate({
                to: "/projects/$project/disposal-sites/new-site",
                params: { project },
              });
            }}
          >
            Add Disposal Site
          </Button>
        }
      />
    </Box>
  );
}
