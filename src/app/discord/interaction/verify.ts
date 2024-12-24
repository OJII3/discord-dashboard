import { getRequestContext } from "@cloudflare/next-on-pages";
import { verifyKey } from "discord-interactions";
import { createMiddleware } from "hono/factory";

export const verifyInteractionRequest = createMiddleware(async (c, next) => {
	const { env } = getRequestContext();
	const signature = c.req.header("X-Signature-Ed25519");
	const timestamp = c.req.header("X-Signature-Timestamp");

	if (!signature || !timestamp) {
		return c.json({ status: 401, message: "Unauthorized" }, 401);
	}

	const body = await c.req.text();
	const isValid = await verifyKey(
		body,
		signature,
		timestamp,
		env.DISCORD_PUBLIC_KEY,
	);

	if (!isValid) {
		return c.json({ status: 401, message: "Unauthorized" }, 401);
	}

	return next();
});
