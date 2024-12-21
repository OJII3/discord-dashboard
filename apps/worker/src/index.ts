import { ExpressAuth } from "@auth/express";
import Discord from "@auth/express/providers/discord";
import { REST } from "@discordjs/rest";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import { type RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { Bindings } from "./bindings";
import { InteractionHandleMiddleware } from "./interaction/interactions";
import { InteractionVerificationMiddleware } from "./interaction/verify";
import { RegisterCommandMiddleware } from "./register";

const api = new Hono<{ Bindings: Bindings }>()
	.use(logger())
	.use("*", cors())
	.use(
		"*",
		initAuthConfig((c) => ({
			secret: c.env.SECRET,
			providers: [Discord({})],
		})),
	)
	.use("/api/auth/*", authHandler())
	.use("/api/*", verifyAuth())
	.get("/", (c) => c.text("OK", 200))
	.get("/auth/*", (c, next) =>
		ExpressAuth({ providers: [Discord] })(c.req, c.res, next),
	)
	.get("/register", RegisterCommandMiddleware)
	.post(
		"/interaction",
		InteractionVerificationMiddleware,
		InteractionHandleMiddleware,
	)
	.post("/get_roles", async (c) => {
		const rest = new REST({ version: "10" }).setToken(c.env.DISCORD_TOKEN);
		console.log(Routes.guildRoles(c.env.DISCORD_GUILD_ID));
		const data = (await rest.get(
			Routes.guildRoles(c.env.DISCORD_GUILD_ID),
		)) as RESTGetAPIGuildRolesResult;
		return c.json(data, 200);
	});

export default api;

export type APIType = typeof api;
