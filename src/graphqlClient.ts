import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ClientOptions, createClient as createWSClient } from "graphql-ws";

let timedOut: NodeJS.Timeout;
const client: ReturnType<typeof createWSClient> | undefined = undefined;
const timeoutDuration = 5_000;
export function wsClientOpts(url: string, getAccessTokenSilently: TGetToken) {
  const opts: ClientOptions = {
    url: url.replace("http", "ws"),
    keepAlive: timeoutDuration,
    connectionParams: async () => {
      const tok = await getAccessTokenSilently();

      return {
        headers: {
          authorization: `Bearer ${tok}`,
        },
      };
    },
    on: {
      opened: (e) => {
        console.log("ws opened", e);
      },
      closed: (e) => {
        console.log("ws closed", e);
      },
      ping: (received) => {
        if (!received /* sent */) {
          timedOut = setTimeout(() => {
            // a close event `4499: Terminated` is issued to the current WebSocket and an
            // artificial `{ code: 4499, reason: 'Terminated', wasClean: false }` close-event-like
            // object is immediately emitted without waiting for the one coming from `WebSocket.onclose`
            //
            // calling terminate is not considered fatal and a connection retry will occur as expected
            //
            // see: https://github.com/enisdenjo/graphql-ws/discussions/290
            client?.terminate();
          }, timeoutDuration);
        }
      },
      pong: (received) => {
        if (received) {
          clearTimeout(timedOut);
        }
      },
    },
  };
  return opts;
}

type TGetToken = () => Promise<string | undefined>;

export function createApolloClient(token: string | null) {
  const cache = new InMemoryCache();
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_HASURA_URL,
  });

  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
    connectToDevTools: import.meta.env.MODE === "development",
  });

  if (client) {
    return client;
  } else {
    throw new Error(`No client found`);
  }
}
