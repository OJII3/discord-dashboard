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
import { ping } from "./commands/ping";
import { verifyInteractionRequest } from "./verify";

export const runtime = "edge";

const app = new Hono()
	.basePath("/discord")
	.post("/interaction", verifyInteractionRequest, async (c) => {
		const interaction: APIInteraction = await c.req.json();

		if (interaction.type === InteractionType.Ping) {
			return c.json<APIInteractionResponse>({
				type: InteractionResponseType.Pong,
			});
		}

		if (interaction.type === InteractionType.ApplicationCommand) {
			if (interaction.data.name === ping.command.name) {
				const data = await ping.execute(interaction);
				return c.json<APIInteractionResponse>(data, 200);
			}
		}
	});

export const { GET, POST } = { GET: handle(app), POST: handle(app) };
