import { getRequestContext } from "@cloudflare/next-on-pages";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: getRequestContext().env.AUTH_SECRET,
	providers: [
		Discord({
			clientId: getRequestContext().env.AUTH_DISCORD_CLIENT_ID,
			clientSecret: getRequestContext().env.AUTH_DISCORD_CLIENT_SECRET,
		}),
	],
});
