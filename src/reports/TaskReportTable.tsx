import { Box } from "@mui/joy";
import { Leaflet } from "../leaflet/Leaflet";
import { useTasksLatLon } from "./hooks";

export function TaskReportTable() {
  const { data, loading, error } = useTasksLatLon();
  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (!data) return <div>no data</div>;
  return (
    <Box sx={{ height: 500 }}>
      <Leaflet groupedTasks={data} />
    </Box>
  );
}
