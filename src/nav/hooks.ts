import { atom, useAtom } from "jotai";

const sidebarAtom = atom(true);

export function useSideBar() {
  const [sideBarCollapsed, setSideBar] = useAtom(sidebarAtom);
  const sideBarCollpasedWidth = 70;
  const openSideBarWidth = 205;
  return {
    sideBarWidth: sideBarCollapsed ? sideBarCollpasedWidth : openSideBarWidth,
    openSideBarWidth,
    collapsedSidebar: sideBarCollapsed,
    toggleSidebar: (open: boolean) => setSideBar(open),
  };
}
