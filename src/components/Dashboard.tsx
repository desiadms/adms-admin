import { useSignOut } from "@nhost/react";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import { ProjectsQuery } from "src/__generated__/gql/graphql";
import { useProjects } from "../hooks";

export function Home() {
  const { data, loading } = useProjects();

  const columnDefs = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "poc", headerName: "POC" },
    { field: "status", headerName: "Status" },
    { field: "sub_contractor", headerName: "Sub Contractor" },
    { field: "location", headerName: "Location" },
    { field: "comment", headerName: "Comment" },
    { field: "contractor", headerName: "Contractor" },
    { field: "created_at", headerName: "Created At" },
  ] satisfies ColDef<ProjectsQuery["projects"][number]>[];

  return (
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 500 }} // the grid will fill the size of the parent container
    >
      {loading ? (
        <div> loading </div>
      ) : (
        <AgGridReact rowData={data} columnDefs={columnDefs} />
      )}
    </div>
  );
}

export function Dashboard() {
  const _signout = useSignOut();

  return (
    <div className="min-h-full">
      <main>
        <Outlet />
        {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
