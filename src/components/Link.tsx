import Link, { LinkProps } from "@mui/joy/Link";

import {
  AnyRoute,
  LinkOptions,
  RegisteredRouter,
  Link as RouterLink,
} from "@tanstack/react-router";

type LinkRouterProps<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TTo extends string = "",
> = LinkOptions<TRouteTree, "/", TTo> & LinkProps;

export default function LinkRouter<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TTo extends string = "",
>({ children, ...props }: LinkRouterProps<TRouteTree, TTo>) {
  const childs = children as React.ReactNode;
  return (
    <Link component={RouterLink} {...props}>
      {childs}
    </Link>
  );
}
