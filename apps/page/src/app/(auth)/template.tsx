"use client";

import { env } from "@/libs/env";
import { authConfigManager, SessionProvider } from "@hono/auth-js/react";

authConfigManager.setConfig({
  baseUrl: env.WORKER_URL,
})

export default function Template({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <SessionProvider>{children}</SessionProvider>;
}
