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
import { headerHeight } from "../globals";
import { useTasksLatLon } from "../reports/hooks";

const USALatLng = [37.0902, -95.712] satisfies LatLngTuple;
const center = USALatLng;

export function Leaflet({
  groupedTasks,
}: {
  groupedTasks: ReturnType<typeof useTasksLatLon>["data"];
}) {
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
