import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// import { handlers } from "@/auth";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

// export const { GET, POST } = handlers;

export const GET = (req: NextRequest) => {
	const env = getRequestContext().env;
	const { handlers } = NextAuth({
		secret: env.AUTH_SECRET,
		providers: [
			Discord({
				clientId: env.AUTH_DISCORD_CLIENT_ID,
				clientSecret: env.AUTH_DISCORD_CLIENT_SECRET,
			}),
		],
	});

	return handlers.GET(req);
};

export const POST = (req: NextRequest) => {
	const env = getRequestContext().env;
	const { handlers } = NextAuth({
		secret: env.AUTH_SECRET,
		providers: [
			Discord({
				clientId: env.AUTH_DISCORD_CLIENT_ID,
				clientSecret: env.AUTH_DISCORD_CLIENT_SECRET,
			}),
		],
	});
	return handlers.POST(req);
};
