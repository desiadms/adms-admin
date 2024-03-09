import { CssBaseline, Divider, Drawer, Stack, Typography } from "@mui/joy";
import {
  CssVarsProvider as JoyCssVarsProvider,
  useColorScheme,
  useTheme,
} from "@mui/joy/styles";
import { Box } from "@mui/system";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { GoOrganization } from "react-icons/go";
import { LuFileClock } from "react-icons/lu";
import { useSingleProjectLinks } from "../projects/hooks";
import { SidebarLink } from "./Components";
import { useSideBar } from "./hooks";

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const { collapsedSidebar } = useSideBar();
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
              label="All Projects"
              icon={<GoOrganization size={18} />}
            />
          </Stack>

          <Stack onClick={() => onItemClick?.()} gap={1}>
            <SidebarLink
              id="reports"
              to="/projects"
              label="Reports"
              icon={<LuFileClock size={18} />}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: 2,
          }}
        >
          <Typography>Something?</Typography>
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
