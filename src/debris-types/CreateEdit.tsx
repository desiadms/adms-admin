import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { InputField } from "../components/Form";
import { inputSx, maxFormWidth } from "../globals";
import { mutationInsertDebrisType, useDebrisTypeById } from "./hooks";
import { debrisTypeValidation, type DebrisTypeForm } from "./utils";

function DebrisTypeForm({
  debrisType,
  project,
}: {
  debrisType?: DebrisTypeForm;
  project: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DebrisTypeForm>({
    resolver: zodResolver(debrisTypeValidation),
    defaultValues: debrisType,
  });

  const [executeMutation] = useMutation(mutationInsertDebrisType);
  const navigate = useNavigate();

  async function onSubmit(data: DebrisTypeForm) {
    try {
      const res = await toast.promise(
        executeMutation({
          variables: { object: { ...data, project_id: project } },
        }),
        {
          loading: debrisType
            ? "Updating debris site..."
            : "Creating debris site...",
          success: debrisType ? "Debris site updated" : "Debris site created",
          error: debrisType
            ? "Failed to update debris site"
            : "Failed to create debris site",
        },
      );

      const projectId = res?.data?.insert_debris_types_one?.project_id;

      if (!projectId) throw new Error("Cannot find project id in response");

      navigate({
        to: "/projects/$project/debris-types",
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
          <Typography level="h3">
            {" "}
            {debrisType ? "Edit" : "Add"} Debris Type
          </Typography>
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
              label="Debris Type Name"
              {...register("name")}
              error={errors.name}
            />
          </Box>
          <Button sx={{ mt: 4 }} type="submit" color="success" variant="solid">
            {debrisType ? "Update" : "Create"} Debris Site
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export function Create() {
  const { project } = useParams({
    from: "/projects/$project/debris-types/new-debris-type",
  });

  return <DebrisTypeForm project={project} />;
}

export function Edit() {
  const { project, debrisTypeId } = useParams({
    from: "/projects/$project/debris-types/edit-debris-type/$debrisTypeId",
  });
  const { data, loading, error } = useDebrisTypeById(project, debrisTypeId);

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  return <DebrisTypeForm debrisType={data} project={project} />;
}
