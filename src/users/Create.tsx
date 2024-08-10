import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TCreateUserBody } from "../../api/createUser.mts";
import { InputField, SelectField, SelectFieldOption } from "../components/Form";
import { TServerResponse, inputSx, maxFormWidth } from "../globals";
import { useProjectOptions } from "../projects/hooks";
import { convertToEmail } from "../utils";
import { mutationUpsertUser } from "./hooks";
import { CrateUserForm, createUserValidation } from "./utils";

export function Create() {
  const { data: projectOptions, error, loading } = useProjectOptions();

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (!projectOptions) return <div>no project options</div>;

  return <CreateForm projectOptions={projectOptions} />;
}

export function CreateForm({
  projectOptions,
}: {
  projectOptions: SelectFieldOption[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CrateUserForm>({
    resolver: zodResolver(createUserValidation),
    defaultValues: {
      hire_date: dayjs().format("YYYY-MM-DD"),
      activeProject: "unemployed",
    },
  });

  const { project } = useParams({ from: "/projects/$project/users" });

  const [executeMutation] = useMutation(mutationUpsertUser);
  const navigate = useNavigate();

  async function onSubmit(data: CrateUserForm) {
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
      const parsedActiveProject =
        activeProject === "unemployed" ? null : activeProject;
      const createUser = fetch("/api/users/create", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          activeProject: parsedActiveProject,
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

      await toast.promise(createUser, {
        loading: "Creating user...",
        success: "User created",
        error: "Failed to create user",
      });

      if (parsedActiveProject) {
        navigate({
          to: "/projects/$project/users",
          params: {
            project: parsedActiveProject,
          },
        });
      } else {
        navigate({ to: "/projects/$project/users", params: { project } });
      }
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
              defaultValue="unemployed"
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
