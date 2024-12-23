"use client";

import { signIn } from "next-auth/react";

export default function SigninPage() {
	return (
		<div>
			<div>Login</div>
			<button type="button" onClick={() => signIn("discord")}>
				Login
			</button>
		</div>
	);
}
