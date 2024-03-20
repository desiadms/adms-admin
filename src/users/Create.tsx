import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TCreateUserBody } from "../../api/createUser.mts";
import { InputField, SelectField } from "../components/Form";
import { TServerResponse, inputSx, maxFormWidth } from "../globals";
import { useProjectOptions } from "../projects/hooks";
import { convertToEmail } from "../utils";
import { mutationUpsertUser } from "./hooks";
import { UserForm, userValidation } from "./utils";

export function Create() {
  const { project } = useParams({ from: "/projects/$project/users/create" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UserForm>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      hire_date: dayjs().format("YYYY-MM-DD"),
      activeProject: project,
    },
  });

  const { data: projectOptions } = useProjectOptions();
  const [executeMutation] = useMutation(mutationUpsertUser);

  const navigate = useNavigate({ from: "/projects/create" });

  async function onSubmit(data: UserForm) {
    const {
      first_name,
      hire_date,
      last_name,
      password,
      userId,
      activeProject,
    } = data;

    const email = convertToEmail(userId);
    try {
      const createUser = fetch("/api/users/create", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          activeProject,
        } satisfies TCreateUserBody),
      })
        .then((res) => res.json() as Promise<TServerResponse>)
        .then((res) => {
          const id = res?.[0]?.id;

          if (!id) throw new Error("Cannot find user id in response");

          return executeMutation({
            variables: {
              user: {
                id,
                first_name,
                hire_date,
                last_name,
              },
            },
          });
        });

      const res = await toast.promise(createUser, {
        loading: "Creating user...",
        success: "User created",
        error: "Failed to create user",
      });

      const userId = res.data?.insert_usersMetadata_one?.id;

      if (!userId) throw new Error("Cannot find project id in response");

      navigate({
        to: "/projects/$project/users/$user",
        params: { project, user: userId },
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
          <Typography level="h3">Create User</Typography>
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
              label="user id"
              {...register("userId", {
                required: "Email is required",
              })}
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
              label="password"
              {...register("password")}
              error={errors.password}
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
              options={projectOptions || []}
              error={errors.activeProject}
            />
          </Box>

          <Button sx={{ mt: 4 }} type="submit" color="success" variant="solid">
            Create User
          </Button>
        </form>
      </Box>
    </Box>
  );
}
