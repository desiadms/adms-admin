import { Theme } from "@mui/joy";
import { GridApi } from "ag-grid-community";
import { atom, useAtom } from "jotai";

export const headerHeight = 65;
export const pageContainerHeight = `calc(100dvh - ${headerHeight}px)`;
export const borderColor = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? `1px solid ${theme.palette.neutral[700]}`
    : `1px solid ${theme.palette.neutral[200]}`;

const tableApiAtom = atom<GridApi | null>(null);

export function useTableApi() {
  return useAtom(tableApiAtom);
}
