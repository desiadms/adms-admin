import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdBlock, MdCheck } from "react-icons/md";
import {
  InputField,
  PrettySwitchField,
  TextAreaField,
} from "../components/Form";
import { inputSx, inputWidth, joy4ValueInPx, maxFormWidth } from "../globals";
import { mutationUpsertTicketingName, useTicketingName } from "./hooks";
import { TicketingNameForm, ticketingNameValidation } from "./utils";

export function Edit() {
  const { ticketingId } = useParams({
    from: "/projects/$project/ticketing-names/$ticketingId",
  });
  const { data, loading, error } = useTicketingName(ticketingId);

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (!data) return <div>no data</div>;

  return <Form ticketing={data} />;
}

function Form({ ticketing }: { ticketing: TicketingNameForm }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TicketingNameForm>({
    resolver: zodResolver(ticketingNameValidation),
    defaultValues: ticketing,
  });

  const [executeMutation] = useMutation(mutationUpsertTicketingName);

  async function onSubmit(data: Omit<TicketingNameForm, "project_id">) {
    try {
      const res = await toast.promise(
        executeMutation({
          variables: { object: { ...data, project_id: ticketing.project_id } },
        }),
        {
          loading: "Editing ticket...",
          success: "Ticket edited",
          error: "Failed to edit ticket",
        },
      );

      const ticketingId = res?.data?.insert_ticketing_names_one?.id;

      if (!ticketingId) throw new Error("Cannot find ticketing id in response");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Box>
      <Box
        sx={{
          p: 4,
          maxWidth: {
            sx: "100%",
            md: maxFormWidth,
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography level="h3">Edit Ticket</Typography>
          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <InputField
              sx={inputSx}
              label="name"
              {...register("name", {
                required: "Email is required",
              })}
              error={errors.name}
            />
            <PrettySwitchField
              control={control}
              label={(value) => `Add photos? ${value ? "Yes" : "No"}`}
              name="add_photos"
              slotProps={{
                track: {
                  children: (
                    <>
                      <Box sx={{ ml: "8px", display: "flex", color: "white" }}>
                        <MdCheck size={18} />
                      </Box>
                      <Box sx={{ mr: "8px", display: "flex", color: "white" }}>
                        <MdBlock size={18} />
                      </Box>
                    </>
                  ),
                },
              }}
            />
            <PrettySwitchField
              control={control}
              label={(value) => `Print Ticket? ${value ? "Yes" : "No"}`}
              name="print_ticket"
              slotProps={{
                track: {
                  children: (
                    <>
                      <Box sx={{ ml: "8px", display: "flex", color: "white" }}>
                        <MdCheck size={18} />
                      </Box>
                      <Box sx={{ mr: "8px", display: "flex", color: "white" }}>
                        <MdBlock size={18} />
                      </Box>
                    </>
                  ),
                },
              }}
            />
          </Box>
          <Box sx={{ pt: 4 }}>
            <TextAreaField
              sx={{
                width: {
                  xs: "100%",
                  sm: inputWidth * 2 + joy4ValueInPx,
                },
              }}
              label="comment"
              {...register("comment")}
            />
          </Box>

          <Button sx={{ mt: 4 }} type="submit" color="success" variant="solid">
            Edit Ticket
          </Button>
        </form>
      </Box>
    </Box>
  );
}
