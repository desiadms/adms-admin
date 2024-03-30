import { CssBaseline, Divider, Drawer, Stack } from "@mui/joy";
import {
  CssVarsProvider as JoyCssVarsProvider,
  useColorScheme,
  useTheme,
} from "@mui/joy/styles";
import { Box } from "@mui/system";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { GoOrganization } from "react-icons/go";
import { LuFileArchive, LuUser } from "react-icons/lu";
import { useSingleProjectLinks } from "../projects/hooks";
import { SidebarLink } from "./Components";
import { useSideBar } from "./hooks";

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const { collapsedSidebar, toggleSidebar } = useSideBar();
  const links = useSingleProjectLinks();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: 2,
          px: collapsedSidebar ? 1 : 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ...(collapsedSidebar && {
                width: "100%",
              }),
            }}
          >
            DESI
          </Box>
          <Box
            onClick={() => toggleSidebar(!collapsedSidebar)}
            sx={{
              ...(collapsedSidebar && {
                width: "100%",
              }),
              display: {
                xs: collapsedSidebar ? "none" : "flex",
                md: "flex",
              },
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                opacity: 0.8,
              },
              cursor: "pointer",
              transform: collapsedSidebar ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.59 6.47a.75.75 0 0 0-1.06 0l-5.06 5a.75.75 0 0 0 0 1.06l5.06 5a.75.75 0 0 0 1.05-1.06l-3.76-3.72H21a.75.75 0 0 0 0-1.5H9.82l3.76-3.72c.3-.29.3-.76 0-1.06Z"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 3.25a.75.75 0 0 0-.75.75v16a.75.75 0 0 0 1.5 0V4A.75.75 0 0 0 3 3.25Z"
              ></path>
            </svg>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "gray" }} />
      </Box>
      <Box
        sx={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
          pb: 2,
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            px: 2,
          }}
        >
          <Stack onClick={() => onItemClick?.()}>
            <SidebarLink
              id="all-projects"
              to="/projects"
              label="Projects"
              icon={<GoOrganization size={18} />}
            />
          </Stack>

          <Stack onClick={() => onItemClick?.()} gap={1}>
            <SidebarLink
              id="all-users"
              to="/users"
              label="Users"
              icon={<LuUser size={18} />}
            />
          </Stack>
          <Stack onClick={() => onItemClick?.()} gap={1}>
            <SidebarLink
              id="task-report"
              to="/reports/task-report"
              label="Task Report"
              icon={<LuFileArchive size={18} />}
            />
          </Stack>

          {links && (
            <Stack
              sx={{
                display: {
                  sm: "flex",
                  md: "none",
                },
              }}
            >
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Stack>
                {links.map(({ label, to, params, id }) => (
                  <SidebarLink
                    id={id}
                    key={label}
                    to={to}
                    params={params}
                    label={label}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
}

function Sidebar() {
  const theme = useTheme();

  const { sideBarWidth, openSideBarWidth, collapsedSidebar, toggleSidebar } =
    useSideBar();

  return (
    <>
      <Drawer
        anchor="left"
        disableScrollLock={true}
        open={!collapsedSidebar}
        onClose={() => toggleSidebar(false)}
        sx={{
          borderRadius: 0,
          position: "fixed",
          width: openSideBarWidth,
          height: "100dvh",
          display: {
            sm: "flex",
            md: "none",
          },
          flexDirection: "column",
          m: 0,
          gap: 2,
        }}
      >
        <Stack
          gap={2}
          flexGrow={1}
          sx={{
            background: theme.palette.background.body,
          }}
        >
          <SidebarContent onItemClick={() => toggleSidebar(false)} />
        </Stack>
      </Drawer>
      <Box
        sx={{
          borderRadius: 0,
          position: "fixed",
          width: sideBarWidth,
          height: "100dvh",
          display: {
            xs: "none",
            md: "flex",
          },
          flexDirection: "column",
          borderRight: (theme) =>
            theme.palette.mode === "dark"
              ? `1px solid ${theme.palette.neutral[700]}`
              : `1px solid ${theme.palette.neutral[200]}`,
          m: 0,
          gap: 2,
        }}
      >
        <SidebarContent />
      </Box>
    </>
  );
}

function ToasterContainer() {
  const { mode } = useColorScheme();

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        style: {
          ...(mode === "light"
            ? {}
            : {
                background: "#363636",
                color: "#fff",
              }),
          textAlign: "center",
        },
      }}
    />
  );
}

export function Dashboard() {
  const { sideBarWidth } = useSideBar();

  return (
    <JoyCssVarsProvider>
      <CssBaseline enableColorScheme />
      <ToasterContainer />
      <Sidebar />
      <Box
        sx={{
          width: {
            sm: "100%",
            md: `calc(100% - ${sideBarWidth}px)`,
          },
          position: "relative",
          left: {
            sm: 0,
            md: sideBarWidth,
          },
        }}
      >
        <Box>
          <Outlet />
        </Box>
      </Box>
    </JoyCssVarsProvider>
  );
}
