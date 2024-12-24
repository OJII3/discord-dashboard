"use client";

import { Button } from "@/components/ui/button";
import { client } from "@/libs/client";
import { HStack, Heading, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
	const [isRegistering, setIsRegistering] = useState(false);

	const { data, isLoading, error } = useQuery({
		queryKey: ["member"],
		queryFn: async () =>
			await client.api.guild.members.$get().then((res) => res.json()),
	});

	return (
		<VStack>
			<HStack justify="space-between" w="full" p={2}>
				<Heading>Discord Dashboard</Heading>
				<Button
					colorPalette="cyan"
					variant="surface"
					size="sm"
					onClick={async () => {
						await signOut();
						redirect("/");
					}}
				>
					Sign out
				</Button>
			</HStack>

			<Button
				onClick={async () => {
					setIsRegistering(true);
					await client.api.application.commands.$post();
					setIsRegistering(false);
				}}
				loading={isRegistering}
			>
				Register Commands
			</Button>
			{error && <p>{error.message}</p>}
			{isLoading || !data ? (
				<p>Loading...</p>
			) : (
				<pre>{JSON.stringify(data, null, 2)}</pre>
			)}
		</VStack>
	);
}
