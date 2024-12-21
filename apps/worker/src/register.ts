import { REST } from "@discordjs/rest";
import {
	ApplicationCommandOptionType,
	type RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from "discord-api-types/v10";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "./bindings";

export const applicationCommands = {
	ping: {
		name: "ping",
		description: "Ping!",
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: "arg",
				description: "Argument",
			},
		],
	},
} as const satisfies Record<string, RESTPostAPIApplicationCommandsJSONBody>;

export const RegisterCommandMiddleware = createMiddleware<{
	Bindings: Bindings;
}>(async (c, _next) => {
	const rest = new REST({ version: "10" }).setToken(c.env.DISCORD_TOKEN);
	await rest.put(Routes.applicationCommands(c.env.DISCORD_APPLICATION_ID), {
		body: Object.entries(applicationCommands).map((kv) => kv[1]),
	});

	return c.text("Command registered", 200);
});
