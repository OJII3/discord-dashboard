"use client";

import { client } from "@/libs/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
	const { data } = useQuery({
		queryKey: ["ping"],
		queryFn: () => client.api.ping.$get().then((res) => res.text()),
	});

	return (
		<div>
			<div>Hello, world! Status: {data}</div>
			<button type="button" onClick={() => client.api.register_commands.$post()}>
				Register Commands
			</button>
		</div>
	);
}
