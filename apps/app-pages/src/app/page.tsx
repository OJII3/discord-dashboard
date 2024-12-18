import type { APIType } from "app-workers";
import { hc } from "hono/client";

const endpoint = process.env.CLOUDFLARE_WORKERS_URL;
if (!endpoint) {
	throw new Error("Missing CLOUDFLARE_WORKERS_URL in environment secrets");
}
const client = hc<APIType>(endpoint);

export default async function Home() {
	const { json } = await client.test.$post({
		json: {
			title: "This is title",
			description: "This is description",
		},
	});

	const { title, description, content } = await json();

	return (
		<div>
			<h1>{title}</h1>
			<p>{description}</p>
			<p>{content}</p>
		</div>
	);
}
