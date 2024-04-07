import { Box } from "@mui/joy";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import LinkRouter from "../components/Link";
import { headerHeight } from "../globals";
import { useTasksLatLon } from "../reports/hooks";

const USALatLng = [37.0902, -95.712] satisfies LatLngTuple;
const center = USALatLng;

// create a market per grupedTask

type TGroupedTasks = ReturnType<typeof useTasksLatLon>["data"];

const _markers = {
  tasks_stump_removal:
    "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  tasks_tree_removal: "/images/marker.png",
  tasks_collection: "https://leafletjs.com/examples/custom-icons/leaf-blue.png",
  tasks_disposal: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  tasks_ticketing:
    "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
} as const satisfies { [K in TGroupedTasks[number]["key"]]: string };

export function Leaflet({ groupedTasks }: { groupedTasks: TGroupedTasks }) {
  return (
    <Box sx={{ position: "relative" }}>
      <Box></Box>
      <MapContainer
        style={{ height: `calc(100dvh - ${headerHeight}px)` }}
        center={center}
        zoom={4}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          {groupedTasks?.map(({ label, key, tasks }) => {
            return (
              <LayersControl.Overlay checked key={key} name={label}>
                <LayerGroup>
                  {tasks.map((task) => {
                    return (
                      <Marker
                        // icon={
                        //   new Icon({
                        //     iconUrl: markers[key],
                        //   })
                        // }
                        key={task.id}
                        position={[task.latitude, task.longitude]}
                      >
                        <Popup>
                          <LinkRouter
                            to="/projects/$project/task-report/tree-removal/$taskId"
                            params={{
                              taskId: task.taskId,
                              project: task.projectId,
                            }}
                          >
                            View Task
                          </LinkRouter>
                        </Popup>
                      </Marker>
                    );
                  })}
                </LayerGroup>
              </LayersControl.Overlay>
            );
          })}
        </LayersControl>
      </MapContainer>
    </Box>
  );
}
