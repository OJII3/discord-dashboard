import { REST } from "@discordjs/rest";
// import { zValidator } from "@hono/zod-validator";
import {
	ApplicationCommandOptionType,
	type RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from "discord-api-types/v10";
import { config } from "dotenv";
import { Hono } from "hono";
import { logger } from "hono/logger";
// import { z } from "zod";
import { InteractionHandleMiddleware } from "./interaction/interactions";
import type { Bindings } from "./interaction/types";
import { InteractionVerificationMiddleware } from "./interaction/verify";

const api = new Hono<{ Bindings: Bindings }>();

api.use(logger()).get("/", (c) => {
	return c.text("OK");
});

api.post(
	"/interaction",
	InteractionVerificationMiddleware,
	InteractionHandleMiddleware,
);

api.get(
	"/register",
	// zValidator(
	// 	"form",
	// 	z.object({
	// 		title: z.string(),
	// 	}),
	// ),
	async (c, next) => {
		const data = c.req.json();
		config();

		const superchat: RESTPostAPIApplicationCommandsJSONBody = {
			name: "superchat",
			description: "スーパーチャットを送ります",
			options: [
				{
					type: ApplicationCommandOptionType.Integer,
					name: "金額",
					description: "スーパーチャットの金額",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "コメント",
					description: "スーパーチャットのコメント",
				},
			],
		};

		const token = process.env.DISCORD_TOKEN;
		const applicationId = process.env.DISCORD_APPLICATION_ID;
		// const guildId = process.env.DISCORD_GUILD_ID;

		if (!token || !applicationId) {
			throw new Error("Missing token or application ID in environment secrets");
		}

		const rest = new REST({ version: "10" }).setToken(token);

		// await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
		//   body: [superchat],
		// });

		await rest.put(Routes.applicationCommands(applicationId), {
			body: [superchat],
		});
	},
);

export default api;
