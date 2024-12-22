import type { Context } from "hono";
import { env } from "hono/adapter";

type Bindings = {
	DISCORD_PUBLIC_KEY: string;
	DISCORD_TOKEN: string;
	DISCORD_APPLICATION_ID: string;
  DISCORD_GUILD_ID: string;
};

export const getEnv = (c: Context) => env<Bindings>(c);
