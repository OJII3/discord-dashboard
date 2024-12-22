import { Hono } from "hono";
import { handle } from "hono/vercel";

const runtime = "edge";
const app = new Hono<{ Bindings: CloudflareEnv }>().basePath("/api");
const route = app.get("/ping", async (c) =>
	c.env.DISCORD_PUBLIC_KEY ? c.text("pong", 200) : c.text("no pubkey", 200),
);

type AppType = typeof route;
const GET = handle(app);
const POST = handle(app);

export { runtime, GET, POST, type AppType };
