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

const singleProjectTaskReportRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "task-report",
  component: () => <div> task report</div>,
  errorComponent: () => "Oh crap!",
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "reports",
  component: () => (
    <Box>
      <TopNav
        links={[
          {
            id: "task-report",
            to: "/reports/task-report",
            label: "Task Report",
            params: {},
          },
          {
            id: "user-report",
            to: "/reports/user-report",
            label: "User Report",
            params: {},
          },
        ]}
      />
      <Outlet />
    </Box>
  ),
  errorComponent: () => "Oh crap!",
});

const taskReportRoute = createRoute({
  getParentRoute: () => reportsRoute,
  path: "task-report",
  component: lazyRouteComponent(
    () => import("./reports/TaskReportTable"),
    "TaskReportTable",
  ),
  errorComponent: () => "Oh crap!",
});

const userReportRoute = createRoute({
  getParentRoute: () => reportsRoute,
  path: "user-report",
  component: lazyRouteComponent(
    () => import("./reports/UserReportTable"),
    "UserReportTable",
  ),
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
  reportsRoute.addChildren([taskReportRoute, userReportRoute]),
  usersRoute.addChildren([usersRouteHome, editUserRoute]),
  projectsRoute.addChildren([
    projectsHomeRoute,
    projectCreateRoute,
    singleProjectRoute.addChildren([
      projectEditRoute,
      singleProjectUsersHomeRoute.addChildren([singleProjectUsersRoute]),
      singleProjectTaskReportRoute,
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,

  defaultPendingComponent: () => <div>router pending...</div>,
  defaultErrorComponent: () => <div>router error...</div>,
});
