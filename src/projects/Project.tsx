import { Box } from "@mui/joy";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
// AG Grid Component
import { Outlet } from "@tanstack/react-router";
import { TopNav } from "../nav/Components";
import { useSingleProjectLinks } from "./hooks";

export function Project() {
  const links = useSingleProjectLinks();

  return (
    <Box>
      <TopNav links={links} />
      <Outlet />
    </Box>
  );
}
