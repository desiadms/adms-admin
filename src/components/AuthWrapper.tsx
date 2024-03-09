import { ApolloProvider } from "@apollo/client";
import { Button, Input } from "@mui/joy";
import { useSignInEmailPassword } from "@nhost/react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            user id
            <Input
              type="text"
              {...register("id", { required: "User ID is required" })}
            />
          </div>

          <div>
            password
            <Input
              type="password"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          <div>
            <Button disabled={isLoading} type="submit">
              Sign in
              {isLoading && <p>loading ...</p>}
            </Button>
            {isError && <div> Error signing in</div>}
          </div>
        </form>
      </div>
    </div>
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
    accessToken,
    authenticationStatus: { isAuthenticated, isLoading },
  } = useAuth();

  useEffect(() => {
    if (accessToken) console.log("token");
  }, [accessToken]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated && !isLoading) {
    return <Login />;
  }

  return <AuthorizedApolloProvider />;
}
