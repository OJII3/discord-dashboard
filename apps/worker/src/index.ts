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

const api = new Hono<{ Bindings: Bindings }>({ strict: false })
	.use(logger())
	// .use("*", cors())
	.get("/api/", (c) => c.text("OK", 200))
	.get("/api/register", RegisterCommandMiddleware)
	.post(
		"/api/interaction",
		InteractionVerificationMiddleware,
		InteractionHandleMiddleware,
	)
	.post("/api/get_roles", async (c) => {
		const rest = new REST({ version: "10" }).setToken(c.env.DISCORD_TOKEN);
		console.log(Routes.guildRoles(c.env.DISCORD_GUILD_ID));
		const data = (await rest.get(
			Routes.guildRoles(c.env.DISCORD_GUILD_ID),
		)) as RESTGetAPIGuildRolesResult;
		return c.json(data, 200);
	});

api.use(
	"/api/*",
	initAuthConfig((c) => ({
		secret: c.env.AUTH_SECRET,
		providers: [
			Discord({
				clientId: c.env.AUTH_DISCORD_ID,
				clientSecret: c.env.AUTH_DISCORD_SECRET,
			}),
		],
	})),
);
api.use("/api/auth/*", authHandler());
api.use("/api/*", verifyAuth());
api.use("/api/protected", async (c) => c.json(c.get("authUser"), 200));

export default api;

export type APIType = typeof api;
