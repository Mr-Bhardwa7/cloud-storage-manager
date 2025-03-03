# docker/gateway.Dockerfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY services/gateway/package*.json ./
RUN npm install
COPY services/gateway/ ./

# Compile TypeScript if you're using it
RUN npx tsc

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8080
CMD ["npm", "start"]
