import { zValidator } from "@hono/zod-validator";
import { createMiddleware } from "hono/factory";
import { z } from "zod";

export const CommandRegisterMiddleware = createMiddleware(
	zValidator(
		"form",
		z.object({
			title: z.string(),
		}),
	),
);
