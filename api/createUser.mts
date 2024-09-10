import { Config, Context } from "@netlify/functions";
import { SignUpResponse } from "@nhost/hasura-auth-js";
import axios from "axios";
import { TServerResponse } from "../src/globals";
import { nhostAuthURL } from "./common";

export type TCreateUserBody = {
  email: string;
  password: string;
  activeProject: string | null | undefined;
};

export default async (req: Request, _context: Context) => {
  const { email, password, activeProject } =
    (await req.json()) as TCreateUserBody;

  const res = await axios
    .post<SignUpResponse>(`${nhostAuthURL}/signup/email-password`, {
      email,
      password,
      options: { metadata: { activeProject } },
    })
    .then((res) => res.data)

    .catch((error) => {
      console.error("nhost user signup error", error);
    });

  if (res?.error) {
    return new Response(
      JSON.stringify([
        {
          id: "",
          error: { name: "nhost error", message: JSON.stringify(res.error) },
        },
      ] satisfies TServerResponse<Error>),
      {
        status: res.error.status,
      },
    );
  }

  const userId = res && res.session?.user.id;

  if (!userId) throw new Error("No user id returned from nhost");

  return new Response(
    JSON.stringify([{ id: userId, error: null }] satisfies TServerResponse),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  );
};

export const config: Config = {
  method: "POST",
  path: "/api/users/create",
};
