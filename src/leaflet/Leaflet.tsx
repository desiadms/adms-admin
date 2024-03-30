import { Icon, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { headerHeight } from "../globals";
import { useTasksLatLon } from "../reports/hooks";

const USALatLng = [37.0902, -95.712] satisfies LatLngTuple;
const center = USALatLng;

// create a market per grupedTask

type TGroupedTasks = ReturnType<typeof useTasksLatLon>["data"];

const markers = {
  tasks_stump_removal:
    "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  tasks_tree_removal:
    "https://leafletjs.com/examples/custom-icons/leaf-orange.png",
  tasks_collection: "https://leafletjs.com/examples/custom-icons/leaf-blue.png",
  tasks_disposal: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  tasks_ticketing:
    "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
} as const satisfies { [K in TGroupedTasks[number]["key"]]: string };

export function Leaflet({ groupedTasks }: { groupedTasks: TGroupedTasks }) {
  return (
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
                      icon={
                        new Icon({
                          iconUrl: markers[key],
                          iconSize: [38, 95],
                        })
                      }
                      key={task.id}
                      position={[task.latitude, task.longitude]}
                    >
                      <Popup>See More Details</Popup>
                    </Marker>
                  );
                })}
              </LayerGroup>
            </LayersControl.Overlay>
          );
        })}
      </LayersControl>
    </MapContainer>
  );
}
