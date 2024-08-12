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

const createUserRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "createUser",
  component: lazyRouteComponent(() => import("./users/Create"), "Create"),
  errorComponent: () => "Oh crap!",
});

const editUserRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "editUser/$user",
  component: lazyRouteComponent(() => import("./users/Edit"), "Edit"),
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

const singleProjectUserTasksRoute = createRoute({
  getParentRoute: () => singleProjectUsersHomeRoute,
  path: "$user/tasks",
  component: lazyRouteComponent(() => import("./users/UserTasks"), "UserTasks"),
  errorComponent: () => "Oh crap!",
});

const singleProjectTaskReportRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "task-report",
  component: Outlet,
  errorComponent: () => "Oh crap!",
});

const singleProjectTaskReportHomeRoute = createRoute({
  getParentRoute: () => singleProjectTaskReportRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("./reports/TaskReportTable"),
    "TaskReportTable",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectTrucksHomeRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "trucks",
  component: Outlet,
  errorComponent: () => "Oh crap task report!",
});

const singleProjectTrucksRoute = createRoute({
  getParentRoute: () => singleProjectTrucksHomeRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("./trucks/TrucksTable"),
    "TrucksTable",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectAddNewTruckRoute = createRoute({
  getParentRoute: () => singleProjectTrucksHomeRoute,
  path: "new-truck",
  component: lazyRouteComponent(() => import("./trucks/Create"), "Create"),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectTicketingNamesRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "ticketing-names",
  component: Outlet,
  errorComponent: () => "Oh crap!",
});

const singleProjectTicketingNamesHomeRoute = createRoute({
  getParentRoute: () => singleProjectTicketingNamesRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("./ticketing-names/Table"),
    "TicketingTable",
  ),
  errorComponent: () => "Oh crap!",
});

const singleProjectEditTicketingNameCreateRoute = createRoute({
  getParentRoute: () => singleProjectTicketingNamesRoute,
  path: "create",
  component: lazyRouteComponent(
    () => import("./ticketing-names/Create"),
    "Create",
  ),
  errorComponent: () => "Oh crap!: singleProjectEditTicketingNameCreateRoute",
});

const singleProjectEditTicketingNameRoute = createRoute({
  getParentRoute: () => singleProjectTicketingNamesRoute,
  path: "$ticketingId",
  component: lazyRouteComponent(() => import("./ticketing-names/Edit"), "Edit"),
  errorComponent: () => "Oh crap!: singleProjectEditTicketingNameRoute",
});

const treeRemovalTaskRoute = createRoute({
  getParentRoute: () => singleProjectTaskReportRoute,
  path: "tree-removal/$taskId",
  component: lazyRouteComponent(
    () => import("./reports/TreeRemovalTask"),
    "TreeRemovalTask",
  ),
  errorComponent: () => "Oh crap!",
});

const ticketingTaskRoute = createRoute({
  getParentRoute: () => singleProjectTaskReportRoute,
  path: "ticketing/$taskId",
  component: lazyRouteComponent(
    () => import("./reports/TicketingTask"),
    "TicketingTask",
  ),
  errorComponent: () => "Oh crap!",
});

const singleProjectDisposalSitesHomeRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "disposal-sites",
  component: Outlet,
  errorComponent: () => "Oh crap task report!",
});

const singleProjectDisposalSitesRoute = createRoute({
  getParentRoute: () => singleProjectDisposalSitesHomeRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("./disposal-sites/DisposalSitesTable"),
    "DisposalSitesTable",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectAddNewDisposalSitesRoute = createRoute({
  getParentRoute: () => singleProjectDisposalSitesHomeRoute,
  path: "new-site",
  component: lazyRouteComponent(
    () => import("./disposal-sites/Create"),
    "Create",
  ),
  errorComponent: () => "Oh crap task report!",
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
      createUserRoute,
      editUserRoute,
      singleProjectTrucksHomeRoute.addChildren([
        singleProjectTrucksRoute,
        singleProjectAddNewTruckRoute,
      ]),
      singleProjectDisposalSitesHomeRoute.addChildren([
        singleProjectDisposalSitesRoute,
        singleProjectAddNewDisposalSitesRoute,
      ]),
      singleProjectUsersHomeRoute.addChildren([
        singleProjectUsersRoute,
        singleProjectUserTasksRoute,
      ]),
      singleProjectTaskReportRoute.addChildren([
        singleProjectTaskReportHomeRoute,
        treeRemovalTaskRoute,
        ticketingTaskRoute,
      ]),
      singleProjectTicketingNamesRoute.addChildren([
        singleProjectTicketingNamesHomeRoute,
        singleProjectEditTicketingNameCreateRoute,
        singleProjectEditTicketingNameRoute,
      ]),
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,

  defaultPendingComponent: () => <div>router pending...</div>,
  defaultErrorComponent: () => <div>router error...</div>,
});
