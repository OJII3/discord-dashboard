"use client";

import { client } from "@/libs/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
	const { data } = useQuery({
		queryKey: ["ping"],
		queryFn: () => client.api.ping.$get().then((res) => res.text()),
	});

	return <div>Hello, world! Status: {data}</div>;
}
