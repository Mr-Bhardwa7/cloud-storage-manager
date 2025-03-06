# fileNest.Dockerfile 

# Use Node.js as the base image
FROM node:20-alpine AS builder

WORKDIR /file_nest
# Copy package.json and package-lock.json
COPY services/file_nest/package*.json ./
# COPY services/file_nest/tailwind.config.js ./
COPY services/file_nest/postcss.config.mjs ./
COPY services/file_nest/tsconfig.json ./
RUN npm install

COPY services/file_nest/ ./

# Build the Next.js app
RUN npx next build

# Production image
FROM node:20-alpine
WORKDIR /file_nest
COPY --from=builder /file_nest ./
COPY --from=builder /file_nest/.next ./.next
COPY --from=builder /file_nest/package*.json ./
# COPY --from=builder /file_nest/tailwind.config.js ./
COPY --from=builder /file_nest/postcss.config.mjs ./
COPY --from=builder /file_nest/node_modules ./node_modules

EXPOSE 3003
CMD ["npx", "next", "start"]