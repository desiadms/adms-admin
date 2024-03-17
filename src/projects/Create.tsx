import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdBlock, MdCheck } from "react-icons/md";
import {
  InputField,
  PrettySwitchField,
  TextAreaField,
} from "../components/Form";
import { inputSx, inputWidth, joy4ValueInPx, maxFormWidth } from "../globals";
import { TopNav } from "../nav/Components";
import { mutationUpsertProject } from "./hooks";
import { ProjectForm, projectValidation } from "./utils";

export function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectValidation),
  });

  const [executeMutation] = useMutation(mutationUpsertProject);
  const navigate = useNavigate({ from: "/projects/create" });

  async function onSubmit(data: ProjectForm) {
    try {
      const res = await toast.promise(
        executeMutation({ variables: { project: data } }),
        {
          loading: "Creating project...",
          success: "Project created",
          error: "Failed to create project",
        },
      );

      const projectId = res?.data?.insert_projects_one?.id;

      if (!projectId) throw new Error("Cannot find project id in response");

      navigate({
        to: "/projects/$project/users",
        params: { project: projectId },
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Box>
      <TopNav />
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
          <Typography level="h3">Crate Project</Typography>
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
            <InputField
              sx={inputSx}
              label="poc"
              {...register("poc")}
              error={errors.poc}
            />
            <InputField
              sx={inputSx}
              label="contractor"
              {...register("contractor")}
              error={errors.contractor}
            />
            <InputField
              sx={inputSx}
              label="sub contractor"
              {...register("sub_contractor")}
              error={errors.sub_contractor}
            />
            <InputField
              sx={inputSx}
              label="location"
              {...register("location")}
              error={errors.location}
            />
            <PrettySwitchField
              control={control}
              label={(value) => `Status: ${value ? "Active" : "Inactive"}`}
              name="status"
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
            Create Project
          </Button>
        </form>
      </Box>
    </Box>
  );
}
