# files.Dockerfile 


# Use Node.js as the base image
FROM node:20-alpine AS builder

WORKDIR /app
# Copy package.json and package-lock.json
COPY services/files/package*.json ./
RUN npm install

COPY services/files/ ./

# Build the Next.js app
RUN npx next build

# Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3003
CMD ["npx", "next", "start"]