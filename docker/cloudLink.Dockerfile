# docker/cloudLink.Dockerfile

# Use Node.js as the base image
FROM node:20-alpine AS builder

WORKDIR /cloud_link
COPY services/cloud_link/package*.json ./
# COPY services/cloud_link/tailwind.config.js ./
COPY services/cloud_link/postcss.config.mjs ./
COPY services/cloud_link/tsconfig.json ./
RUN npm install --legacy-peer-deps

COPY services/cloud_link/ ./

# Build the Next.js app
RUN npx next build

# Production image
FROM node:20-alpine
WORKDIR /cloud_link
COPY --from=builder /cloud_link ./
COPY --from=builder /cloud_link/.next ./.next
COPY --from=builder /cloud_link/package*.json ./
# COPY --from=builder /cloud_link/tailwind.config.js ./
COPY --from=builder /cloud_link/postcss.config.mjs ./
COPY --from=builder /cloud_link/node_modules ./node_modules

EXPOSE 3002
CMD ["npx", "next", "start"]