import {
  useAccessToken,
  useAuthenticationStatus,
  useSignInEmailPassword,
} from "@nhost/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dashboard } from "./Dashboard";

type LoginFormData = {
  id: string;
  password: string;
};

function convertToEmail(id: string) {
  return `${id}@desiadms.com`;
}

function Login() {
  const { signInEmailPassword, isLoading, isError } = useSignInEmailPassword();

  const { register, handleSubmit } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    const email = convertToEmail(data.id);
    await signInEmailPassword(email, data.password);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=gray&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            user id
            <input
              type="text"
              {...register("id", { required: "User ID is required" })}
            />
          </div>

          <div>
            password
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          <div>
            <button disabled={isLoading} type="submit">
              Sign in
              {isLoading && <p>loading ...</p>}
            </button>
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

export function AuthWrapper() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const accessToken = useAccessToken();

  useEffect(() => {
    if (accessToken) console.log("token");
  }, [accessToken]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}
