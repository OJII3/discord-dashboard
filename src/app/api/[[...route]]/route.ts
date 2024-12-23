import { ping } from "@/app/discord/interaction/commands/ping";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const route = app
	.get("/ping", async (c) => {
		const { env } = getRequestContext();
		return c.text(env.DISCORD_PUBLIC_KEY ? "OK" : "No env", 200);
	})
	.post("/register_commands", async (c) => {
		const { env } = getRequestContext();
		const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
		await rest
			.post(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), {
				body: [ping.command],
			})
			.catch((e) => c.text(e.message, 500));
		return c.text("OK", 200);
	});

export type AppType = typeof route;
export const { GET, POST } = { GET: handle(app), POST: handle(app) };
