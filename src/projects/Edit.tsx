import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdBlock, MdCheck } from "react-icons/md";

import {
  InputField,
  PrettySwitchField,
  TextAreaField,
} from "../components/Form";
import {
  deleteAllProjectImagesMutation,
  deleteAllTasksMutation,
  deleteProjectMutation,
  deleteProjectRelatedDataMutation,
  deleteTaskIdsMutation,
  mutationUpsertProject,
  useProject,
} from "./hooks";

import { useNavigate } from "@tanstack/react-router";
import { inputSx, inputWidth, joy4ValueInPx, maxFormWidth } from "../globals";
import { nhost } from "../nhost";
import { ProjectForm, projectValidation } from "./utils";

export function EditForm({ project }: { project: ProjectForm }) {
  const projectId = project.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectValidation),
    defaultValues: project,
  });

  const [executeMutation] = useMutation(mutationUpsertProject);

  const [executeProjectImagesDelete] = useMutation(
    deleteAllProjectImagesMutation,
  );
  const [executeProjectTasksDelete] = useMutation(deleteAllTasksMutation);
  const [executeProjectTaskIdsDelete] = useMutation(deleteTaskIdsMutation);
  const [executeProjectDataDelete] = useMutation(
    deleteProjectRelatedDataMutation,
  );
  const [executeProjectDelete] = useMutation(deleteProjectMutation);
  const navigate = useNavigate({ from: "/projects/$project/edit" });

  async function onSubmit(data: ProjectForm) {
    try {
      toast.promise(executeMutation({ variables: { project: data } }), {
        loading: "Saving Edits...",
        success: "Edits Saved",
        error: "Failed to save edits",
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteMutations() {
    try {
      const deletedImages = await toast.promise(
        executeProjectImagesDelete({
          variables: {
            projectId,
          },
        }),
        {
          loading: "Deleting images medatada...",
          success: "Images metadata deleted",
          error: "Failed to delete images metadata",
        },
      );

      await toast.promise(
        Promise.all(
          deletedImages.data?.delete_images?.returning?.map(async (image) => {
            await nhost.storage.delete({ fileId: image.id });
          }) || [],
        ),
        {
          loading: "Deleting images from storage...",
          success: "Images deleted from storage",
          error: "Failed to delete images from storage",
        },
      );

      const allTasksDeleted = await toast.promise(
        executeProjectTasksDelete({
          variables: {
            projectId,
          },
        }),
        {
          loading: "Deleting project tasks...",
          success: "Project tasks deleted",
          error: "Failed to delete project tasks",
        },
      );

      const deletedTaskIds =
        allTasksDeleted.data?.delete_tasks_collection?.returning?.map(
          (task) => task.id,
        );

      await toast.promise(
        executeProjectTaskIdsDelete({
          variables: {
            taskIds: deletedTaskIds || [],
          },
        }),
        {
          loading: "Deleting project task ids...",
          success: "Project task ids deleted",
          error: "Failed to delete project task ids",
        },
      );

      await toast.promise(
        executeProjectDataDelete({
          variables: {
            projectId,
          },
        }),
        {
          loading: "Deleting project related data...",
          success: "Project related data deleted",
          error: "Failed to delete project related data",
        },
      );

      await toast.promise(
        executeProjectDelete({
          variables: {
            projectId,
          },
        }),
        {
          loading: "Deleting project...",
          success: "Project deleted",
          error: "Failed to delete project",
        },
      );

      navigate({ to: "/projects" });
    } catch (e) {
      console.error(e);
    }
  }

  function deleteProjectCallback() {
    const userInput = window.prompt(
      'Type "delete" to confirm the deletion of the project.',
    );
    if (userInput === "delete") {
      deleteMutations();
    } else {
      alert('Deletion cancelled. You must type "delete" to confirm.');
    }
  }

  return (
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
        <Typography level="h3">Edit Project</Typography>
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
            label="applicant"
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
          Save Edits
        </Button>
      </form>
      <Divider sx={{ my: 4 }} />
      <Button onClick={deleteProjectCallback} color="danger">
        Delete Project
      </Button>
    </Box>
  );
}

export function Edit() {
  const { data, loading } = useProject();

  return (
    <Box>
      {loading ? <div> loading </div> : data && <EditForm project={data} />}
    </Box>
  );
}
