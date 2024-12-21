import { REST } from "@discordjs/rest";
import {
	ApplicationCommandOptionType,
	type RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from "discord-api-types/v10";
import { createMiddleware } from "hono/factory";

export const RegisterCommandMiddleware = createMiddleware(async (c, _next) => {
	const command: RESTPostAPIApplicationCommandsJSONBody = {
		name: "ping",
		description: "Ping!",
		options: [
			{
				type: ApplicationCommandOptionType.Integer,
				name: "int",
				description: "int",
			},
			{
				type: ApplicationCommandOptionType.String,
				name: "comment",
				description: "comment",
			},
		],
	};

	const token = c.env.DISCORD_TOKEN;
	const applicationId = c.env.DISCORD_APPLICATION_ID;

	if (!token || !applicationId) {
		throw new Error("Missing token or application ID in environment secrets");
	}

	const rest = new REST({ version: "10" }).setToken(token);
	await rest.put(Routes.applicationCommands(applicationId), {
		body: [command],
	});

	return c.text("Command registered", 200);
});
