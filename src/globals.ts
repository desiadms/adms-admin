import { Theme } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { GridApi } from "ag-grid-community";
import { atom, useAtom } from "jotai";

export const headerHeight = 65;
export const tableTopToolbarHeight = 50;

export const pageContainerHeight = `calc(100dvh - ${headerHeight}px)`;
export const borderColor = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? `1px solid ${theme.palette.neutral[700]}`
    : `1px solid ${theme.palette.neutral[200]}`;

const tableApiAtom = atom<GridApi | null>(null);

export function useTableApi() {
  return useAtom(tableApiAtom);
}

export const inputWidth = 260;
export const inputSx = {
  width: inputWidth,
} satisfies SxProps;

export const joy4ValueInPx = 32;

// 3 inputs + 2 gaps + left and right padding
export const maxFormWidth = 260 * 3 + joy4ValueInPx * 2 + joy4ValueInPx * 2;

export type ResObject<E = unknown> = {
  id: string;
  error: E | null;
};

export type TServerResponse<E = unknown> = ResObject<E>[];
