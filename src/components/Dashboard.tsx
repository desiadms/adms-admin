import { useSignOut } from "@nhost/react";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export function Home() {
  return <div>hello!!!</div>;
}

export function Dashboard() {
  const _signout = useSignOut();

  return (
    <div className="min-h-full">
      <main>
        <Outlet />
        {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
