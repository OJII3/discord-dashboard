import type {
	APIInteraction,
	APIInteractionResponse,
} from "discord-api-types/v10";
import {
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "./types";

const RespondToInteraction: Record<
	InteractionType,
	(interaction: APIInteraction) => APIInteractionResponse
> = {
	[InteractionType.Ping]: (_) => ({
		type: InteractionResponseType.Pong,
	}),
	[InteractionType.ModalSubmit]: (_) => ({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: "モーダルが送信されました",
		},
	}),
	[InteractionType.MessageComponent]: (_) => ({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: "ボタンが押されました",
		},
	}),
	[InteractionType.ApplicationCommand]: (_) => ({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: "コマンドが実行されました",
		},
	}),
	[InteractionType.ApplicationCommandAutocomplete]: (_) => ({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: "オートコンプリートが実行されました",
		},
	}),
};

export const InteractionHandleMiddleware = createMiddleware<{
	Bindings: Bindings;
}>(async (c) => {
	const interaction: APIInteraction = await c.req.json();
	RespondToInteraction[interaction.type](interaction);
});
