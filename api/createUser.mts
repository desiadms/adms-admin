import { Config, Context } from "@netlify/functions";
import { SignUpResponse } from "@nhost/hasura-auth-js";
import { TServerResponse } from "../src/globals";
import { nhostURL } from "./common.mts";

export type TCreateUserBody = {
  email: string;
  password: string;
  activeProject: string | null | undefined;
};

export default async (req: Request, _context: Context) => {
  const { email, password, activeProject } =
    (await req.json()) as TCreateUserBody;

  const res = (await fetch(`${nhostURL}/signup/email-password`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      options: { metadata: { activeProject } },
    }),
  }).then((res) => res.json())) as SignUpResponse;

  console.log("nhost user signed up", res);

  if (res.error) {
    return new Response(
      JSON.stringify([
        { id: "", error: { name: "nhost error", ...res.error } },
      ] satisfies TServerResponse<Error>),
      {
        status: 500,
      },
    );
  }

  const userId = res.session?.user.id;

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
