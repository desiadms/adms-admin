import { Box, Button, IconButton, Input } from "@mui/joy";
import { useRouterState } from "@tanstack/react-router";
import { BaseExportParams, GetRowIdParams, GridApi } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import { ComponentProps, ReactNode, useCallback, useState } from "react";
import { IoCloseSharp, IoSearchOutline } from "react-icons/io5";
import { useDarkMode } from "../admin";
import { borderColor, pageContainerHeight, useTableApi } from "../globals";

const tableTopToolbarHeight = 50;

type RequiredTableField = { id: string };

type TTableTopToolbar<TData> = {
  api: GridApi<TData>;
  leftChildren?: ReactNode | ((api: GridApi<TData>) => ReactNode);
  rightChildren?: ReactNode | ((api: GridApi<TData>) => ReactNode);
};

function handleExport(
  api: GridApi,
  exportedRows: BaseExportParams["exportedRows"],
) {
  if (api) {
    api.exportDataAsCsv({ exportedRows });
  } else {
    console.error("Grid API not available");
  }
}

function TableTopToolbar<TData extends RequiredTableField>({
  leftChildren,
  rightChildren,
  api,
}: TTableTopToolbar<TData>) {
  const [filterText, setFilterText] = useState("");

  function setFilterTextGrid(newFilterText: string) {
    setFilterText(newFilterText);
    api?.setGridOption("quickFilterText", newFilterText);
    api?.onFilterChanged();
  }

  return (
    <Box
      id="actions"
      sx={{
        height: tableTopToolbarHeight,
        display: "flex",
        px: 1,
        justifyContent: "flex-end",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {typeof leftChildren === "function"
            ? leftChildren(api)
            : leftChildren}

          <Input
            id="search"
            size="sm"
            sx={{ width: 200 }}
            placeholder="Search..."
            startDecorator={<IoSearchOutline size={16} />}
            value={filterText ?? ""}
            onChange={(e) => {
              setFilterTextGrid(e.target.value);
            }}
            endDecorator={
              filterText ? (
                <IconButton
                  aria-label="clear filter"
                  onClick={() => setFilterTextGrid("")}
                >
                  <IoCloseSharp />
                </IconButton>
              ) : null
            }
          />

          {rightChildren && (
            <Box
              sx={{
                display: {
                  md: "flex",
                },
                gap: 1,
              }}
            >
              {typeof rightChildren === "function"
                ? rightChildren(api)
                : rightChildren}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            size="sm"
            onClick={() => handleExport(api, "all")}
          >
            Export All
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => handleExport(api, "filteredAndSorted")}
          >
            Export Filtered View
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export function Table<TData extends RequiredTableField>({
  leftChildren,
  rightChildren,
  ...props
}: ComponentProps<typeof AgGridReact<TData>> &
  Omit<TTableTopToolbar<TData>, "api">) {
  const darkMode = useDarkMode();
  const {
    location: { pathname },
  } = useRouterState();

  const [api, setApi] = useTableApi();

  const getRowId = useCallback((params: GetRowIdParams<TData>) => {
    return params.data.id.toString();
  }, []);

  const onGridPreDestroyed = useCallback(() => {
    setApi(null);
  }, [setApi]);

  const onGridReady = useCallback(
    (params) => {
      setApi(params.api);
    },
    [setApi],
  );

  return (
    <Box sx={{ height: pageContainerHeight }}>
      {api ? (
        <TableTopToolbar
          api={api}
          rightChildren={rightChildren}
          leftChildren={leftChildren}
        />
      ) : (
        <Box sx={{ height: tableTopToolbarHeight }} />
      )}
      <Box
        sx={{
          height: `calc(100% - ${tableTopToolbarHeight}px)`,
          borderTop: borderColor,
        }}
        className={
          darkMode
            ? "ag-theme-quartz-dark ag-theme-dark-custom"
            : "ag-theme-quartz ag-theme-light-custom"
        }
      >
        <AgGridReact
          key={pathname}
          defaultColDef={{ filter: true, floatingFilter: true }}
          tooltipShowDelay={0}
          tooltipHideDelay={0}
          enableBrowserTooltips
          onGridReady={onGridReady}
          getRowId={getRowId}
          onGridPreDestroyed={onGridPreDestroyed}
          {...props}
        />
      </Box>
    </Box>
  );
}
