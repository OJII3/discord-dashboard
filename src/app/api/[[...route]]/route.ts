import { getRequestContext } from "@cloudflare/next-on-pages";

import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const route = app.get("/ping", async (c) => {
	const { env } = getRequestContext();
	return c.text(env.DISCORD_PUBLIC_KEY ? "OK" : "No env", 200);
});

export type AppType = typeof route;
export const { GET, POST } = { GET: handle(app), POST: handle(app) };
