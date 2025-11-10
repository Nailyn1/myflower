# --- Stage 1: base ---
FROM node:22-bullseye AS base

WORKDIR /workspace

ENV NODE_ENV=development \
    CI=true

COPY package.json package-lock.json ./

COPY apps ./apps
COPY packages ./packages

RUN npm install --workspaces --omit=optional

# --- Stage 2: dev environment ---
FROM base AS dev

WORKDIR /workspace

COPY . .


EXPOSE 5000

CMD ["npm", "run", "dev", "--workspace", "@myflower/backend"]