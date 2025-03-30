# docker/auth.Dockerfile

# Use Node.js as the base image
FROM node:20-alpine AS builder

WORKDIR /auth
COPY services/auth/package*.json ./
# COPY services/auth/tailwind.config.js ./
COPY services/auth/postcss.config.mjs ./
COPY services/auth/tsconfig.json ./

RUN npm install --legacy-peer-deps

# Copy package.json and package-lock.json from the auth service
COPY services/auth/ ./

# Build the Next.js app
RUN npx next build

# Production image
FROM node:20-alpine
WORKDIR /auth
COPY --from=builder /auth ./
COPY --from=builder /auth/.next ./.next
COPY --from=builder /auth/package*.json ./
# COPY --from=builder /auth/tailwind.config.js ./
COPY --from=builder /auth/postcss.config.mjs ./
COPY --from=builder /auth/node_modules ./node_modules

EXPOSE 3001
CMD ["npx", "next", "start"]

