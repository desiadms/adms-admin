import {
  Navigate,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { AuthWrapper } from "./components/AuthWrapper";

const rootRoute = createRootRoute({
  component: () => <AuthWrapper />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/projects" />,
  errorComponent: () => "Oh crap!",
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "projects",
  component: Outlet,
  errorComponent: () => "Oh crap!",
});

const projectsHomeRoute = createRoute({
  getParentRoute: () => projectsRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("./projects/Projects"),
    "Projects",
  ),
  errorComponent: () => "Oh crap!",
});

const projectCreateRoute = createRoute({
  getParentRoute: () => projectsRoute,
  path: "create",
  component: lazyRouteComponent(() => import("./projects/Create"), "Create"),
  errorComponent: () => "Oh crap!",
});

const singleProjectRoute = createRoute({
  getParentRoute: () => projectsRoute,
  path: "$project",
  component: lazyRouteComponent(() => import("./projects/Project"), "Project"),
  errorComponent: () => "Oh crap!",
});

const projectEditRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "edit",
  component: lazyRouteComponent(() => import("./projects/Edit"), "Edit"),
  errorComponent: () => "Oh crap!",
});

const singleProjectUsersRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "users",
  component: lazyRouteComponent(
    () => import("./users/ProjectUsers"),
    "ProjectUsers",
  ),
  errorComponent: () => "Oh crap!",
});

const singleProjectTasksRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "tasks",
  component: () => <div> tasks</div>,
  errorComponent: () => "Oh crap!",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const routeTree = rootRoute.addChildren([
  homeRoute,
  projectsRoute.addChildren([
    projectsHomeRoute,
    projectCreateRoute,
    singleProjectRoute.addChildren([
      projectEditRoute,
      singleProjectUsersRoute,
      singleProjectTasksRoute,
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,

  defaultPendingComponent: () => <div>router pending...</div>,
  defaultErrorComponent: () => <div>router error...</div>,
});
