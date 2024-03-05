import { useSignOut } from "@nhost/react";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useState } from "react";

export function Home() {
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);
  
  // Column Definitions: Defines the columns to be displayed.
  const colDefs = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ];
  return   <div
  className="ag-theme-quartz" // applying the grid theme
  style={{ height: 500 }} // the grid will fill the size of the parent container
 >
   <AgGridReact
       rowData={rowData}
       columnDefs={colDefs}
   />
 </div>
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
