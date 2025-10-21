# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Run stage
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server/prod-server.mjs ./server/prod-server.mjs
COPY --from=build /app/package.json ./package.json
RUN npm ci --omit=dev

EXPOSE 4000
CMD ["node", "server/prod-server.mjs"]
