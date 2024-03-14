import { ApolloProvider } from "@apollo/client";
import { Button, FormControl, FormLabel, Input, Sheet, Typography } from "@mui/joy";
import { useSignInEmailPassword } from "@nhost/react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { createApolloClient } from "../graphqlClient";
import { Dashboard } from "../nav/Dashboard";
import { useAuth } from "../nhost";

type LoginFormData = {
  id: string;
  password: string;
};

function convertToEmail(id: string) {
  return `${id}@desiadms.com`;
}

export function Login() {
  const { signInEmailPassword, isLoading, isError } = useSignInEmailPassword();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    const email = convertToEmail(data.id);
    await signInEmailPassword(email, data.password);
    navigate({ to: "/projects" });
  }

  return (
    <>
      <main>
        <Sheet
          sx={{
            width: 300,
            mx: 'auto',
            my: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}
          variant="outlined"
        >
          <div>
            <Typography level="h4" component="h1">
              <b>Welcome!</b>
            </Typography>
            <Typography level="body-sm">Sign in to your account.</Typography>
          </div>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              {...register("id", { required: "User ID is required" })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", { required: "Password is required" })}
            />
          </FormControl>
          <Button sx={{ mt: 1 }} onClick={handleSubmit(onSubmit)}>
            {isLoading ? 'loading' : 'Sign in'}
          </Button>
          {isError && <div> Error signing in</div>}
        </Sheet>
      </main>
    </>
  );
}

function FullPageSpinner() {
  return (
    <div className="absolute w-screen h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex justify-center items-center h-full">loading</div>
    </div>
  );
}

export function AuthorizedApolloProvider() {
  const { accessToken } = useAuth();

  const client = useMemo(() => createApolloClient(accessToken), [accessToken]);

  return (
    <ApolloProvider client={client}>
      <Dashboard />
    </ApolloProvider>
  );
}

export function AuthWrapper() {
  const {
    authenticationStatus: { isAuthenticated, isLoading },
  } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated && !isLoading) {
    return <Login />;
  }

  return <AuthorizedApolloProvider />;
}
