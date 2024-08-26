import { Box } from "@mui/joy";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

import { useAllTasksByProject } from "../reports/hooks";

const USALatLng = [37.0902, -95.712] satisfies LatLngTuple;
const _center = USALatLng;

// create a market per grupedTask

type TGroupedTasks = ReturnType<typeof useAllTasksByProject>["data"];

const _markers = {
  tasks_stump_removal:
    "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  tasks_tree_removal: "/images/marker.png",
  tasks_collection: "https://leafletjs.com/examples/custom-icons/leaf-blue.png",
  tasks_disposal: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  tasks_ticketing:
    "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
} as const satisfies { [K in TGroupedTasks[number]["taskName"]]: string };

export function Leaflet(_x: { groupedTasks: TGroupedTasks }) {
  console.log("in here??");
  return <Box sx={{ position: "relative" }}>wip</Box>;
}
