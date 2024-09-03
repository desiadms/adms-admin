import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Typography,
} from "@mui/joy";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  InputField,
  SelectField,
  SelectFieldOption,
  SwitchField,
} from "../components/Form";
import { inputSx, maxFormWidth } from "../globals";
import {
  deleteUserMutation,
  mutationUpdateUserMetadata,
  mutationUpsertUser,
} from "./hooks";
import { EditUserForm, editUserValidation } from "./utils";

export function EditForm({
  user,
  projectOptions,
}: {
  user: EditUserForm;
  projectOptions: SelectFieldOption[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserValidation),
    defaultValues: user,
  });

  const [executeMutation] = useMutation(mutationUpsertUser);
  const [executeMedatataMutation] = useMutation(mutationUpdateUserMetadata);
  const [executeDeleteUserMutation] = useMutation(deleteUserMutation);

  async function onSubmit(data: EditUserForm) {
    const { first_name, hire_date, last_name, id, activeProject, disabled } =
      data;

    try {
      const parsedActiveProject =
        activeProject === "unemployed" ? null : activeProject;

      const userMutation = executeMutation({
        variables: {
          id,
          disabled,
          user: {
            id,
            first_name,
            hire_date,
            last_name,
          },
        },
      });

      let metadataMutation: Promise<unknown> = Promise.resolve();

      if (parsedActiveProject !== user?.activeProject) {
        metadataMutation = executeMedatataMutation({
          variables: {
            id,
            metadata: { activeProject: parsedActiveProject },
          },
        });
      }

      await toast.promise(Promise.all([userMutation, metadataMutation]), {
        loading: "Updating user...",
        success: "User Updated",
        error: "Failed to update user",
      });
    } catch (e) {
      console.error(e);
    }
  }

  function deleteUserCallback() {
    const userInput = window.prompt(
      'Type "delete" to confirm the deletion of the user.',
    );
    if (userInput === "delete") {
      toast.promise(
        executeDeleteUserMutation({
          variables: {
            id: user.id,
          },
        }),
        {
          loading: "Deleting user...",
          success: "User deleted",
          error: "Failed to delete user",
        },
      );
    } else {
      alert('Deletion cancelled. You must type "delete" to confirm.');
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
          <Typography level="h3">Edit User</Typography>
          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 4,
            }}
          >
            <InputField
              disabled
              sx={inputSx}
              label="PIN"
              {...register("userId")}
              error={errors.userId}
            />

            <InputField
              sx={inputSx}
              label="first name"
              {...register("first_name")}
              error={errors.first_name}
            />
            <InputField
              sx={inputSx}
              label="last name"
              {...register("last_name")}
              error={errors.last_name}
            />

            <InputField
              sx={inputSx}
              label="hire date"
              type="date"
              {...register("hire_date")}
              error={errors.hire_date}
            />

            <SelectField
              sx={inputSx}
              label="active project"
              name="activeProject"
              control={control}
              defaultValue={user.activeProject ?? "unemployed"}
              options={projectOptions || []}
              error={errors.activeProject}
            />
            <SwitchField
              name="disabled"
              control={control}
              label="disabled"
              error={errors.disabled}
            />

            <FormControl sx={inputSx}>
              <FormLabel sx={{ textTransform: "capitalize" }}>
                Reset Password
              </FormLabel>
              <Button type="button" color="neutral" variant="outlined">
                Create New Password
              </Button>
            </FormControl>
          </Box>
          <Button sx={{ mt: 4 }} type="submit" color="success" variant="solid">
            Edit User
          </Button>
        </form>
        <Divider sx={{ my: 4 }} />
        <Button onClick={deleteUserCallback} color="danger">
          Delete User
        </Button>
      </Box>
    </Box>
  );
}
