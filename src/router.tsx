import { Box } from "@mui/joy";
import {
  Navigate,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { AuthWrapper } from "./components/AuthWrapper";
import { TopNav } from "./nav/Components";

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

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "users",
  component: () => (
    <Box>
      <TopNav />
      <Outlet />
    </Box>
  ),
  errorComponent: () => "Oh crap!",
});

const usersRouteHome = createRoute({
  getParentRoute: () => usersRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./users/AllUsers"), "Users"),
  errorComponent: () => "Oh crap!",
});

const editUserRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: "$user",
  component: lazyRouteComponent(() => import("./users/Edit"), "Edit"),
  errorComponent: () => "Oh crap!",
});

const createUsersFromAllUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "createUser",
  component: lazyRouteComponent(() => import("./users/Create"), "Create"),
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

const singleProjectUsersHomeRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "users",
  component: Outlet,
  errorComponent: () => "Oh crap!",
});

const singleProjectUsersRoute = createRoute({
  getParentRoute: () => singleProjectUsersHomeRoute,
  path: "/",
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
  createUsersFromAllUsersRoute,
  usersRoute.addChildren([usersRouteHome, editUserRoute]),
  projectsRoute.addChildren([
    projectsHomeRoute,
    projectCreateRoute,
    singleProjectRoute.addChildren([
      projectEditRoute,
      singleProjectUsersHomeRoute.addChildren([singleProjectUsersRoute]),
      singleProjectTasksRoute,
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,

  defaultPendingComponent: () => <div>router pending...</div>,
  defaultErrorComponent: () => <div>router error...</div>,
});
