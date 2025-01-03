"use client";

import { Center, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export default function Template({
	children,
}: {
	children: Readonly<ReactNode>;
}) {
	const { status, data: session } = useSession();

	if (status === "loading") {
		return (
			<Center minH="vh">
				<Spinner size="xl" colorPalette="cyan" />
			</Center>
		);
	}

	if (status === "unauthenticated") {
		notFound();
	}

	console.log(session?.accessToken);

	return <>{children}</>;
}
