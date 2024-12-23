import { getRequestContext } from "@cloudflare/next-on-pages";
import {
	type APIInteraction,
	type APIInteractionResponse,
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { verifyKey } from "discord-interactions";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { ping } from "../commands/ping";

export const runtime = "edge";

const app = new Hono().basePath("/discord").get(
	"/interaction",
	async (c, next) => {
		const { env } = getRequestContext();
		const signature = c.req.header("X-Signature-Ed25519");
		const timestamp = c.req.header("X-Signature-Timestamp");
		if (!signature || !timestamp) {
			return c.json({ status: 401, message: "Unauthorized" }, 401);
		}
		const body = await c.req.text();
		const isValid = await verifyKey(
			body,
			signature,
			timestamp,
			env.DISCORD_PUBLIC_KEY,
		);

		if (!isValid) {
			return c.json({ status: 401, message: "Unauthorized" }, 401);
		}

		return next();
	},
	async (c) => {
		const interaction: APIInteraction = await c.req.json();
		if (interaction.type === InteractionType.Ping) {
			return c.json<APIInteractionResponse>(
				{ type: InteractionResponseType.Pong },
				200,
			);
		}
		if (interaction.type === InteractionType.ApplicationCommand) {
			if (interaction.data.name === ping.command.name) {
				const data = await ping.execute(interaction);
				return c.json(data, 200);
			}
		}
	},
);

export const { GET, POST } = { GET: handle(app), POST: handle(app) };
