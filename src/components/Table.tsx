import { useRouterState } from "@tanstack/react-router";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import { ComponentProps } from "react";
import { useDarkMode } from "../admin";

export function Table<T extends { id: string }>(
  props: ComponentProps<typeof AgGridReact<T>>,
) {
  const darkMode = useDarkMode();
  const {
    location: { pathname },
  } = useRouterState();

  return (
    <div
      className={
        darkMode
          ? "ag-theme-quartz-dark ag-theme-dark-custom"
          : "ag-theme-quartz ag-theme-light-custom"
      }
      style={{ height: 500 }} // the grid will fill the size of the parent container
    >
      <AgGridReact key={pathname} {...props} />
    </div>
  );
}
