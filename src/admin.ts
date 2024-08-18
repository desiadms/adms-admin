import { useMutation, useQuery } from "@apollo/client";
import { graphql } from "./graphql";
import { useAuth } from "./nhost";

const queryUserSettings = graphql(/* GraphQL */ `
  query UserSettings($id: uuid!) {
    usersMetadata_by_pk(id: $id) {
      id
      settings
    }
  }
`);

const mutateUserSettings = graphql(/* GraphQL */ `
  mutation UserSettingMutation($id: uuid!, $settings: jsonb!) {
    update_usersMetadata_by_pk(
      pk_columns: { id: $id }
      _set: { settings: $settings }
    ) {
      id
    }
  }
`);

type TSettings = {
  darkMode?: boolean;
};

export function useUserSettings() {
  const { userData } = useAuth();

  const userSettings = useQuery(queryUserSettings, {
    variables: {
      id: (userData && userData.id)!,
    },
    skip: !userData?.id,
  });

  const settings = userSettings.data?.usersMetadata_by_pk?.settings;
  const parsedSettings = settings ? (settings as TSettings) : {};

  return {
    userSettings: parsedSettings,
  };
}

export function useDarkMode() {
  const { userSettings } = useUserSettings();
  return userSettings?.darkMode;
}

export function useMutateUserSettings() {
  const { userData } = useAuth();

  if (!userData) {
    throw new Error("No user data");
  }

  const { userSettings } = useUserSettings();
  const [mutate] = useMutation(mutateUserSettings);

  return async (settings: TSettings) => {
    const newSettings = { ...userSettings, ...settings };
    await mutate({
      variables: {
        id: userData?.id,
        settings: newSettings,
      },
      update: (cache) => {
        cache.evict({ fieldName: "usersMetadata_by_pk" });
      },
    });
  };
}
