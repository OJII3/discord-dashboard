import type { APIType } from "app-workers";
import { hc } from "hono/client";
import { useEffect, useState } from "react";

const endpoint =
	"https://discord-dashboard-production.ojii3-cloudflare-workers-test.workers.dev/";
if (!endpoint) {
	throw new Error("Missing CLOUDFLARE_WORKERS_URL in environment secrets");
}

export const useHono = () => {
	const client = hc<APIType>(endpoint);
	const [data, setData] = useState<{
		title: string;
		description: string;
		content: string;
	}>({ title: "", description: "", content: "" });
	useEffect(() => {
		const getData = async () => {
			const { json } = await client.test.$post({
				json: {
					title: "Hello, World!",
					description: "This is a test",
				},
			});
			const { title, description, content } = await json();
			setData({ title, description, content });
		};

		getData();
	}, [client.test.$post]);

	return { data };
};
