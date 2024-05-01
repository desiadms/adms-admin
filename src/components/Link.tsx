import Link, { LinkProps } from "@mui/joy/Link";

import { Link as RouterLink, createLink } from "@tanstack/react-router";

function JoyLink({
  children,
  ...props
}: LinkProps & { children: React.ReactNode }) {
  return (
    <Link component={RouterLink} {...props}>
      {children}
    </Link>
  );
}

const JoyRouterLink = createLink(JoyLink);

export default JoyRouterLink;
