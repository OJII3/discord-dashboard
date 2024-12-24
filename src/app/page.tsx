"use client";

import { Button } from "@/components/ui/button";
import { Center, Grid, GridItem, HStack, Heading } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
// import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
	const { status } = useSession();

	if (status === "authenticated") {
		redirect("/dashboard");
	}

	return (
		<Grid gridTemplateRows="auto 1fr" minH="vh">
			<GridItem as={HStack}>
				<Heading>Discord Dashboard</Heading>
			</GridItem>
			<GridItem as={Center}>
				<Button
					colorPalette="cyan"
					variant="surface"
					onClick={() => signIn("discord")}
				>
					Sign in with Discord
				</Button>
			</GridItem>
		</Grid>
	);
}
