import { Box, Button } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
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

  return (
    <Box>
      <Table
        rowData={data?.disposal_sites || []}
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
