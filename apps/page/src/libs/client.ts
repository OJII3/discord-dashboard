"use client";

import { hc } from "hono/client";
import type { APIType } from "worker";
import { env } from "./env";

export const client = hc<APIType>(env.WORKER_URL);
