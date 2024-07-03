import { Box } from "@mui/joy";
import { useTicketingTask } from "./hooks";

export function TicketingTask() {
  const { data } = useTicketingTask();

  return <Box>{JSON.stringify(data)}</Box>;
}
