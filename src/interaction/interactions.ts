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
	(interaction: APIInteraction) => Promise<APIInteractionResponse>
> = {
	[InteractionType.Ping]: async (_) => ({
		type: InteractionResponseType.Pong,
	}),
	[InteractionType.ModalSubmit]: async (_) => ({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: "モーダルが送信されました",
		},
	}),
	[InteractionType.MessageComponent]: async (_) => ({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: "ボタンが押されました",
		},
	}),
	[InteractionType.ApplicationCommand]: async (_) => ({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: "コマンドが実行されました",
		},
	}),
	[InteractionType.ApplicationCommandAutocomplete]: async (_) => ({
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
	const payload = RespondToInteraction[interaction.type](interaction);

	const formData = new FormData();
	formData.set("payload_json", JSON.stringify(payload));
	return new Response(formData, { status: 200 });
});
