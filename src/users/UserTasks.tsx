import { Box, Divider, Typography } from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import { useAllTasksByProjectAndUser } from "../reports/hooks";
import { formatToEST } from "../utils";



type TPrintable = {
  created_at: string;
  id: string;
  key: string;
  latitude: number;
  longitude: number;
  project_id: string;
  comment: string;
};

function Printable({ ticket }: { ticket: TPrintable }) {
  return (
    <Box
      className="ticket-page"
      sx={{
        pageBreakInside: "avoid",
        border: "1px solid",
        borderColor: "neutral.outlinedBorder",
        borderRadius: "8px",
        padding: "8px", // Reduced padding
        backgroundColor: "background.level1",
        boxShadow: "sm",
        "&:hover": {
          boxShadow: "md",
        },
      }}
    >
      <Typography level="body-lg" marginBottom="8px" textColor="text.primary">
        Ticket Details {ticket.key}
      </Typography>

      <Divider sx={{ marginBottom: "8px" }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // Two equal-width columns
          gridAutoRows: "min-content", // Rows take the minimum space needed
          gap: "8px", // Optional: spacing between items
        }}
      >
        <Box>
          <Typography textColor="text.secondary" level="body-sm">
            Created At:
          </Typography>
          <Typography level="body-sm" textColor="text.primary">
            {formatToEST(ticket.created_at)}
          </Typography>
        </Box>

        <Box>
          <Typography textColor="text.secondary" level="body-sm">
            Ticket ID:
          </Typography>
          <Typography level="body-sm" textColor="text.primary">
            {ticket.id}
          </Typography>
        </Box>

        <Box>
          <Typography textColor="text.secondary" level="body-sm">
            Latitude:
          </Typography>
          <Typography level="body-sm" textColor="text.primary">
            {ticket.latitude}
          </Typography>
        </Box>

        <Box>
          <Typography textColor="text.secondary" level="body-sm">
            Longitude:
          </Typography>
          <Typography level="body-sm" textColor="text.primary">
            {ticket.longitude}
          </Typography>
        </Box>

        <Box>
          <Typography textColor="text.secondary" level="body-sm">
            Project ID:
          </Typography>
          <Typography level="body-sm" textColor="text.primary">
            {ticket.project_id}
          </Typography>
        </Box>

        <Box>
          <Typography textColor="text.secondary" level="body-sm">
            Comment:
          </Typography>
          <Typography level="body-sm" textColor="text.primary">
            {ticket.comment}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function UserTasks() {
  const { project, user } = useParams({
    from: "/projects/$project/users/$user/tasks",
  });
  const { data, loading, error } = useAllTasksByProjectAndUser(project, user);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error.message}</Box>;
  if (!data) return <Box>No data</Box>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 4 }}>
      {data.map((ticket) => (
        <Printable key={ticket.id} ticket={ticket} />
      ))}
    </Box>
  );
}
