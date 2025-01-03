import { Avatar } from "@/components/ui/avatar";
import { client } from "@/libs/client";
import { Badge, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export const MemberList = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["member"],
		queryFn: async () =>
			await client.api.guild.members.$get().then((res) => res.json()),
	});

	if (error) {
		return <p>{error.message}</p>;
	}

	if (isLoading || !data) {
		return <p>Loading...</p>;
	}

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Cell>Avatar</Table.Cell>
					<Table.Cell>Username</Table.Cell>
					<Table.Cell>Global Name</Table.Cell>
					<Table.Cell>Roles</Table.Cell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{data.map((member) => (
					<Table.Row key={member.user.id}>
						<Table.Cell>
							{/* {member.avatar && ( */}
							{/* 	<Avatar */}
							{/*                src={`https://cdn.discordapp.com/avatars/${member.}/${member.avatar}.png`} */}
							{/* 		borderRadius="full" */}
							{/* 		w="8" */}
							{/* 		h="8" */}
							{/* 		objectFit="cover" */}
							{/* 	/> */}
							{/* )} */}
							{member.user.avatar && (
								<Avatar
									src={`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`}
									borderRadius="full"
									w="8"
									h="8"
									objectFit="cover"
								/>
							)}
						</Table.Cell>
						<Table.Cell>{member.user.username}</Table.Cell>
						<Table.Cell>{member.user.global_name}</Table.Cell>
						<Table.Cell>
							{member.roles.map((role) => (
								<Badge key={role}>{role} </Badge>
							))}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
