import { Config, Context } from "@netlify/functions";

export default async (_req: Request, _context: Context) => {
  return new Response(JSON.stringify({ id: "OK" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};

export const config: Config = {
  method: "GET",
  path: "/api/foo",
};
