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

const allUsersHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "allUsers",
  component: Outlet,
  errorComponent: () => "Oh crap!",
});

const allUsersRoute = createRoute({
  getParentRoute: () => allUsersHomeRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./users/AllUsers"), "AllUsers"),
  errorComponent: () => "Oh crap!",
});

const globalCreateUserRoute = createRoute({
  getParentRoute: () => allUsersHomeRoute,
  path: "createUser",
  component: lazyRouteComponent(() => import("./users/Create"), "Create"),
  errorComponent: () => "Oh crap!",
});

const globalEditUserRoute = createRoute({
  getParentRoute: () => allUsersHomeRoute,
  path: "editUser/$user",
  component: lazyRouteComponent(
    () => import("./users/Edit"),
    "EditFromAllUsers",
  ),
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
  component: lazyRouteComponent(
    () => import("./users/Edit"),
    "EditFromProjectUsers",
  ),
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
  component: lazyRouteComponent(() => import("./trucks/CreateEdit"), "Create"),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectEditTruckRoute = createRoute({
  getParentRoute: () => singleProjectTrucksHomeRoute,
  path: "edit-truck/$truck",
  component: lazyRouteComponent(() => import("./trucks/CreateEdit"), "Edit"),
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
    () => import("./disposal-sites/CreateEdit"),
    "Create",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectEditDisposalSitesRoute = createRoute({
  getParentRoute: () => singleProjectDisposalSitesHomeRoute,
  path: "edit-site/$site",
  component: lazyRouteComponent(
    () => import("./disposal-sites/CreateEdit"),
    "Edit",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectDebrisTypeHomeRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "debris-types",
  component: Outlet,
  errorComponent: () => "Oh crap task report!",
});

const singleProjectDebrisTypesRoute = createRoute({
  getParentRoute: () => singleProjectDebrisTypeHomeRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("./debris-types/DebrisTypeTable"),
    "DebrisTypeTable",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectAddNewDebrisTypeRoute = createRoute({
  getParentRoute: () => singleProjectDebrisTypeHomeRoute,
  path: "new-debris-type",
  component: lazyRouteComponent(
    () => import("./debris-types/CreateEdit"),
    "Create",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectEditDebrisTypeRoute = createRoute({
  getParentRoute: () => singleProjectDebrisTypeHomeRoute,
  path: "edit-debris-type/$debrisTypeId",
  component: lazyRouteComponent(
    () => import("./debris-types/CreateEdit"),
    "Edit",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectContractorsHomeRoute = createRoute({
  getParentRoute: () => singleProjectRoute,
  path: "contractors",
  component: Outlet,
  errorComponent: () => "Oh crap task report!",
});

const singleProjectContractorsRoute = createRoute({
  getParentRoute: () => singleProjectContractorsHomeRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("./contractors/ContractorsTable"),
    "ContractorsTable",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectAddNewContractorsRoute = createRoute({
  getParentRoute: () => singleProjectContractorsHomeRoute,
  path: "new-contractor",
  component: lazyRouteComponent(
    () => import("./contractors/CreateEdit"),
    "Create",
  ),
  errorComponent: () => "Oh crap task report!",
});

const singleProjectEditContractorsRoute = createRoute({
  getParentRoute: () => singleProjectContractorsHomeRoute,
  path: "edit-contractor/$contractorId",
  component: lazyRouteComponent(
    () => import("./contractors/CreateEdit"),
    "Edit",
  ),
  errorComponent: () => "Oh crap task report!",
});

const taskLogsRoute = createRoute({
  getParentRoute: () => projectsRoute,
  path: "task-logs",
  component: lazyRouteComponent(
    () => import("./task-logs/Table"),
    "TaskLogsTable",
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
  allUsersHomeRoute.addChildren([
    allUsersRoute,
    globalEditUserRoute,
    globalCreateUserRoute,
  ]),
  projectsRoute.addChildren([
    taskLogsRoute,
    projectsHomeRoute,
    projectCreateRoute,
    singleProjectRoute.addChildren([
      projectEditRoute,
      createUserRoute,
      editUserRoute,
      singleProjectTrucksHomeRoute.addChildren([
        singleProjectTrucksRoute,
        singleProjectAddNewTruckRoute,
        singleProjectEditTruckRoute,
      ]),
      singleProjectDisposalSitesHomeRoute.addChildren([
        singleProjectDisposalSitesRoute,
        singleProjectAddNewDisposalSitesRoute,
        singleProjectEditDisposalSitesRoute,
      ]),
      singleProjectDebrisTypeHomeRoute.addChildren([
        singleProjectDebrisTypesRoute,
        singleProjectAddNewDebrisTypeRoute,
        singleProjectEditDebrisTypeRoute,
      ]),
      singleProjectContractorsHomeRoute.addChildren([
        singleProjectContractorsRoute,
        singleProjectAddNewContractorsRoute,
        singleProjectEditContractorsRoute,
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
