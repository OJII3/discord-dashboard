import { getRequestContext } from "@cloudflare/next-on-pages";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

const env = getRequestContext().env;

export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: env.AUTH_SECRET,
	providers: [
		Discord({
			clientId: env.AUTH_DISCORD_CLIENT_ID,
			clientSecret: env.AUTH_DISCORD_CLIENT_SECRET,
		}),
	],
});
