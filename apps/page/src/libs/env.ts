if (process.env.NEXT_PUBLIC_WORKER_URL === undefined) {
	throw new Error("NEXT_PUBLIC_WORKER_URL is not defined");
}

export const env = {
	WORKER_URL: process.env.NEXT_PUBLIC_WORKER_URL,
};
