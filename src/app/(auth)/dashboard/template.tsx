"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

export default function Template({
	children,
}: {
	children: Readonly<ReactNode>;
}) {
	const { data: session } = useSession();

	if (!session) {
		return redirect("/");
	}
	return <>{children}</>;
}
