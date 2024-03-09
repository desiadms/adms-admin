import { Box } from "@mui/joy";
import { UsersTable } from "./UsersTable";
import { useAllUsers } from "./hooks";

export function Users() {
  const { data, loading } = useAllUsers();

  return (
    <Box>
      {loading ? <div> loading </div> : data && <UsersTable data={data} />}
    </Box>
  );
}
