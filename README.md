# Next.js + Hono on Cloudflare Stacks (Bun Workspace & Turborepo)

## Features

- Monorepo: Bun Workspace & Turborepo
- Platform: Cloudflare Pages & Workers
- Backend: Hono
- Frontend: Next.js + SWR + Hono RPC

## Setup

If you are using `nix` and `direnv`, you can run the following commands:

```sh
direnv allow
bun install
```

## Commands

```sh
bun dev # run dev in parallel
```

```sh
bun lint # lint
```

```sh
bun fmt # format
```

```sh
bun check-types # check-types in parallel
```

```sh
bun check # lint & check-types
```
