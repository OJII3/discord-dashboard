import { handle } from "hono/cloudflare-pages";
import app from "worker";
export const onRequest = handle(app);
