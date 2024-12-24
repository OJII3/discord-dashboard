import {
	SlashCommandBuilder,
	SlashCommandStringOption,
} from "@discordjs/builders";
import {
	type APIApplicationCommandInteraction,
	type APIInteractionResponse,
	InteractionResponseType,
    MessageFlags,
} from "discord-api-types/v10";

const command = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with Pong!")
	.addStringOption(
		new SlashCommandStringOption()
			.setName("input")
			.setDescription("The input to echo back")
			.setRequired(false),
	)
	.toJSON();

const execute = async (
	interaction: APIApplicationCommandInteraction,
): Promise<APIInteractionResponse> => {
	return {
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: `Pong!
Guild ID: ${interaction.guild_id}
User ID: ${interaction.user?.id}
Interaction Name: ${interaction.data.name}`,
      flags: MessageFlags.Ephemeral
		},
	};
};

export const ping = { command, execute };
