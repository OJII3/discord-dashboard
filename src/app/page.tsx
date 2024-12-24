"use client";

import { Button } from "@/components/ui/button";
import {
	ProgressCircleRing,
	ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import { client } from "@/libs/client";
import { Heading, Spinner, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
	const { data } = useQuery({
		queryKey: ["ping"],
		queryFn: () => client.api.ping.$get().then((res) => res.text()),
	});

	const [isLoading, setIsLoading] = useState(false);
	const { data: session } = useSession();

	return (
		<VStack>
			<Heading>Hello, world! Status: {data}</Heading>
			{session ? (
				<Heading>Welcome, {session.user?.name}!</Heading>
			) : (
				<Heading>Not logged in</Heading>
			)}
			<Button onClick={() => signIn("discord")}>Sign in with Discord</Button>
			<Button
				onClick={async () => {
					setIsLoading(true);
					await client.api.register_commands.$post();
					setIsLoading(false);
				}}
			>
				{isLoading ? <Spinner /> : "Register"}
			</Button>
		</VStack>
	);
}
