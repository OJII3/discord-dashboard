'use client'

import { hc } from "hono/client";
import type { APIType } from "worker";

if (process.env.NEXT_PUBLIC_WORKER_URL === undefined) {
	throw new Error("NEXT_PUBLIC_WORKER_URL is not defined");
}
export const client = hc<APIType>(process.env.NEXT_PUBLIC_WORKER_URL);
