import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAllTasksByProjectAndUser } from "../reports/hooks";
import {
  dateComparator,
  formatToEST,
  fromDateObjectToDateInput,
  midnightDate,
} from "../utils";

type TPrintable = {
  created_at: string;
  id: string;
  key: string;
  latitude: number;
  longitude: number;
  project_id: string;
  comment: string;
  task_ticketing_name?: {
    name: string;
  };
  project: {
    name: string;
  };
  disposal_site_data?: {
    name: string;
  };
  debris_type_data?: {
    name: string;
  };
  contractor_data?: {
    name: string;
  };
  truck_data?: {
    truck_number: string;
  };
  userPin: {
    email: string;
  };
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
        {ticket.task_ticketing_name && (
          <Box>
            <Typography textColor="text.secondary" level="body-sm">
              Type:
            </Typography>
            <Typography level="body-sm" textColor="text.primary">
              {ticket.task_ticketing_name.name}
            </Typography>
          </Box>
        )}
        <Box>
          <Typography textColor="text.secondary" level="body-sm">
            User
          </Typography>
          <Typography level="body-sm" textColor="text.primary">
            {ticket.userPin.email}
          </Typography>
        </Box>
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
            {ticket.project.name}
          </Typography>
        </Box>

        {ticket.debris_type_data && (
          <Box>
            <Typography textColor="text.secondary" level="body-sm">
              Debris Type:
            </Typography>
            <Typography level="body-sm" textColor="text.primary">
              {ticket.debris_type_data.name}
            </Typography>
          </Box>
        )}

        {ticket.contractor_data && (
          <Box>
            <Typography textColor="text.secondary" level="body-sm">
              Contractor:
            </Typography>
            <Typography level="body-sm" textColor="text.primary">
              {ticket.contractor_data.name}
            </Typography>
          </Box>
        )}

        {ticket.truck_data && (
          <Box>
            <Typography textColor="text.secondary" level="body-sm">
              Truck Number:
            </Typography>
            <Typography level="body-sm" textColor="text.primary">
              {ticket.truck_data.truck_number}
            </Typography>
          </Box>
        )}

        {ticket.disposal_site_data && (
          <Box>
            <Typography textColor="text.secondary" level="body-sm">
              Disposal Site:
            </Typography>
            <Typography level="body-sm" textColor="text.primary">
              {ticket.disposal_site_data.name}
            </Typography>
          </Box>
        )}

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

const twodaysAgoAtMidnight = new Date();
twodaysAgoAtMidnight.setDate(twodaysAgoAtMidnight.getDate() - 2);
twodaysAgoAtMidnight.setHours(0, 0, 0, 0);

export function UserTasks() {
  const { project, user } = useParams({
    from: "/projects/$project/users/$user/tasks",
  });
  const { data, loading, error } = useAllTasksByProjectAndUser(project, user);

  const [greaterThan, setGreaterThan] = useState<Date>(twodaysAgoAtMidnight);
  const inputValue = fromDateObjectToDateInput(greaterThan);

  const filterGreaterThanData = useMemo(
    () =>
      data?.filter((task) => {
        return dateComparator(greaterThan, task.created_at) > -1;
      }),
    [data, greaterThan],
  );

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error.message}</Box>;
  if (!data) return <Box>No data</Box>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 4 }}>
      <FormControl>
        <FormLabel sx={{ textTransform: "capitalize" }}>
          filter Date from
        </FormLabel>

        <Input
          sx={{ width: "fit-content" }}
          type="date"
          value={inputValue}
          onChange={(e) => {
            setGreaterThan(midnightDate(new Date(e.target.value)));
          }}
        />
      </FormControl>
      {filterGreaterThanData?.map((ticket) => (
        <Printable key={ticket.id} ticket={ticket} />
      ))}
    </Box>
  );
}
