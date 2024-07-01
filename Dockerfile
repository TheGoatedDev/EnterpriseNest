# Base Stage
FROM node:20-alpine as base
WORKDIR /app
COPY . .
ENV HUSKY=0

# Dev Dependencies Stage
FROM base as dev-deps
RUN npm install -g pnpm
RUN pnpm install --dev

# Prod Dependencies Stage
FROM base as prod-deps
RUN npm install -g pnpm
RUN pnpm install --prod

# Build Stage
FROM dev-deps as build
RUN pnpm install
RUN pnpm run build

# Runner Stage
FROM base as runner

RUN apk add --no-cache curl

COPY --from=build /app/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules
USER node

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/v1/ping || exit 1

CMD ["node", "dist/index.js"]