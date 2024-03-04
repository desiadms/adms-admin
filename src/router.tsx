import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AuthWrapper } from "./components/AuthWrapper";
import { Home } from "./components/Dashboard";

const rootRoute = createRootRoute({
  component: () => <AuthWrapper />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Home />,
  errorComponent: () => "Oh crap!",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const routeTree = rootRoute.addChildren([homeRoute]);

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <div>router pending...</div>,
  defaultErrorComponent: () => <div>router error...</div>,
});
