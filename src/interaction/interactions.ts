import type {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandInteraction,
	APIInteraction,
	APIInteractionResponse,
	APIMessageComponentInteraction,
	APIMessageInteraction,
	APIMessageInteractionMetadata,
	APIModalSubmitInteraction,
	APIPingInteraction,
} from "discord-api-types/v10";
import {
	ComponentType,
	InteractionResponseType,
	InteractionType,
	TextInputStyle,
} from "discord-api-types/v10";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "./types";

type InteractionHandler<T extends APIInteraction> = (
	interaction: T,
) => Promise<APIInteractionResponse>;

const HandlePing: InteractionHandler<APIPingInteraction> = async () => {
	return {
		type: InteractionResponseType.Pong,
	};
};

const HandleCommand: InteractionHandler<
	APIApplicationCommandInteraction
> = async (interaction) => {
	return {
		type: InteractionResponseType.Modal,
		data: {
			title: "モーダル",
			custom_id: "modal",
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.TextInput,
							custom_id: "textinput",
							label: `テキスト: ${interaction.data.guild_id}`,
							style: TextInputStyle.Short,
						},
					],
				},
			],
		},
	} satisfies APIInteractionResponse;
};

const ModalSubmitHandler: InteractionHandler<
	APIModalSubmitInteraction
> = async (interaction) => {
	return {
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			attachments: [],
			tts: false,
			thread_name: "test",
			poll: {
				question: {
					text: "test",
				},
				answers: [
					{
						poll_media: {
							text: "test",
							emoji: {
								id: "123",
								name: "test",
								animated: true,
							},
						},
					},
				],
			},
		},
	} satisfies APIInteractionResponse;
};

const MessageComponentHandler: InteractionHandler<
	APIMessageComponentInteraction
> = async (interaction) => {
	return {
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: interaction.type.toString(),
		},
	};
};

const AutoCompleteHandler: InteractionHandler<
	APIApplicationCommandAutocompleteInteraction
> = async () => {
	return {
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: "オートコンプリートが実行されました",
		},
	};
};

const HandleInteraction = (interaction: APIInteraction) => {
	if (interaction.type === InteractionType.Ping) return HandlePing(interaction);
	if (interaction.type === InteractionType.ApplicationCommand)
		return HandleCommand(interaction);
	if (interaction.type === InteractionType.MessageComponent)
		return MessageComponentHandler(interaction);
	if (interaction.type === InteractionType.ApplicationCommandAutocomplete)
		return AutoCompleteHandler(interaction);
	if (interaction.type === InteractionType.ModalSubmit)
		return ModalSubmitHandler(interaction);
};

export const InteractionHandleMiddleware = createMiddleware<{
	Bindings: Bindings;
}>(async (c) => {
	const interaction: APIInteraction = await c.req.json();
	const payload = await HandleInteraction(interaction);

	const formData = new FormData();
	formData.set("payload_json", JSON.stringify(payload));
	return new Response(formData, { status: 200 });
});
