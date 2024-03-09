import { Box } from "@mui/joy";
import { UsersTable } from "./UsersTable";
import { useProjectUsers } from "./hooks";

export function ProjectUsers() {
  const { data, loading } = useProjectUsers();

  return (
    <Box>
      {loading ? <div> loading </div> : data && <UsersTable data={data} />}
    </Box>
  );
}
