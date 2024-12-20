import { REST, RouteData } from "@discordjs/rest";
import { zValidator } from "@hono/zod-validator";
import { type RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";
import { InteractionHandleMiddleware } from "./interaction/interactions";
import type { Bindings } from "./interaction/types";
import { InteractionVerificationMiddleware } from "./interaction/verify";
import { RegisterCommandMiddleware } from "./register";

const api = new Hono<{ Bindings: Bindings }>()
	.use(logger())
	.use("/*", cors())
	.get("/", (c) => {
		return c.text("OK");
	})
	.get("/register", RegisterCommandMiddleware)
	.post(
		"/interaction",
		InteractionVerificationMiddleware,
		InteractionHandleMiddleware,
	)
	.post(
		"/test",
		// zValidator(
		// 	"json",
		// 	z.object({
		// 		title: z.string(),
		// 		description: z.string(),
		// 	}),
		// ),
		async (c) => {
			// const { title, description } = c.req.valid("json");
			const rest = new REST({ version: "10" }).setToken(c.env.DISCORD_TOKEN);
			const data = (await rest.get(
				Routes.guildRoles(c.env.DISCORD_GUILD_ID),
			)) as RESTGetAPIGuildRolesResult;
			return c.json(data, 200);
		},
	);

export default api;

export type APIType = typeof api;
