"use client";

import { Button } from "@/components/ui/button";
import {
	ProgressCircleRing,
	ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import { client } from "@/libs/client";
import {
	Center,
	Container,
	Grid,
	GridItem,
	Heading,
	List,
	ProgressCircle,
	VStack,
} from "@chakra-ui/react";
import type { InferRequestType } from "hono/client";
import useSWR from "swr";

export default function Home() {
	const $get = client.get_roles.$post;

	const fetcher = (arg: InferRequestType<typeof $get>) => async () => {
		const res = await $get(arg);
		return await res.json();
	};

	const { data, error, isLoading } = useSWR("/", fetcher({}));

	if (isLoading)
		return (
			<Center minH="vh">
				<ProgressCircleRoot value={null}>
					<ProgressCircleRing />
				</ProgressCircleRoot>
			</Center>
		);
	if (error || !data) return <div>Error</div>;

	return (
		<Grid as="main" minH="vh" templateRows="auto 1fr">
			<GridItem>
				<header>
					<Heading>Discord Dashboard</Heading>
				</header>
			</GridItem>
			<Center as={GridItem}>
				<VStack>
					<Button
						variant="surface"
						onClick={() => {
							client.register.$get();
						}}
					>
						Re Register Application Commands
					</Button>
					<div>Roles</div>
					<List.Root>
						{data.map((role) => (
							<List.Item key={role.id}>
								{role.id}: {role.name}
							</List.Item>
						))}
					</List.Root>
				</VStack>
			</Center>
		</Grid>
	);
}
