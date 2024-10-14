# Base Stage
FROM oven/bun:1.1.30-alpine as base
WORKDIR /app
COPY . .
ENV HUSKY=0

# Dev Dependencies Stage
FROM base as dev-deps
RUN bun install

# Prod Dependencies Stage
FROM base as prod-deps
RUN bun install --frozen-lockfile --production

# Build Stage
FROM dev-deps as build
RUN bun run build

# Runner Stage
FROM base as runner

COPY --from=build --chown=bun:bun /app/dist ./dist
COPY --from=prod-deps --chown=bun:bun /app/node_modules ./node_modules
USER bun


CMD ["bun", "dist/index.js"]