import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { InputField } from "../components/Form";
import { inputSx, maxFormWidth } from "../globals";
import { mutationInsertContractor, useContractorById } from "./hooks";
import { contractorValidation, type ContractorForm } from "./utils";

function DebrisTypeForm({
  contractor,
  project,
}: {
  contractor?: ContractorForm;
  project: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractorForm>({
    resolver: zodResolver(contractorValidation),
    defaultValues: contractor,
  });

  const [executeMutation] = useMutation(mutationInsertContractor);
  const navigate = useNavigate();

  async function onSubmit(data: ContractorForm) {
    try {
      const res = await toast.promise(
        executeMutation({
          variables: { object: { ...data, project_id: project } },
        }),
        {
          loading: contractor
            ? "Updating contractor..."
            : "Creating contractor...",
          success: contractor ? "Contractor updated" : "Contractor created",
          error: contractor
            ? "Failed to update contractor"
            : "Failed to create contractor",
        },
      );

      const projectId = res?.data?.insert_contractors_one?.project_id;

      if (!projectId) throw new Error("Cannot find project id in response");

      navigate({
        to: "/projects/$project/contractors",
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
            {contractor ? "Edit" : "Add"} Contractor
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
              label="contractor name"
              {...register("name")}
              error={errors.name}
            />
          </Box>
          <Button sx={{ mt: 4 }} type="submit" color="success" variant="solid">
            {contractor ? "Update" : "Create"} Contractor
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export function Create() {
  const { project } = useParams({
    from: "/projects/$project/contractors/new-contractor",
  });

  return <DebrisTypeForm project={project} />;
}

export function Edit() {
  const { project, contractorId } = useParams({
    from: "/projects/$project/contractors/edit-contractor/$contractorId",
  });
  const { data, loading, error } = useContractorById(project, contractorId);

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  return <DebrisTypeForm contractor={data} project={project} />;
}
