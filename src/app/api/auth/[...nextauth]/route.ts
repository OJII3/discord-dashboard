import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";

export const runtime = "edge";

import NextAuth, { type NextAuthConfig, type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
	interface Session extends DefaultSession {
		accessToken: string;
	}
}
declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		accessToken: string;
		id: string;
	}
}

const authConfig = (env: CloudflareEnv): NextAuthConfig => ({
	secret: env.AUTH_SECRET,
	providers: [
		Discord({
			clientId: env.AUTH_DISCORD_CLIENT_ID,
			clientSecret: env.AUTH_DISCORD_CLIENT_SECRET,
			authorization: {
				params: { scope: "identify email guilds" },
			},
		}),
	],
	callbacks: {
		session: async ({ session, token }) => {
			session.accessToken = token.accessToken;
			if (session.user) {
				session.user.id = token.id;
			}
			return session;
		},
		jwt: ({ token, account, profile }) => {
			if (account?.access_token) {
				token.accessToken = account.access_token;
			}
			if (profile?.id) {
				token.id = profile.id;
			}
			return token;
		},
	},
});

export const GET = (req: NextRequest) => {
	const env = getRequestContext().env;
	const { handlers } = NextAuth(authConfig(env));
	return handlers.GET(req);
};

export const POST = (req: NextRequest) => {
	const env = getRequestContext().env;
	const { handlers } = NextAuth(authConfig(env));
	return handlers.POST(req);
};
