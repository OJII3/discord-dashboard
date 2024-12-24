"use client";

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

export default function Template({
	children,
}: {
	children: Readonly<ReactNode>;
}) {
	const { data: session } = useSession();
	return (
		<>
			{session ? "authed" : "not authed"}
			{children}
		</>
	);
}
