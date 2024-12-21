"use client";

import { client } from "@/libs/client";
import type { InferRequestType } from "hono/client";
import useSWR from "swr";

export default function Home() {
	const $get = client.get_roles.$post;

	const fetcher = (arg: InferRequestType<typeof $get>) => async () => {
		const res = await $get(arg);
		return await res.json();
	};

	const { data, error, isLoading } = useSWR("/", fetcher({}));

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
