"use client";

import { useHono } from "@/lib/useHono";

export default function Home() {
	const { data } = useHono();
	return (
		<div>
			<h1>{data.title}</h1>
			<p>{data.description}</p>
			<p>{data.content}</p>
		</div>
	);
}
