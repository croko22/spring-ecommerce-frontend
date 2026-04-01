# Ecommerce Frontend Nuxt

Frontend base del ecommerce construido con Nuxt y TypeScript.

## Requisitos

- Bun

## Setup

```bash
bun install
cp .env.example .env
```

Variables de entorno:

- `NUXT_PUBLIC_API_BASE`: URL base del backend Spring Boot (default: `http://localhost:8080/api`).

## Desarrollo

```bash
bun run dev
```

## Calidad

```bash
bun run lint
bun run typecheck
```

## Build

```bash
bun run build
```
