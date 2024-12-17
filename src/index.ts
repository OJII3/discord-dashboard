import { Hono } from "hono";
import { logger } from "hono/logger";
import { InteractionHandleMiddleware } from "./interaction/interactions";
import type { Bindings } from "./interaction/types";
import { InteractionVerificationMiddleware } from "./interaction/verify";

const api = new Hono<{ Bindings: Bindings }>();

api.use(logger()).get("/", (c) => {
	return c.text("OK");
});

api.post(
	"/interaction",
	InteractionVerificationMiddleware,
	InteractionHandleMiddleware,
);

export default api;
