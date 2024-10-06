import { Box } from "@mui/joy";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { headerHeight, tableTopToolbarHeight } from "../globals";
import { useAllTasksByProject } from "./hooks";

const position = [51.505, -0.09] satisfies LatLngTuple;

// create a market per grupedTask

type TTasks = ReturnType<typeof useAllTasksByProject>["data"];

export function MapTasks({ tasks }: { tasks: TTasks }) {
  return (
    <Box sx={{ position: "relative" }}>
      <MapContainer
        style={{
          height: `calc(100dvh - ${headerHeight}px - ${tableTopToolbarHeight}px)`,
        }}
        center={position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
