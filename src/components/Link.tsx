import Link, { type LinkProps } from "@mui/joy/Link";

import { Link as RouterLink, createLink } from "@tanstack/react-router";

function JoyLink({
	children,
	...props
}: LinkProps & { children: React.ReactNode }) {
	const { ref, ...rest } = props;
	return (
		<Link component={RouterLink} {...rest}>
			{children}
		</Link>
	);
}

const JoyRouterLink = createLink(JoyLink);

export default JoyRouterLink;
