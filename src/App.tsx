import { NhostProvider } from "@nhost/react";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { Toaster } from "react-hot-toast";
import { nhost } from "./nhost";
import { router } from "./router";

export function App() {
  return (
    <StrictMode>
      <NhostProvider nhost={nhost}>
        <RouterProvider router={router} />
        <Toaster />
      </NhostProvider>
    </StrictMode>
  );
}
