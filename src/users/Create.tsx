import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useSignUpEmailPassword } from "@nhost/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { InputField } from "../components/Form";
import { inputSx, maxFormWidth } from "../globals";
import { convertToEmail } from "../utils";
import { mutationUpsertUser } from "./hooks";
import { UserForm, userValidation } from "./utils";

export function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userValidation),
  });

  const { project } = useParams({ from: "/projects/$project/users/create" });

  const {
    signUpEmailPassword,
    needsEmailVerification,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useSignUpEmailPassword();

  console.log({ needsEmailVerification, isLoading, isSuccess, isError, error });
  const [executeMutation] = useMutation(mutationUpsertUser);

  const navigate = useNavigate({ from: "/projects/create" });

  async function onSubmit(data: UserForm) {
    const { first_name, hire_date, last_name, password, userId } = data;

    const email = convertToEmail(userId);
    try {
      const createUser = signUpEmailPassword(email, password).then((res) => {
        const id = res.user?.id;

        const error = res.isError;
        console.log("in hereee", res);

        if (error) {
          throw new Error(`Failed to create user: ${res.error?.message}`);
        }

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
              label="hire"
              type="date"
              {...register("hire_date")}
              error={errors.hire_date}
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
