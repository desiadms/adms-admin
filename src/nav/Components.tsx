import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import {
  Box,
  Button,
  Dropdown,
  Input,
  ListDivider,
  ListItemButton,
  ListItemButtonTypeMap,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useColorScheme, useTheme } from "@mui/joy/styles";
import { SxProps, Theme } from "@mui/joy/styles/types";
import {
  LinkOptions,
  Link as RouterLink,
  useRouterState,
} from "@tanstack/react-router";
import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FaUser } from "react-icons/fa";
import {
  FiHelpCircle,
  FiLogOut,
  FiMoon,
  FiSettings,
  FiSun,
} from "react-icons/fi";
import { GoChevronDown, GoChevronRight } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { MdStarOutline, MdStarRate } from "react-icons/md";
import { useDarkMode, useMutateUserSettings } from "../admin";
import Link from "../components/Link";
import { headerHeight } from "../globals";
import { useAuth } from "../nhost";
import { useProject, useProjects } from "../projects/hooks";
import { useSideBar } from "./hooks";

export function OrgSearchItems({ handleClick }: { handleClick: () => void }) {
  const projects = useProjects();
  const [query, setQuery] = useState("");
  const projectLinks = projects?.data?.map(
    (project) =>
      ({
        id: project.id.toString(),
        to: "/projects/$project/users",
        params: { project: project.id.toString() },
        label: project.name,
      } as const),
  );

  const sortedProjects = projectLinks?.filter((project) =>
    project.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ErrorBoundary fallback={<div>error</div>}>
      <ProjectSearchInput setQuery={(e) => setQuery(e.target.value)} />
      <Box
        sx={{
          mt: 2,
          overflowY: "auto",
          gap: 0.4,
          display: "flex",
          flexDirection: "column",
          maxHeight: 200,
        }}
      ></Box>
      <Box
        sx={{
          maxHeight: 200,
          gap: 0.4,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {sortedProjects?.map(({ label, to, params, id }) => (
          <SidebarItem
            key={id}
            id={id}
            label={label.toLowerCase()}
            to={to}
            params={params}
            handleClick={handleClick}
            smartLink={{
              pathParam: "/projects",
              replacementPath: "/projects/$project",
              defaultPath: "/projects/$project/users",
            }}
          />
        ))}
      </Box>
    </ErrorBoundary>
  );
}

export function ProjectPopup() {
  const projectName = useProject()?.name;

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const handleItemClick = () => {
    setAnchor(null);
  };

  const open = Boolean(anchor);

  return (
    <>
      <Button variant="outlined" size="sm" onClick={handleClick}>
        <Typography
          sx={{
            maxWidth: {
              xs: 80,
              sm: 150,
              md: 250,
            },
          }}
          overflow={"hidden"}
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          level="body-xs"
        >
          {projectName || "Projects"}
        </Typography>
      </Button>
      <ClickAwayListener
        disableReactTree
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={handleItemClick}
      >
        <BasePopup
          style={{
            zIndex: 1000,
          }}
          id="project-popup"
          offset={4}
          open={open}
          anchor={anchor}
          placement="bottom-end"
        >
          <Sheet
            variant="outlined"
            sx={(theme) => ({
              background: theme.palette.background.body,
              padding: 2,
              borderRadius: theme.radius.md,
              zIndex: 1000,
            })}
          >
            <OrgSearchItems handleClick={handleItemClick} />
          </Sheet>
        </BasePopup>
      </ClickAwayListener>
    </>
  );
}

const sideBarLinkStyle: SxProps = {
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    textDecoration: "none",
  },
  width: "100%",
};

function sideBarTopLinkStyle(sideBarCollpased: boolean | undefined): SxProps {
  return {
    display: "flex",
    width: "100%",
    justifyContent: sideBarCollpased ? "center" : "space-between",
    alignItems: "center",
    padding: "0.8rem 1rem",
    cursor: "pointer",
    borderRadius: 10,
    fontWeight: 500,
  };
}

const sideBarTopLinkBackground = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? theme.palette.neutral[800]
    : theme.palette.neutral[100];

export function SidebarLink({
  label,
  to,
  params,
  icon,
}: Omit<LinkEntry, "params"> & {
  icon?: ReactNode;
  params?: LinkEntry["params"];
}) {
  const { collapsedSidebar } = useSideBar();
  const {
    location: { pathname },
  } = useRouterState();
  return (
    <Link sx={sideBarLinkStyle} to={to} params={params} search={(prev) => prev}>
      <Box
        sx={{
          ...sideBarTopLinkStyle(collapsedSidebar),
          background: (theme) =>
            pathname === to ? sideBarTopLinkBackground(theme) : "transparent",
          "&:hover": {
            background: sideBarTopLinkBackground,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: 14,
            textTransform: "capitalize",
          }}
        >
          {icon}
          {!collapsedSidebar && (
            <Typography
              sx={{
                maxWidth: "80%",
              }}
            >
              {label}
            </Typography>
          )}
        </Box>
      </Box>
    </Link>
  );
}

function TabsWrapper({
  links,
  closeDrawer,
}: {
  links: LinkEntry[];
  closeDrawer?: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          m: 1,
          gap: 1,
        },
      }}
    >
      {links.map(({ label, to, params }) => (
        <Box
          key={to}
          onClick={closeDrawer}
          sx={{
            textTransform: "uppercase",
            cursor: "pointer",
            "& a": {
              textDecorationLine: "none !important",
              color: "inherit",
            },
            color: (theme) =>
              theme.palette.mode === "dark" ? "white" : "black",
            "&:hover": {
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.neutral[200]
                  : theme.palette.neutral[700],
            },
          }}
        >
          <Link
            textTransform="capitalize"
            to={to}
            sx={{
              [theme.breakpoints.down("md")]: {
                width: "100%",
                padding: 2,
                borderRadius: (theme) => theme.radius.md,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.neutral[800]
                    : theme.palette.neutral[200],
              },
            }}
            params={params}
            search={true}
          >
            <Typography
              sx={{
                '[data-status="active"] &': {
                  fontWeight: 500,
                  textDecorationLine: "underline",
                },
              }}
            >
              {label}
            </Typography>
          </Link>
        </Box>
      ))}
    </Box>
  );
}

export function TopNav({ links }: { links?: LinkEntry[] }) {
  const { sideBarWidth, toggleSidebar, collapsedSidebar } = useSideBar();
  const { signOut, userData } = useAuth();
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();
  const darkMode = useDarkMode();
  const mutateUserSettings = useMutateUserSettings();

  async function handleSignOut() {
    await signOut();
  }
  useEffect(() => {
    setMode(darkMode ? "dark" : "light");
  }, [darkMode, setMode]);

  return (
    <Box
      sx={{
        zIndex: 1000,
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "black" : "white"),
        boxShadow: "none",
        borderBottom: (theme) =>
          theme.palette.mode === "dark"
            ? `1px solid ${theme.palette.neutral[700]}`
            : `1px solid ${theme.palette.neutral[200]}`,
        left: sideBarWidth,
        borderRadius: 0,
        position: "sticky",
        height: headerHeight,
        width: "100%",
        top: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        m: 0,
        p: 2,
      }}
    >
      <Stack
        flexDirection="row"
        sx={{
          display: {
            sm: "flex",
            md: "none",
          },
          gap: 2,
        }}
      >
        <Box
          onClick={() => toggleSidebar(true)}
          sx={{
            ...(collapsedSidebar && {
              width: "100%",
            }),
            display: "flex",
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
        <Box
          sx={{
            display: {
              xs: collapsedSidebar ? "flex" : "none",
              md: "none",
            },
          }}
        ></Box>
      </Stack>
      <Stack
        pl={{
          xs: 2,
          md: 0,
        }}
        direction="row"
        gap={2}
        alignItems="center"
      >
        <ProjectPopup />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}
        >
          {links ? <TabsWrapper links={links} /> : <></>}
        </Box>
      </Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          [theme.breakpoints.down("md")]: {
            justifyContent: "flex-end",
            width: "100%",
          },
        }}
      >
        <Dropdown>
          <MenuButton variant="outlined" size="sm">
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              level="body-xs"
              textColor="text.tertiary"
            >
              <FaUser />
            </Typography>
          </MenuButton>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: "99999",
              p: 1,
              gap: 1,
              "--ListItem-radius": "var(--joy-radius-sm)",
            }}
          >
            <MenuItem>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography level="body-xs" textColor="text.tertiary">
                  {userData?.displayName ?? "Loading User..."}
                </Typography>
              </Box>
            </MenuItem>
            <ListDivider />
            <MenuItem
              onClick={() => {
                console.log("in here");
                mutateUserSettings({ darkMode: !darkMode });
              }}
            >
              {mode === "dark" ? <FiMoon /> : <FiSun />}
              {mode === "dark" ? "Light Mode" : "Dark Mode"}
            </MenuItem>
            <MenuItem>
              <FiHelpCircle />
              Help
            </MenuItem>
            <MenuItem>
              <FiSettings />
              Settings
            </MenuItem>
            <ListDivider />
            <ListDivider />
            <MenuItem onClick={() => handleSignOut()}>
              <FiLogOut />
              Log out
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}

export type LinkEntry = {
  label: string;
  id: string;
  params: object;
  to: LinkOptions["to"];
};

export function ProjectSearchInput({
  setQuery,
}: {
  setQuery: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box
      sx={{
        my: 0.5,
      }}
    >
      <Input
        autoFocus
        size="sm"
        placeholder="Search"
        startDecorator={<IoSearchOutline size={16} />}
        onChange={setQuery}
        sx={{ fontSize: 14, fontWeight: 400 }}
      />
    </Box>
  );
}

export function SidebarItemBox(props: ListItemButtonTypeMap["props"]) {
  return (
    <ListItemButton
      {...props}
      sx={{
        width: "100%",
        fontSize: 14,
        px: 1,
        py: 0.4,
        minHeight: 30,
        borderRadius: 5,
      }}
    />
  );
}

type SmartLink = {
  pathParam: NonNullable<LinkEntry["to"]>;
  replacementPath: NonNullable<LinkEntry["to"]>;
  defaultPath: NonNullable<LinkEntry["to"]>;
};

function useSmartSidebarLink({
  smartLink,
  to,
}: {
  smartLink?: SmartLink;
  to: LinkEntry["to"] | undefined;
}) {
  const { location, matches } = useRouterState();
  const currentLocation = location.pathname;

  if (to) return to;

  if (!smartLink) throw "pathParam or replacementPath is undefined";

  const { pathParam, replacementPath } = smartLink;

  const isPathParamEndOfPath = new RegExp(`${pathParam}/?$`).test(
    currentLocation,
  );

  const oneDynamicPathParam = matches.every(
    (match) => Object.keys(match.params).length <= 1,
  );

  if (
    currentLocation.includes(pathParam) &&
    !isPathParamEndOfPath &&
    oneDynamicPathParam
  ) {
    // matches /pathParam/anything/
    const pathParamMatch = new RegExp(`${pathParam}/[^/]+`);

    // replaces with `replacementPath`
    return currentLocation.replace(
      pathParamMatch,
      `/${replacementPath}`,
    ) as LinkEntry["to"];
  }

  return smartLink.defaultPath;
}

export function SidebarItem({
  label,
  params,
  id,
  to,
  smartLink,
  handleClick,
}: LinkEntry & {
  smartLink?: SmartLink;
  handleClick?: () => void;
}) {
  const path = useSmartSidebarLink({
    smartLink,
    to,
  });
  const currentPath = useRouterState().location.pathname;
  const projectIdRegex = /(?<=projects\/)\d+(?=\/)/;
  const currentProjectId = currentPath.match(projectIdRegex)?.[0];

  return (
    <ErrorBoundary fallback={<div>error</div>}>
      <RouterLink
        style={{
          textDecoration: "none",
          color: "inherit",
          width: "100%",
        }}
        to={path}
        id={id}
        params={params}
        onClick={() => {
          handleClick?.();
        }}
      >
        <SidebarItemBox selected={currentProjectId === id}>
          {label}
        </SidebarItemBox>
      </RouterLink>
    </ErrorBoundary>
  );
}

export function SidebarToggableItemWithIcon({
  label,
  to,
  id,
  params,
  starred,
  handleStarred,
  handleClick,
}: {
  starred?: boolean;
  handleStarred: () => void;
  handleClick?: () => void;
} & LinkEntry) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mr: 1,
        cursor: "pointer",
      }}
    >
      {starred ? (
        <MdStarRate
          onClick={(e) => {
            e.stopPropagation();
            handleStarred();
          }}
        />
      ) : (
        <MdStarOutline
          onClick={(e) => {
            e.stopPropagation();
            handleStarred();
          }}
        />
      )}
      <SidebarItem
        id={id}
        label={label}
        to={to}
        params={params}
        handleClick={handleClick}
        smartLink={{
          pathParam: "/projects",
          replacementPath: "/projects/$project",
          defaultPath: "/projects/$project/users",
        }}
      />
    </Box>
  );
}

export function SidebarToggableList({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        position: "relative",
        mx: 1,
      }}
    >
      {children}
    </Box>
  );
}

export function SidebarButton({
  children,
  label,
  icon,
}: {
  label: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  const { collapsedSidebar: open, toggleSidebar } = useSideBar();

  return (
    <>
      <Box
        sx={{
          ...sideBarTopLinkStyle(!open),
          background: (theme) =>
            open ? sideBarTopLinkBackground(theme) : "transparent",
          "&:hover": {
            background: sideBarTopLinkBackground,
          },
        }}
        onClick={() => {
          open && toggleSidebar(!open);
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: 14,
            textTransform: "capitalize",
          }}
        >
          {icon}
          {label}
        </Box>
        {children && (
          <>
            {open ? (
              <GoChevronDown fontSize={20} />
            ) : (
              <GoChevronRight fontSize={20} />
            )}
          </>
        )}
      </Box>
      {open && children}
    </>
  );
}
