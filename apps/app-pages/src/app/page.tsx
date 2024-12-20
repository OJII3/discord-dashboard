"use client";

import type { APIType } from "app-workers";
import { type InferRequestType, hc } from "hono/client";
import useSWR from "swr";

export default function Home() {
	const client = hc<APIType>(
		"https://discord-dashboard-production.ojii3-cloudflare-workers-test.workers.dev",
	);
	const $get = client.test.$post;

	const fetcher = (arg: InferRequestType<typeof $get>) => async () => {
		const res = await $get(arg);
		return await res.json();
	};

	const { data, error, isLoading } = useSWR(
		"api-hello",
		fetcher({
			json: {
				title: "Hello",
				description: "World",
			},
		}),
	);

	if (isLoading) return <div>Loading...</div>;
	if (error || !data) return <div>Error</div>;

	return (
		<div>
			<div>Roles</div>
			{data.map((role) => (
				<div key={role.id}>
					{role.id}: {role.name}
				</div>
			))}
		</div>
	);
}
