import { Button } from "@/components/ui/button";
import { Center } from "@chakra-ui/react";
import Link from "next/link";

export const runtime = "edge";

export default function NotFound() {
	return (
		<Center minH="vh">
			<Button as="div" colorScheme="cyan" variant="surface">
				<Link href="/">Back to Home</Link>
			</Button>
		</Center>
	);
}
