import { verifyKey } from "discord-interactions";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "./types";

export const InteractionVerificationMiddleware = createMiddleware<{
	Bindings: Bindings;
}>(async (c, next) => {
	const signature = c.req.header("X-Signature-Ed25519");
	const timestamp = c.req.header("X-Signature-Timestamp");

	if (!signature || !timestamp) {
		console.error("No signature or timestamp in request");
		return c.json({ status: 401, message: "Unauthorized" }, 401);
	}

	const body = await c.req.text();
	const isValid = await verifyKey(
		body,
		signature,
		timestamp,
		c.env.DISCORD_PUBLIC_KEY,
	);

	if (!isValid) {
		return c.json({ status: 401, message: "Unauthorized" }, 401);
	}

	return next();
});
