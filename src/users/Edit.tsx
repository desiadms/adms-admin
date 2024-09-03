import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useProjectOptions } from "../projects/hooks";
import { EditForm } from "./EditUserForm";
import { useUser } from "./hooks";

function Edit({ user }: { user: string }) {
  const { data, error, loading } = useUser(user);
  const {
    data: projectOptions,
    loading: projectLoading,
    error: projectError,
  } = useProjectOptions();

  const formUser = useMemo(() => {
    return {
      id: data?.id || "",
      userId: data?.usersMetadata_user?.email || "",
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      hire_date: data?.hire_date || "",
      activeProject:
        data?.usersMetadata_user?.metadata?.activeProject || "unemployed",
      disabled: data?.disabled || false,
    };
  }, [data]);

  if (loading || projectLoading) return <div>loading</div>;
  if (error || projectError) return <div>error</div>;
  if (!data || !projectOptions.length) return <div>no data</div>;

  return <EditForm user={formUser} projectOptions={projectOptions} />;
}

export function EditFromAllUsers() {
  const { user } = useParams({ from: "/allUsers/editUser/$user" });
  return <Edit user={user} />;
}

export function EditFromProjectUsers() {
  const { user } = useParams({ from: "/projects/$project/editUser/$user" });
  return <Edit user={user} />;
}
