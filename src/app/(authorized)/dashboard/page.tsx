"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { client } from "@/libs/client";
import { Badge, HStack, Heading, Table, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Routes } from "discord-api-types/v10";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { MemberList } from "./_components/MemberList";

export default function DashboardPage() {
	const [isRegistering, setIsRegistering] = useState(false);

	const { data, isLoading, error } = useQuery({
		queryKey: ["member"],
		queryFn: async () =>
			await client.api.guild.members.$get().then((res) => res.json()),
	});

	const { data: roles } = useQuery({
		queryKey: ["roles"],
		queryFn: async () => await client.api.guild.roles.$get(),
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


			<MemberList />
		</VStack>
	);
}
