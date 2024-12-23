import { handlers } from "@/auth"; // Referring to the auth.ts we just created
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";
export const { GET, POST } = handlers;

export const runtime = "edge";

// export const GET = (req: NextRequest) => {
// 	process.env = {
// 		...process.env,
// 		...getRequestContext().env,
// 	};
// 	return handlers.GET(req);
// };
//
// export const POST = (req: NextRequest) => {
// 	process.env = {
// 		...process.env,
// 		...getRequestContext().env,
// 	};
// 	return handlers.POST(req);
// };
