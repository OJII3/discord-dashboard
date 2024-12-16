import { verifyKey } from "discord-interactions";
import { Hono } from "hono";
import { logger } from "hono/logger";

type Bindings = {
	DISCORD_PUBLIC_KEY: string;
};

const api = new Hono<{ Bindings: Bindings }>();

api.use(logger()).get("/", (c) => {
	return c.text("OK");
});

api.post("/interaction", async (c, next) => {
	const signature = c.req.header("X-Signature-Ed25519")!;
	const timestamp = c.req.header("X-Signature-Timestamp")!;
	const body = await c.req.text();
	const isValid = await verifyKey(
		body,
		signature,
		timestamp,
		c.env["DISCORD_PUBLIC_KEY"],
	);

	if (isValid) {
		return c.json({ status: 401, message: "Unauthorized" }, 401);
	}

	return next();
});

export default api;
