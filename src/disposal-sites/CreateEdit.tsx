import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { InputField } from "../components/Form";
import { inputSx, maxFormWidth } from "../globals";
import { mutationInsertTruck, useDisposalSiteById } from "./hooks";
import { disposalSiteValidation, type DisposalSiteForm } from "./utils";

function DisposalSiteForm({
  disposalSite,
  project,
}: {
  disposalSite?: DisposalSiteForm;
  project: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DisposalSiteForm>({
    resolver: zodResolver(disposalSiteValidation),
    defaultValues: disposalSite,
  });

  const [executeMutation] = useMutation(mutationInsertTruck);
  const navigate = useNavigate();

  async function onSubmit(data: DisposalSiteForm) {
    try {
      console.log("data", data);
      const res = await toast.promise(
        executeMutation({
          variables: { object: { ...data, project_id: project } },
        }),
        {
          loading: disposalSite
            ? "Updating disposal site..."
            : "Creating disposal site...",
          success: disposalSite
            ? "Disposal site updated"
            : "Disposal site created",
          error: disposalSite
            ? "Failed to update disposal site"
            : "Failed to create disposal site",
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
            {disposalSite ? "Update" : "Create"} Disposal Site
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export function Create() {
  const { project } = useParams({
    from: "/projects/$project/disposal-sites/new-site",
  });

  return <DisposalSiteForm project={project} />;
}

export function Edit() {
  const { project, site } = useParams({
    from: "/projects/$project/disposal-sites/edit-site/$site",
  });
  const { data, loading, error } = useDisposalSiteById(project, site);

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  return <DisposalSiteForm disposalSite={data} project={project} />;
}
