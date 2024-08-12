import { Box } from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import { Leaflet } from "../leaflet/Leaflet";
import { useAllTasksByProject } from "./hooks";

export function TaskReportMap() {
  const { project } = useParams({ from: "/projects/$project/task-report/" });
  const { data, loading, error } = useAllTasksByProject(project);

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (!data) return <div>no data</div>;
  return (
    <Box sx={{ height: 500 }}>
      <Leaflet groupedTasks={data} />
    </Box>
  );
}
