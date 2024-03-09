import {
  NhostClient,
  useAccessToken,
  useAuthenticationStatus,
  useSignOut,
  useUserData,
} from "@nhost/react";

export const devMode = import.meta.env.MODE === "development";

export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
});

export function useAuth() {
  const accessToken = useAccessToken();
  const userData = useUserData();
  const authenticationStatus = useAuthenticationStatus();
  const { signOut } = useSignOut();

  return {
    accessToken,
    userData,
    authenticationStatus,
    signOut,
  };
}
