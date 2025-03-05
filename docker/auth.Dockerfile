# docker/auth.Dockerfile

# Use Node.js as the base image
FROM node:20-alpine AS builder

WORKDIR /app
COPY services/auth/package*.json ./
RUN npm install

# Copy package.json and package-lock.json from the auth service
COPY services/auth/ ./

# Build the Next.js app
RUN npx next build

# Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3001
CMD ["npx", "next", "start"]

