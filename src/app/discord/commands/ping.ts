import {
	ActionRowBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	SlashCommandStringOption,
	TextInputBuilder,
} from "@discordjs/builders";
import type { APIApplicationCommandInteraction } from "discord-api-types/v10";

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
) => {
	return new ModalBuilder()
		.setTitle(`Locale: ${interaction.locale}`)
		.setCustomId("modal")
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().setComponents(
				new TextInputBuilder()
					.setLabel("Label")
					.setPlaceholder("Placeholder")
					.setCustomId("text_input"),
			),
		)
		.toJSON();
};

export const ping = { command, execute };
