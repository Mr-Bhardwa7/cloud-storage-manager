# docker/oauth.Dockerfile

# Use Node.js as the base image
FROM node:20-alpine AS builder

WORKDIR /app
COPY services/oauth/package*.json ./
RUN npm install

COPY services/oauth/ ./

# Build the Next.js app
RUN npx next build

# Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3002
CMD ["npx", "next", "start"]