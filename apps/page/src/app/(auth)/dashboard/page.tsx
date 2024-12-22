"use client";

import { Button } from "@/components/ui/button";
import {
	ProgressCircleRing,
	ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import { client } from "@/libs/client";
import {
	Center,
	Flex,
	Grid,
	GridItem,
	Heading,
	List,
	VStack,
} from "@chakra-ui/react";
import {
	authConfigManager,
	signIn,
	useOauthPopupLogin,
	useSession,
} from "@hono/auth-js/react";
import type { InferRequestType } from "hono/client";
import { useEffect } from "react";
import useSWR from "swr";

export default function Home() {
	const $get = client.api.get_roles.$post;

	const fetcher = (arg: InferRequestType<typeof $get>) => async () => {
		const res = await $get(arg);
		return await res.json();
	};

	const { popUpSignin, status: popupStatus } = useOauthPopupLogin("discord", {
		callbackUrl: "/auth/success",
	});
	const { data: session, status } = useSession();
	const { data, error, isLoading } = useSWR("/", fetcher({}));

	useEffect(() => {
		if (popupStatus === "success") {
			authConfigManager.getConfig().fetchSession({ event: "refetch" });
		}
	}, [popupStatus]);

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
		<Grid minH="vh" templateRows="auto 1fr">
			<GridItem>
				<Flex as="header">
					<Heading>Discord Dashboard</Heading>
					<div>{session?.user?.id}</div>
					<div>{status.toString()}</div>
					<Button onClick={() => signIn("discord")}>Sign In</Button>
					<Button onClick={popUpSignin}>Popup Sign In</Button>
				</Flex>
			</GridItem>
			<Center as={GridItem}>
				<VStack as="main">
					<Button
						variant="surface"
						onClick={() => {
							client.api.register.$get();
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
