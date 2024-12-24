"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default function Template({
	children,
}: {
	children: Readonly<ReactNode>;
}) {
	const { data: session } = useSession();
	if (!session) return redirect("/");
	return children;
}
