import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { AllDisposalSitesByProjectQuery } from "../__generated__/gql/graphql";
import { InputField } from "../components/Form";
import { inputSx, maxFormWidth } from "../globals";
import { mutationInsertTruck } from "./hooks";

export type DisposalSiteForm =
  AllDisposalSitesByProjectQuery["disposal_sites"][number];

const disposalSiteValidation = z.object({
  name: z.string().min(3),
});

export function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DisposalSiteForm>({
    resolver: zodResolver(disposalSiteValidation),
  });

  const [executeMutation] = useMutation(mutationInsertTruck);
  const navigate = useNavigate({
    from: "/projects/$project/disposal-sites/new-site",
  });
  const { project } = useParams({
    from: "/projects/$project/disposal-sites/new-site",
  });

  async function onSubmit(data: DisposalSiteForm) {
    try {
      const res = await toast.promise(
        executeMutation({
          variables: { object: { ...data, project_id: project } },
        }),
        {
          loading: "Creating truck...",
          success: "Truck created",
          error: "Failed to create truck",
        },
      );

      const projectId = res?.data?.insert_disposal_sites_one?.project_id;

      if (!projectId) throw new Error("Cannot find project id in response");

      navigate({
        to: "/projects/$project/disposal-sites",
        params: { project: projectId },
      });
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
          <Typography level="h3">Add Disposal Site</Typography>
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
              label="Disposal Site Name"
              {...register("name")}
              error={errors.name}
            />
          </Box>
          <Button sx={{ mt: 4 }} type="submit" color="success" variant="solid">
            Add Disposal Site
          </Button>
        </form>
      </Box>
    </Box>
  );
}
