# --- Stage 1: base ---
FROM node:22-bullseye AS base

# включаем pnpm через corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /workspace

ENV NODE_ENV=development \
    CI=true \
    PNPM_HOME="/usr/local/share/pnpm" \
    PATH="$PNPM_HOME:$PATH"

# копируем lock-файлы и package.json'ы
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json

# устанавливаем зависимости в отдельный каталог (не перетираемый)
RUN pnpm install --frozen-lockfile

# --- Stage 2: dev environment ---
FROM base AS dev

WORKDIR /workspace

# копируем исходники (без node_modules)
COPY . .

# чтобы node_modules не заменялся при bind-монте, делаем симлинк
EXPOSE 5000

CMD ["pnpm", "run", "dev"]
