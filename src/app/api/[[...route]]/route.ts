import { ping } from "@/libs/commands/ping";
import { REST } from "@discordjs/rest";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
	type APIInteraction,
	InteractionResponseType,
	InteractionType,
	Routes,
} from "discord-api-types/v10";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

// app.post("/interaction", async (c) => {
// 	const interaction: APIInteraction = await c.req.json();
// 	switch (interaction.type) {
// 		case InteractionType.Ping: {
// 			return c.json({ type: InteractionResponseType.Pong }, 200);
// 		}
// 		case InteractionType.ApplicationCommand: {
// 			const res = await ping.execute(interaction);
// 			return c.json(res, 200);
// 		}
// 	}
// });

// For Hno RPC
const route = app
	.get("/ping", async (c) => c.text("pong", 200))
	.get("/register_commands", async (c) => {
		const { env } = await getCloudflareContext();
		const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
		await rest
			.post(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), {
				body: [ping.command],
			})
			.catch((e) => c.text(`error: ${e}`, 500));
		return c.text("registered", 200);
	});

type AppType = typeof route;
const GET = handle(app);
const POST = handle(app);

export { GET, POST, type AppType };
