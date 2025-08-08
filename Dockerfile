FROM node:alpine AS base

WORKDIR /usr/src/app
ENV HUSKY=0 CI=true LOG_LEVEL=info

RUN corepack enable
COPY --chown=node:node package.json .
COPY --chown=node:node pnpm-lock.yaml .
COPY --chown=node:node .sapphirerc.json .
COPY --chown=node:node .npmrc .

FROM base AS builder
ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.json .
COPY --chown=node:node src/ src/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS runner

ENV NODE_ENV="production" NODE_OPTIONS="--enable-source-maps"

COPY --chown=node:node assets/ assets/
COPY --chown=node:node --from=builder /usr/src/app/dist dist
COPY --chown=node:node --from=builder /usr/src/app/node_modules node_modules
COPY --chown=node:node --from=builder /usr/src/app/src/.env src/.env

USER node
CMD ["node", "dist/index.js"]
